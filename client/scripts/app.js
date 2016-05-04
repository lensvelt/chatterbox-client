// YOUR CODE HERE:

let app = {

  server: 'https://api.parse.com/1/classes/messages',
  messages: [],
  rooms: {},
  friends: {},
  currentRoom: 'undefined',

  init: () => {
    // setInterval(app.fetch, 2000);
    app.fetch(true);
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
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: (init = false) => {
    if (init) {
      var where = {
        where:
        {
          roomname:
          {
            '$exists': true
          }
        }
      };
    } else {
      let list = [];
      for (room in app.rooms) {
        if (!app.currentRoom) {
          list.push(room);
        }
      }

      var where = {
        where: {
          roomname:
          {
            '$nin': list,
            '$exists': true
          }
        }
      };
    }

    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: where,
      processData: false,

      success: (data) => {
        console.log('chatterbox: messages received');
        app.messages = data.results;
        app.clearMessages();
        for (let message of app.messages) {
          message = app.sanitize(message);
          if (message.roomname === app.currentRoom) { app.addMessage(message); }
          app.addRoom(message.roomname);
        }
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retreive messages', data);
      }
    });

    // TODO calculate counts
    // TODO update display with the counts

  },

  clearMessages: () => {
    $('#chats').empty();
  },

  addMessage: (message) => {
    var friendsClass = (app.friends[app.cleanClassName(message.username)] ) ? '.friend' : '';

    if (app.cleanClassName('' + message.roomname) === app.cleanClassName(app.currentRoom)) {
      $('#chats').append('<p class="' + app.cleanClassName(message.roomname) + ' ' + app.cleanClassName(message.username) + ' ' + friendsClass + '">[' + app.sanitize(message.roomname) + '] <span class="username">' + app.sanitize(message.username) + '</span>: ' + app.sanitize(message.text) + '</p>' );
    } else {
      $('#chats').append('<p class="' + app.cleanClassName(message.roomname) + ' ' + friendsClass + '" style="display: none;">[' + app.sanitize(message.roomname) + '] <span class="username">' + app.sanitize(message.username) + '</span>: ' + app.sanitize(message.text) + '</p>' );
    }

  },

  addRoom: (room) => {
    if (!app.rooms[room]) {
      // append new button
      let $newRoom = $('<button type="button" class="room list-group-item">');
      $newRoom.text(room);
      $newRoom.appendTo($('#roomSelect'));

      // track existing rooms and current room
      app.rooms[room] = true;
      app.currentRoom = room;

      // clear the new rooms input field
      $('#newRoom').val('');
    }
  },

  switchRoom: function() {
    app.currentRoom = this.innerHTML;
    app.fetch();
  
    // // toggle visibility based on selected room
    // $('.' + app.cleanClassName(app.currentRoom)).toggle();
    // app.currentRoom = this.innerHTML;
    // $('.' + app.cleanClassName(app.currentRoom)).toggle();
  },

  addFriend: (friendName) => {
    if (!app.friends[friendName]) {
      $('#friends').append( '<p class="friend">' + friendName + '</p>' );
      $('#chats .' + app.cleanClassName(friendName)).addClass('friend');
      app.friends[friendName] = true;
    }
  },

  handleSubmit: () => {
    let message = {
      roomname: app.currentRoom,
      username: window.location.search.replace('?username=', ''),
      text: $('#text').val()
    };

    app.send(message);
    $('#text').val('');
    app.fetch();
  },

  cleanClassName: (name) => {
    name = '' + name;
    name = name.replace(/[^\w\s]/gi, '');
    return name.replace(/\s/g, '-');
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
    $('#chats').on('click', '.username', function() { app.addFriend( $(this).text() ); } );
    $('#send').on('click', app.handleSubmit);
  }

};