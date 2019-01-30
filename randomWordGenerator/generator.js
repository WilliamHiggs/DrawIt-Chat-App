var word = require("./wordList.js")

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomWordSelect(wordList) {
  var randomInt = getRandomInt(wordList.length);
  return wordList[randomInt];
}

function makeSentence(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = {
  randomUserName: function randomUsername() {

    var sentence = "";

    sentence +=  " " + randomWordSelect(word.adj);
    sentence +=  " " + randomWordSelect(word.nou);

    return makeSentence(sentence);
  }
}
