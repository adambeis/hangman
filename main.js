let words = [];
let indexWord = 0;
let word = "";
let len = 0;
let fail = 0;
let win = false;
let success = 0;
let attempts = 5;
let guessWord = [];
let rightWords = [];
let wrongWords = [];

const init = () => {
  fetch("./words.json")
    .then((response) => response.json())
    .then((json) => {
      words = json;
      setNewWord();
      const modal = document.getElementById("modalHistory");
      modal.addEventListener("click", closeModal);
    });
};

init();

const setNewWord = () => {
  let { initialDrawing } = canvasCreator();
  indexWord = Math.floor(Math.random() * words.length);
  word = words[indexWord].word.toUpperCase();
  words.splice(indexWord, 1);
  len = word.length;
  guessWord = new Array(len).fill("_");
  showGuessWord();
  fail = 0;
  win = false;
  success = 0;
  removeClass();
  var buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.disabled = false;
  }
  initialDrawing();
};

const addClass = (className) => {
  var element = document.getElementById("guessWord");
  element.classList.add(className);
};

const removeClass = () => {
  var element = document.getElementById("guessWord");
  element.classList.remove("correct");
  element.classList.remove("wrong");
};

const setGuessWord = (word) => {
  let text = document.getElementById("guessWord");
  text.innerText = word;
};

const showGuessWord = () => {
  showWord = guessWord.join("");
  setGuessWord(showWord);
};

const revealGuessWord = () => {
  let { initialDrawing } = canvasCreator();
  initialDrawing();
  setGuessWord(word);
  if (fail - 1 !== attempts) wrongWords.push(word);
  fail = attempts + 1;
};

const disableButton = (id) => {
  let button = document.getElementById(id.toLowerCase());
  button.disabled = true;
};

const isDisabled = (id) => {
  let button = document.getElementById(id.toLowerCase());
  if (button) return button.disabled;
  else return false;
};

document.addEventListener("keydown", ({ key }) => {
  var letters = /^[A-Za-z]+$/;
  if (key.match(letters) && !isDisabled(key))
    if (key.length === 1) evaluate(key);
});

const keydown = (key) => {
  evaluate(key);
};

const evaluate = (key) => {
  let isLetterFound = false;
  if (win) return;
  if (fail < attempts) {
    key = key.toUpperCase();
    for (let i = 0; i < len; i++) {
      if (key === word[i]) {
        guessWord[i] = key;
        success++;
        isLetterFound = true;
        if (success === len) {
          addClass("correct");
          rightWords.push(word);
          win = true;
        }
      }
    }
    showGuessWord();
    disableButton(key);
  }
  if (!isLetterFound && fail <= attempts) {
    drawMan(fail);
    fail++;
    if (fail - 1 === attempts) {
      wrongWords.push(word);
      setGuessWord("Game Over");
      addClass("wrong");
    }
  }
};

const openHistory = () => {
  var modal = document.getElementById("modalHistory");
  modal.classList.remove("hidden");

  var wordsRight = document.getElementById("rightWords");
  wordsRight.innerText = rightWords.join("\n");

  var wordsWrong = document.getElementById("wrongWords");
  wordsWrong.innerText = wrongWords.join("\n");
};

const closeModal = (e) => {
  const modal = document.getElementById("modalHistory");
  if (e.target == modal) {
    modal.classList.add("hidden");
  }
};

const canvas = document.getElementById("canvas");

const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  //For drawing lines
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };
  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
    context = canvas.getContext("2d");
  };
  const body = () => {
    drawLine(70, 40, 70, 80);
  };
  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };
  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };
  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };
  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };
  //initial frame
  const initialDrawing = () => {
    //clear canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //bottom line
    drawLine(10, 130, 130, 130);
    //left line
    drawLine(10, 10, 10, 131);
    //top line
    drawLine(10, 10, 70, 10);
    //small top line
    drawLine(70, 10, 70, 20);
  };
  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 0:
      head();
      break;
    case 1:
      body();
      break;
    case 2:
      leftArm();
      break;
    case 3:
      rightArm();
      break;
    case 4:
      leftLeg();
      break;
    case 5:
      rightLeg();
      break;
    default:
      break;
  }
};
