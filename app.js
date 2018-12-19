
const express = require("express");
const app = express();
const generator = require("./randomWordGenerator/generator.js");

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

let server = app.listen(process.env.PORT || 3000);

const io = require("socket.io")(server);

//listen on every connection
io.on("connection", socket => {

  //default username
  socket.username = generator.randomUserName();
  socket.score = 0;
  socket.emit("amend_username", {
    username: socket.username,
    score: socket.score
  });

  socket.on("change_username", data => {
    data.username = generator.randomUserName();
    socket.username = data.username;
    socket.emit("amend_username", {
      username: socket.username,
      score: socket.score
    });
  });

  socket.on("new_message", data => {
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username,
      score: socket.score
    });
  });

  socket.on("new_image", data => {
  //socket.score++; this is how we'd increase score in the future
    io.sockets.emit("new_image", {
      message: data.message,
      username: socket.username,
      score: socket.score,
      image: socket.image,
      source: data.source
    });
  });

  socket.on("typing", data => {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });

  socket.on("disconnect", data => {
    socket.broadcast.emit("user_disconnect", {
      username: socket.username
    });
  });
});
