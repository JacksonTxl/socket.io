/**
 * Created by zhangfei on 2017/7/6.
 */
'use strict'
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8585);

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
// var sockets=[];
io.on('connection', function (socket) {
    // sockets.push({
    //     id:socket.id,
    //     socket:socket
    // });
    console.log(io.sockets);

    socket.emit('news1', { hello: 'hello world1 !' });
    socket.on('my other event', function (data) {

        // for(var i = 0; i<sockets.length;i++){
        //     console.log(sockets.length+':'+sockets[i].id+'======'+socket.id);
        //     if(sockets[i].id!=socket.id){
        //         sockets[i].socket.emit('news1', { hello: 'hello noon !' });
        //         console.log(sockets[i].id);
        //     }
        // }
    });

});
io.on('disconnection', function (socket) {
    socket.emit('news1', { hello: 'disconnection!' });
    sockets.unshift();
});