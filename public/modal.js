window.onload = function() {

  var modalBtn = document.getElementById("modalBtn"),
      closeModal = document.getElementById("closeCanvas"),
      modal = document.getElementById("openCanvas"),
      clear = document.getElementById("clear-area"),
      send = document.getElementById("send-img"),
      canvas = document.getElementById("myCanvas"),
      cDiv = document.getElementById("canvas-div");
      ctx = canvas.getContext("2d");

  function init() {

    let isDrawing = false,
        lastX = 0,
        lastY = 0;

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
