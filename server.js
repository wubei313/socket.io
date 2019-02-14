const app = require('http').createServer()
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(3000);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

let clientCount = 0
io.on('connection', function (socket) {
    clientCount++
    socket.nickname = 'user' + clientCount
    console.log(socket.nickname + ' connection success')
    //io.emit代表广播，而socket.emit则是自己给自己发送，其实还有个专门的关播，发送给除自己外的所有
    io.emit('message', socket.nickname + ' coming');

    socket.on('message', function (data) {
        console.log(data);
        io.emit('message', socket.nickname + ':' + data)
    });

    socket.on('disconnect', function() {
        io.emit('leave', socket.nickname + ' left')
    })
});