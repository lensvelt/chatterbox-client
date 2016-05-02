// YOUR CODE HERE:

let app = {

  parseAPI: 'https://api.parse.com/1/classes/messages',

  init: () => {
    

  },

  // send: (message) => {
  //   let post = $.ajax({
  //     url: app.parseAPI,
  //     type: 'POST',
  //     data: JSON.stringify(message),
  //     contentType: 'application/json'
  //   });

  //   post.done((response) => {
  //     console.log('hello');
  //     console.log(response);
  //   });

  send: (message) => {
    $.ajax({
      url: app.parseAPI,
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

  fetch: () => {

  }

};