function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
  
      socket.on('new_comment', (data) => {
        if (socket.request.isAuthenticated()) {
          io.emit('new_comment', data);
        } else {
          socket.emit('auth_error', 'Пользователь не авторизован')
        }
      });
  
      socket.on('disconnect', () => {
        console.log('Пользователь отключился');
      });
    });
}
  
module.exports = setupSocketHandlers;
  