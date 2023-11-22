function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
      console.log('Новое соединение установлено');
  
      socket.on('new_comment', (data) => {
        io.emit('new_comment', data);
      });
  
      socket.on('disconnect', () => {
        console.log('Пользователь отключился');
      });
    });
}
  
module.exports = setupSocketHandlers;
  