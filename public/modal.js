window.onload = function() {

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

    let dataUrl = canvas.toDataURL();
    socket.emit("new_image", {source: dataUrl});

    modal.style.display = "none";
    clearCanvas();
  });

  init();

}
