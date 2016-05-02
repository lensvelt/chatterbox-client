// YOUR CODE HERE:

let app = {

  server: 'https://api.parse.com/1/classes/messages',

  init: () => {
    $('.username').on('click', app.addFriend);
    $('#send .submit').on('submit', app.handleSubmit);
  },

  send: (message) => {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent');
        console.log('SUCCESS POST: ', data);
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: () => {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: messages received');
        console.log('SUCCESS GET: ', data);
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retreive messages', data);
      }
    });
  },

  clearMessages: () => {
    $('#chats').empty();
  },

  addMessage: (message) => {
    $('#chats').append( '<p>[' + message.roomname + '] <span class="username">' + message.username + '</span>: ' + message.text + '</p>' );

  },

  addRoom: (room) => {
    $('#roomSelect').append( '<p>' + room + '</p>' );
  },

  addFriend: () => {

  },

  handleSubmit: () => {

  }

};