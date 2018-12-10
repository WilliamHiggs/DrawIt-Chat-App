
$(function() {
   //make connection
	var socket = io.connect("http://localhost:3000");

	//jQuery buttons and inputs
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
    socket.emit("new_message", {message : message.val()});
	});

	//Listen on new_message
	socket.on("new_message", data => {
    if (data.message.trim() == "") {
      alert("Be sure to type a message!"); //@TODO turn this into a modal
    } else {
      feedback.html("");
      message.val("");
      chatroom.append(
        "<p class='message'>" + data.score + "★ " + data.username + ": " + data.message + "</p>"
      );
      scrollToBottom(chatroom[0]);
    }
	});

  socket.on("new_image", data => {
    if (data.source) {
      feedback.html("");
      message.val("");
      chatroom.append(
        "<div>" + data.score + "★ " + data.username + ": " +
        "<br><img class='image' alt='Embedded Image' src='"+ data.source +"'></img></div>"
      );
      scrollToBottom(chatroom[0]);
    }
  });
	//Emit a username
	send_username.click(() => {
    socket.emit("amend_username", {username: username.val()});
		socket.emit("change_username", {username: username.val()});
	});

	//Emit typing
	message.bind("keypress", () => {
		socket.emit("typing");
	});

	//Listen on typing
	socket.on("typing", data => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
	});

  socket.on("amend_username", data => {
    username.html("<h4 id='username'>" + data.score + "★ " + data.username + "</h4>");
  });


    // buttons and inputs for drawing modal
  var modalBtn = document.getElementById("modalBtn");
  var closeModal = document.getElementById("closeCanvas");
  var modal = document.getElementById("openCanvas");
  var clear = document.getElementById("clear-area");
  var send = document.getElementById("send-img");
  var canvas = document.getElementById("myCanvas");
  var cDiv = document.getElementById("canvas-div");
  var ctx = canvas.getContext("2d");

  function init() {

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
      if (!isDrawing) return;
      let penColor = document.getElementById("penColor").value;
      let penWidth = document.getElementById("penWidth").value;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = penWidth;
      ctx.strokeStyle = penColor;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener("mousedown", e => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);
  }

  modalBtn.addEventListener("click", function() {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });

  function clearCanvas() {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  clear.addEventListener("click", function() {
    var exit = confirm("Abandon your masterpiece?");
    if (exit) {
      clearCanvas();
    }
  });

  send.addEventListener("click", function(event) {
    /*
      The dataUrl will provide the image resource from canvas
      will need to close the canvas element/modal
      will need to send the image via the socket.io chat.
    */
    let dataUrl = canvas.toDataURL();
    socket.emit("new_image", {source: dataUrl});

    modal.style.display = "none";
    clearCanvas();
  });

  init();

});
