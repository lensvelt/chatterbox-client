// YOUR CODE HERE:

let app = {

  server: 'https://api.parse.com/1/classes/messages',
  messages: [],
  rooms: {},
  currentRoom: 'undefined',

  init: () => {
    // setInterval(app.fetch, 2000);
    app.fetch();
    app.addEventHandlers();
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
        $('#text').val('');
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
        app.messages = data.results;
        app.clearMessages();
        for (let message of app.messages) {
          message = app.sanitize(message);
          app.addMessage(message);
          app.addRoom(message.roomname);
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
    console.log(JSON.stringify(message));

    if (app.cleanClassName('' + message.roomname) === app.cleanClassName(app.currentRoom)) {
      $('#chats').append('<p class="' + app.cleanClassName('' + message.roomname) + '">[' + app.sanitize(message.roomname) + '] <span class="username">' + app.sanitize(message.username) + '</span>: ' + app.sanitize(message.text) + '</p>' );
    } else {
      $('#chats').append('<p class="' + app.cleanClassName('' + message.roomname) + '" style="display: none;">[' + app.sanitize(message.roomname) + '] <span class="username">' + app.sanitize(message.username) + '</span>: ' + app.sanitize(message.text) + '</p>' );
    }

  },

  addRoom: (room) => {
    if (!app.rooms[room]) {
      $('#roomSelect').append( '<p class = "room">' + room + '</p>' );
      app.rooms[room] = true;
    }
  },

  switchRoom: function() {
  
    // toggle visibility based on selected room
    $('.' + app.cleanClassName(app.currentRoom)).toggle();
    app.currentRoom = this.innerHTML;
    $('.' + app.cleanClassName(app.currentRoom)).toggle();
  },

  addFriend: () => {
    console.log('Added Friend');
  },

  handleSubmit: () => {
    // console.log( app.currentRoom, window.location.search.replace('?username=', ''), $('#text').val() ); // COME BACK HERE DAN :)
    let message = {
      roomname: app.currentRoom,
      username: window.location.search.replace('?username=', ''),
      text: $('#text').val()
    };

    app.send(message);


  },

  cleanClassName: (name) => {
    return name.toLowerCase().replace(/\s/g, '-');
  },

  sanitize: (message) => {
    for (let key in message) {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(message[key]));
      message[key] = div.innerHTML;
    }
    return message;
  },

  addEventHandlers: () => {
    $('#newRoomSubmit').on('click', () => app.addRoom( $('#newRoom').val() ) );
    $('#roomSelect').on('click', '.room', app.switchRoom);
    $('.username').on('click', app.addFriend);
    $('#send').on('click', app.handleSubmit);
  }

};