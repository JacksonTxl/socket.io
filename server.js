/**
 * Created by zhangfei on 2017/7/6.
 */

const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(1200);

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


const sockets=[];

io.on('connection', function (socket) {
    sockets.push({
        id:socket.id,
        socket:socket
    });
    console.log(io.sockets);

    socket.emit('login', { hello: '恭喜链接成功！可选择餐厅：' + SelectDinner.diningRooms.join(',') });
    socket.on('select', function (data) {
      if (SelectDinner.selected.length < 2) {
        SelectDinner.selectRooms(SelectDinner.diningRooms, 6);
        io.sockets.emit('selected', {selected: '已选择餐厅：' + SelectDinner.selected.join(',')});
      } else{
        SelectDinner.selectRooms(SelectDinner.selected, 2);
        io.sockets.emit('lastSelected', {selected: '最终选择餐厅：' + SelectDinner.lastSelect});

      }
        // for(var i = 0; i<sockets.length;i++){
        //     console.log(sockets.length+':'+sockets[i].id+'======'+socket.id);
        //     if(sockets[i].id!=socket.id){
        //         sockets[i].socket.emit('news1', { hello: 'hello noon !' });
        //         console.log(sockets[i].id);
        //     }
        // }
    });
  socket.on('reset', function (data) {
    SelectDinner.init();
    io.sockets.emit('resetFinish');
  });

});
io.on('disconnection', function (socket) {
    socket.emit('login', { hello: 'disconnection!' });
    sockets.unshift();
});


const SelectDinner = {
  lastSelect: '',
  selected: [],
  diningRooms: ['重庆小面', '蒸菜', '面必居', '楼下炒菜', '罗森', '饭小餐'],
  selectRooms: (arr, num) => {
    const roomIndex = Math.floor(Math.random() * num);
    if (num === 6) {
      SelectDinner.selected.push(arr[roomIndex]);
    } else {
      SelectDinner.lastSelect = arr[roomIndex];
    }

  },
  init: () => {
    SelectDinner.selected = [];
  }
};