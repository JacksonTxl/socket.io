/**
 * Created by zhangfei on 2017/7/6.
 */

const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(1201);

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
    sockets.push(socket.id);

    socket.emit('login', { hello: socket.id + ', 恭喜链接成功！可选择餐厅：' + SelectDinner.diningRooms.join(',') });
    if (SelectDinner.selected.length >= 0 && SelectDinner.selected.length < 2) {
      socket.emit('selected', {selected: '已选择餐厅：' + SelectDinner.selected.join(',')});
    } else if (SelectDinner.selected.length === 2 && !SelectDinner.lastSelect) {
      socket.emit('selected', {selected: '已选择餐厅：' + SelectDinner.selected.join(',')});
      socket.emit('lastSelected', {selected: '最终选择餐厅：' + SelectDinner.lastSelect});
    } else if (SelectDinner.selected.length === 2 && SelectDinner.lastSelect) {
      socket.emit('selected', {selected: '已选择餐厅：' + SelectDinner.selected.join(',')});
      socket.emit('lastSelected', {selected: '最终选择餐厅：' + SelectDinner.lastSelect});
      socket.emit('disabled');
    } else {
      socket.emit('selected', {selected: '已选择餐厅：' + SelectDinner.selected.join(',')});
      socket.emit('lastSelected', {selected: '最终选择餐厅：' + SelectDinner.lastSelect});
      io.sockets.emit('disabled');
    }
    socket.on('select', function (data) {
      if (SelectDinner.selected.length < 2) {
        SelectDinner.selectRooms(SelectDinner.diningRooms, 6);
        io.sockets.emit('selected', {selected: '已选择餐厅：' + SelectDinner.selected.join(',')});
        socket.emit('disabled');
      } else if (SelectDinner.selected.length === 2)  {
        SelectDinner.selectRooms(SelectDinner.selected, 2);
        io.sockets.emit('lastSelected', {selected: '最终选择餐厅：' + SelectDinner.lastSelect});
        io.sockets.emit('disabled');
      } else {
        io.sockets.emit('disabled');
      }
    });
  socket.on('reset', function (data) {
    SelectDinner.init();
    io.sockets.emit('resetFinish');
  });

});
io.on('disconnection', function (socket) {
    socket.emit('login', { hello: 'disconnection!' });
    sockets.splice(sockets.indexOf(socket.id), 1);
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
    SelectDinner.lastSelect = '';
  }
};