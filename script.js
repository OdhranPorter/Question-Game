// game configuration variables
const moneyOptions = [10, 20, 50, 100] // possible prize amounts
let maxQuestions = 5 // default number of questions per player
let initialTime = 60 // default time per player in seconds

// game state variables
let moneyValue // holds the random prize value for this game
let playerTurn = 1 // tracks which player's turn it is (1 or 2)
let currentTimer // stores the current countdown timer
let questions = [] // array to store questions loaded from the JSON
let usedQuestions = [] // stores questions that have already been asked to avoid duplicates

// player state object - stores data for each player
let players = {
  1: { correct: 0, questionCount: 0, timeLeft: initialTime }, // player 1 info
  2: { correct: 0, questionCount: 0, timeLeft: initialTime }  // player 2 info
}

// dom elements - linking JS to HTML elements
const startScreen = document.getElementById('start-screen')
const gameScreen = document.getElementById('game-screen')
const nextTurnScreen = document.getElementById('next-turn-screen')
const resultScreen = document.getElementById('result-screen')
const moneyValueSpan = document.getElementById('moneyValue')
const playerTurnElem = document.getElementById('playerTurn')
const timeLeftElem = document.getElementById('timeLeft')
const scoreCountElem = document.getElementById('scoreCount')
const maxQuestionsDisplayElem = document.getElementById('maxQuestionsDisplay')
const questionElem = document.getElementById('question')
const answersElem = document.getElementById('answers')
const resultTextElem = document.getElementById('resultText')
const finalScoresElem = document.getElementById('finalScores')
const timerInputElem = document.getElementById('timerInput')
const questionsInputElem = document.getElementById('questionsInput')
const nextTurnBtn = document.getElementById('nextTurnBtn')

// event listeners - responds to user clicks
document.getElementById('startBtn').addEventListener('click', startGame) // when start is clicked
document.getElementById('restartBtn').addEventListener('click', () => location.reload()) // restart reloads the page
nextTurnBtn.addEventListener('click', () => {
  playerTurn = 2 // switch to player 2
  nextTurnScreen.classList.add('hidden') // hide next turn screen
  gameScreen.classList.remove('hidden') // show game screen
  nextQuestion() // start player 2 questions
})

// load questions from json file using fetch
fetch('questions.json')
  .then(response => response.json()) // parse the JSON
  .then(data => { questions = data }) // store questions into array
  .catch(error => { console.error('error loading questions', error) }) // show error if it fails

// start game function - when start button is clicked
function startGame() {
  // get the timer value from input
  const inputTime = parseInt(timerInputElem.value)
  // if input is invalid or less than 1, use 60
  initialTime = isNaN(inputTime) || inputTime <= 0 ? 60 : inputTime

  // get number of questions from input
  const inputQuestions = parseInt(questionsInputElem.value)
  // if input is invalid or less than 1, use 5
  maxQuestions = isNaN(inputQuestions) || inputQuestions <= 0 ? 5 : inputQuestions
  maxQuestionsDisplayElem.innerText = maxQuestions

  // set both players' timeLeft to the chosen time
  players[1].timeLeft = initialTime
  players[2].timeLeft = initialTime

  // choose random money prize from the list
  moneyValue = moneyOptions[Math.floor(Math.random() * moneyOptions.length)]
  moneyValueSpan.innerText = '€' + moneyValue

  // hide start screen, show game screen
  startScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')

  playerTurn = 1 // make sure player 1 goes first
  nextQuestion() // start first question
}

// function to load next question
function nextQuestion() {
  // check if player answered all questions
  if (players[playerTurn].questionCount >= maxQuestions) {
    if (playerTurn === 1) {
      // if player 1 is done, show next turn screen
      gameScreen.classList.add('hidden')
      nextTurnScreen.classList.remove('hidden')
      return
    } else {
      // if both done, end the game
      endGame()
      return
    }
  }

  resetTimer() // start countdown timer again
  playerTurnElem.innerText = "player " + playerTurn + " turn"
  scoreCountElem.innerText = players[playerTurn].correct

  // filter out used questions
  let availableQuestions = questions.filter(q => !usedQuestions.includes(q.question))
  if (availableQuestions.length === 0) {
    endGame()
    return
  }

  // choose a random question from available ones
  let randomIndex = Math.floor(Math.random() * availableQuestions.length)
  let currentQuestion = availableQuestions[randomIndex]
  usedQuestions.push(currentQuestion.question) // mark it as used

  // show the question
  questionElem.innerText = currentQuestion.question
  answersElem.innerHTML = '' // clear old answers

  // create answer buttons
  currentQuestion.answers.forEach((answer, index) => {
    let btn = document.createElement('button')
    btn.innerText = answer
    btn.addEventListener('click', () => answerQuestion(currentQuestion, index)) // check answer
    answersElem.appendChild(btn)
  })
}

// check if player's answer is correct
function answerQuestion(questionObj, selectedIndex) {
  clearInterval(currentTimer) // stop the timer
  players[playerTurn].questionCount++ // count the question
  if (selectedIndex === questionObj.correct) {
    players[playerTurn].correct++ // if right, add to score
  }
  scoreCountElem.innerText = players[playerTurn].correct
  nextQuestion() // go to next question
}

// timer function - counts down every second
function resetTimer() {
  clearInterval(currentTimer) // clear any old timer
  players[playerTurn].timeLeft = initialTime
  timeLeftElem.innerText = players[playerTurn].timeLeft

  // set interval runs every 1000ms (1 second)
  currentTimer = setInterval(() => {
    players[playerTurn].timeLeft-- // decrease time
    timeLeftElem.innerText = players[playerTurn].timeLeft
    if (players[playerTurn].timeLeft <= 0) {
      clearInterval(currentTimer) // stop timer
      players[playerTurn].questionCount++ // still counts as question
      nextQuestion()
    }
  }, 1000)
}

// when game ends, decide winner
function endGame() {
  clearInterval(currentTimer) // stop timer
  gameScreen.classList.add('hidden') // hide game

  let resultText = ''
  // no one got anything right
  if (players[1].correct === 0 && players[2].correct === 0) {
    resultText = 'neither player answered any questions correctly no winner'
  }
  // player 1 wins by more correct
  else if (players[1].correct > players[2].correct) {
    let winnings = players[1].timeLeft * moneyValue
    resultText = 'player 1 wins €' + winnings
  }
  // player 2 wins by more correct
  else if (players[2].correct > players[1].correct) {
    let winnings = players[2].timeLeft * moneyValue
    resultText = 'player 2 wins €' + winnings
  }
  // tie in correct answers, check time
  else {
    if (players[1].timeLeft > players[2].timeLeft) {
      let winnings = players[1].timeLeft * moneyValue
      resultText = 'player 1 wins €' + winnings
    } else if (players[2].timeLeft > players[1].timeLeft) {
      let winnings = players[2].timeLeft * moneyValue
      resultText = 'player 2 wins €' + winnings
    } else {
      resultText = 'it is a tie'
    }
  }

  // show final scores
  const finalScores = "player 1 " + players[1].correct + " out of " + maxQuestions + " and player 2 " + players[2].correct + " out of " + maxQuestions
  resultTextElem.innerText = resultText
  finalScoresElem.innerText = finalScores
  resultScreen.classList.remove('hidden') // show result screen
}
