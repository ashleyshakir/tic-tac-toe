// grab the game elements div
const gameElements = document.querySelector("#play-game")
// grab the gameboard div 
const gameBoard = document.querySelector("#gameboard")
// grab the yes and no play again choices div
const choicesDiv = document.querySelector("#play-again-choices")
// create array of 9 empty strings - these will hold the game squares
const gameSquares = ["","","","","","","","",""]
// grab the game info p tag
const gameInfo = document.querySelector("#game-info")
// keep track of turn count
let turnCount = 0
// set cross to go first - will change later when implementing who goes first
let playerTurn = "cross"
// grab form element and both player one and player two input fields
const form = document.querySelector("form")
const player1Input = document.querySelector("#player1-txt")
const player2Input = document.querySelector("#player2-txt")
// create global variables that will hold each players name
let playerOne = ""
let playerTwo = ""
/**
 * intial game setup
 */
function createBoard(){
    //cross always goes first!
    playerTurn = "cross"
    // set the display element for game elements to flex
    gameElements.style.display = "flex"
    // set the display element for the main menu form to none
    form.style.display = "none"
    // clears the div so yes and no buttons no longer show
    choicesDiv.innerText = ""
    // sets the count to 0 each time a new game begins
    turnCount = 0
    // update playerTurn variable with user's name 
    gameInfo.innerText = `${playerOne}'s turn`
    // loop through array creating a div with an id number for each index
    gameSquares.forEach((_square, index) => {
        const gameSqaure = document.createElement("div")
        gameSqaure.id = index
        gameSqaure.classList.add("square")
        gameBoard.appendChild(gameSqaure)
        gameSqaure.addEventListener("click",play)
    })
}

/**
 * start game when players have entered their names
 */
function startGame(){
    // set the display element for game elements to none
    gameElements.style.display = "none"
    form.addEventListener("submit", function(event){
        event.preventDefault()
        playerOne = player1Input.value
        playerTwo = player2Input.value
        // only create the board if both players have entered their names
        if (playerOne !== "" && playerTwo !== ""){
            createBoard()
        }
    })
}

startGame()

/** 
 * display crosses and circles on gameboard when square clicked
*/
function play(e) {
    const display = document.createElement("img")
    display.classList.add(playerTurn)
    display.src = `images/${playerTurn}.jpeg`
    display.alt = playerTurn
    e.target.appendChild(display)
    // if it is the cross player's turn then change the square color to purple and switch to circle's turn
    // else - if it is the circle player's turn then change sqaure color to blue and switch to cross's turn
    if(playerTurn === "cross"){
        e.target.style.backgroundColor = "#C6A3E3"
        playerTurn = "circle"
        gameInfo.innerText = `${playerTwo}'s turn`
    } else {
        e.target.style.backgroundColor = "#8EE4EF"
        playerTurn = "cross"
        gameInfo.innerText = `${playerOne}'s turn`
    }
    // update playerTurn variable with user's name 
    // gameInfo.innerText = `${playerTurn} player's turn`
    // remove event listener to prevent further clicking after square is picked
    e.target.removeEventListener("click", play)
    // call function to check if there is a winner
    checkForWinner(playerTurn)
    // increment turn count
    turnCount++
    console.log(turnCount)
}

/* winning squares: use square id to reference each square 
 * horizontal: [0,1,2], [3,4,5], [6,7,8]
 * vertical: [0,3,6], [1,4,7], [2,5,8]
 * diagonal: [0,4,8], [2,4,6] */
/**
 * check the gameboard for a winner
 */
function checkForWinner(playerTurn){
    const allSquares = document.querySelectorAll(".square")
    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]
    // allows for dynamic programming
    if(playerTurn === "cross"){
        playerTurn = "circle"
    } else {
        playerTurn = "cross"
    }
    // For each array within the winningCombos array, check if the elements in that array satisfy a specific condition using .every method
    winningCombos.forEach((array,index) => {
         // If the square with every id in the array has a first child element with a cross class, then set crossWins to true
        let winner = array.every(id => allSquares[id].firstChild?.classList.contains(playerTurn))
        if (winner) {
            gameInfo.innerText = `${playerTurn} Wins!!!`
            allSquares.forEach(square => square.removeEventListener("click", play))
            setTimeout(resetGame,2000)
           // allSquares.forEach(square => square.replaceWith(square.cloneNode(true))) // this line creates a copy of each square with the same attributes but removes the event listener
            return 
        } else if(turnCount === 9 && !winner){
            gameInfo.innerText = "It's a tie!"
            allSquares.forEach(square => square.removeEventListener("click", play))
        }
    })
}
 /**
 * reset the game based on user input 
 */
function resetGame() {
    gameInfo.innerText = "Wanna play again?"
    const yes = document.createElement("p")
    yes.innerText = "Yes"
    yes.classList.add("play-again")
    const no = document.createElement("p")
    no.innerText = "No"
    no.classList.add("play-again")
    choicesDiv.appendChild(yes)
    choicesDiv.appendChild(no)
    yes.addEventListener("click", () => {
        gameBoard.innerText = ""
        createBoard()
    })
    no.addEventListener("click", () => {
        // show main menu or maybe show leaderboard?
    })
}
