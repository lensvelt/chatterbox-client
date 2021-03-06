// YOUR CODE HERE:

let app = {

  server: 'https://api.parse.com/1/classes/messages',
  messages: [],
  rooms: {},
  friends: {},
  currentRoom: '666',

  init: () => {
    app.fetch(true);
    app.addEventHandlers();
    setInterval(app.fetch, 2000);
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
          },
          order: '-createdAt'
        }
      };
    } else {
      let list = [];
      for (room in app.rooms) {
        if (room !== app.currentRoom) {
          list.push(room);
        }
      }

      var where = {
        where: {
          roomname:
          {
            '$nin': list,
            '$exists': true
          },
          order: '-createdAt'
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
          message.roomname = (message.roomname === undefined) ? 'General' : message.roomname.trim();
          console.log(message.roomname, app.currentRoom, message.roomname === app.currentRoom);
          if (message.roomname === app.currentRoom) { 
            app.addMessage(message); 
          }
          app.addRoom(message.roomname, true);
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
    var friendsClass = (app.friends[app.cleanClassName(message.username)] ) ? '.friend' : '';

    let $msgPanel = $('<div class="panel panel-default">');


    let $msgBody = $('<div class="panel-body">');
    $msgBody.text(message.text);
    $msgBody.appendTo($msgPanel);
    $msgPanel.appendTo($('#chats'));

    let $msgUser = $('<p>');
    $msgUser.addClass(app.cleanClassName(message.username));
    $msgUser.text('[' + message.roomname + '] ' + message.username + ':');
    $msgUser.prependTo($msgBody);
  },

  addRoom: (room, init = false) => {
    if (!app.rooms[room]) {
      // append new button
      let $newRoom = $('<button type="button" class="room list-group-item">');
      $newRoom.text(room);
      $newRoom.appendTo($('#roomSelect'));

      // track existing rooms and current room
      app.rooms[room] = true;

      if (!init) {
        app.currentRoom = room;
      }
      // clear the new rooms input field
      $('#newRoom').val('');
    }
  },

  switchRoom: function() {
    // highlight current room
    $('.room').removeClass('list-group-item-success');
    $(this).addClass('list-group-item-success');

    // track current room
    app.currentRoom = this.innerHTML;

    // refetch messages
    app.fetch();
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

  addEventHandlers: () => {
    $('#newRoomSubmit').on('click', () => app.addRoom( $('#newRoom').val() ) );
    $('#roomSelect').on('click', '.room', app.switchRoom);
    $('#chats').on('click', '.username', function() { app.addFriend( $(this).text() ); } );
    $('#send').on('click', app.handleSubmit);
  }
};
