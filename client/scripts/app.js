// YOUR CODE HERE:

let app = {

  server: 'https://api.parse.com/1/classes/messages',

  init: () => {
    $('.username').on('click', app.addFriend);
    $('#send .submit').on('submit', app.handleSubmit);

    // setInterval(app.fetch, 2000);
    app.fetch();
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

        app.clearMessages();
        for (let message of data.results) {
          app.addMessage(message);
        }
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
    $('#chats').append('<p>[' + app.sanitize(message.roomname) + '] <span class="username">' + app.sanitize(message.username) + '</span>: ' + app.sanitize(message.text) + '</p>' );

  },

  addRoom: (room) => {
    $('#roomSelect').append( '<p>' + room + '</p>' );
  },

  addFriend: () => {

  },

  handleSubmit: () => {

  },

  sanitize: (message) => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(message));
    return div.innerHTML;
  }



};