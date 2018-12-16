
$(function() {

	//var socket = io.connect("http://localhost:3000");

	var message = $("#message");
	var username = $("#username");
	var send_message = $("#send_message");
	var send_username = $("#send_username");
	var chatroom = $("#chatroom");
	var feedback = $("#feedback");

  // Added autoscroll to bottom
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(scrollToBottom);
  var config = {childList: true, subtree: true, attributes: true};
  observer.observe(chatroom[0], config);

  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

	//Emit message
	send_message.click(() => {
    socket.emit("new_message", {message: message.val()});
	});

  $(document).keypress(event => {
    if (event.which == 13) {
      send_message.click();
    }
  });

	//Listen on new_message
	socket.on("new_message", data => {
    if (data.message.trim() == "") {
      alert("Be sure to type a message!"); //@TODO turn this into a modal
    } else {
      feedback.html("");
      message.val("");
      chatroom.append(
        "<p class='message'>" + data.score + "★ " +
        data.username + ": " + data.message + "</p>"
      );
      scrollToBottom(chatroom[0]);
    }
	});

  socket.on("new_image", data => {
    if (data.source) {
      feedback.html("");
      chatroom.append(
        "<div><p class='image_message'>" + data.score + "★ " +
        data.username + ": " + "</p>" +
        "<br><img class='image' alt='Embedded Image' src='"+
        data.source +"'></img></div>"
      );
      scrollToBottom(chatroom[0]);
    }
  });

	//Emit a username
	send_username.click(() => {
    socket.emit("amend_username", {
      username: username.val()
    });
		socket.emit("change_username", {
      username: username.val()
    });
	});

	//Emit typing
	message.bind("keypress", () => {
		socket.emit("typing");
	});

	//Listen on typing
	socket.on("typing", data => {
		feedback.html(
      "<p class='show'><i>" + data.username +
      " is typing a message..." + "</i></p>"
    );
    setTimeout(() => {
      feedback.html("");
    }, 3000);
	});

  socket.on("amend_username", data => {
    username.html(
      "<h4 id='username'>" + data.score + "★ " + data.username + "</h4>"
    );
  });

  socket.on("user_disconnect", data => {
    feedback.html(
      "<p class='show'><i>" + data.username + " left the chat" + "</i></p>"
    );
    setTimeout(() => {
      feedback.html("");
    }, 3000);
  });
});
