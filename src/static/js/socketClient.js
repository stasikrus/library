const socket = io();

document.getElementById('comment-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const comment = document.getElementById('comment-text').value;
  socket.emit('new_comment', { comment: comment });
  document.getElementById('comment-text').value = '';
});

socket.on('new_comment', function(data) {
  const commentsDiv = document.getElementById('comments');
  const newComment = document.createElement('p');
  newComment.textContent = data.comment;
  commentsDiv.appendChild(newComment);
});

socket.on('auth_error', function(message) {
  alert(message);
});
