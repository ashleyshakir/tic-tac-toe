// grab h1 header
const title = document.querySelector("h1")
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
// grab the leaderboard
const leaderboard = document.querySelector("#board")
// grab the leaderboard button on the main menu 
const leaderboardButton = document.querySelector("#leaderboard-button")
// create objects for each player
let playerOneObj = {
    name: "",
    winCount: 0
}
let playerTwoObj ={
    name: "",
    winCount: 0
}
/**
 * intial game setup
 */
function createBoard(){
    // cross always goes first - for now
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
    gameInfo.innerText = `${playerOneObj.name}'s turn`
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
    // display correct title
    title.innerText = "TIC TAC TOE"
    // set the display element for the main menu form to flex
    form.style.display = "flex"
    // clear the input fields
    player1Input.value = ""
    player2Input.value = ""
    // set the display element for game elements to none - this hides the gameboard/game info/play again choices
    gameElements.style.display = "none"
    // set the display element for the leaderboard to none
    leaderboard.style.display = "none"
    form.addEventListener("submit", function(event){
        event.preventDefault()
        playerOneObj.name = player1Input.value
        playerTwoObj.name = player2Input.value
        // only create the board if both players have entered their names
        // add shake effect if input box is left emoty
        if (playerOneObj.name !== "" && playerTwoObj.name !== ""){
            createBoard()
        } else if(playerOneObj.name === "" && playerTwoObj.name !== ""){
            player1Input.classList.add("shake")
            setTimeout(() =>{
                player1Input.classList.remove("shake")
            },500)
        } else if(playerOneObj.name !== "" && playerTwoObj.name === ""){
            player2Input.classList.add("shake")
            setTimeout(() =>{
                player2Input.classList.remove("shake")
            },500)
        } else if(playerOneObj.name === "" && playerTwoObj.name === ""){
            player1Input.classList.add("shake")
            player2Input.classList.add("shake")
            setTimeout(() =>{
                player1Input.classList.remove("shake")
                player2Input.classList.remove("shake")
            },500)
        }
        console.log(`player ones name is ${playerOneObj.name}`)
        console.log(`player twos name is ${playerTwoObj.name}`)
    })
    leaderboardButton.addEventListener("click",openLeaderboard)
}

startGame()

/** 
 * display crosses and circles on gameboard when square clicked
*/
function play(e) {
    const display = document.createElement("img")
    display.classList.add(playerTurn)
    display.src = `images/${playerTurn}-black.jpeg`
    display.alt = playerTurn
    e.target.appendChild(display)
    // if it is the cross player's turn then change the square color to purple and switch to circle's turn
    // else - if it is the circle player's turn then change sqaure color to blue and switch to cross's turn
    if(playerTurn === "cross"){
        e.target.style.backgroundColor = "#C6A3E3"
        playerTurn = "circle"
        gameInfo.innerText = `${playerTwoObj.name}'s turn`
    } else {
        e.target.style.backgroundColor = "#8EE4EF"
        playerTurn = "cross"
        gameInfo.innerText = `${playerOneObj.name}'s turn`
    }
    // remove event listener to prevent further clicking after square is picked
    e.target.removeEventListener("click", play)
    // increment turn count
    turnCount++
    // call function to check if there is a winner
    checkForWinner(playerTurn)
}

/* winning squares: use square id to reference each square 
 * horizontal: [0,1,2], [3,4,5], [6,7,8]
 * vertical: [0,3,6], [1,4,7], [2,5,8]
 * diagonal: [0,4,8], [2,4,6] */
/**
 * check the gameboard for a winner
 */
// set the winner name equal to the player who just took their turn
let winnerName = ""
function checkForWinner(playerTurn){
    // grab all elements with the square class
    const allSquares = document.querySelectorAll(".square")
    // create an array of all winning combos
    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]
    // allows for dynamic programming - each time the checkForWinner function is called - playerTurn will be equal to whatever it wasn't the last time it was called
    if(playerTurn === "cross"){
        playerTurn = "circle" 
        winnerName = playerTwoObj.name
        console.log(`playerTurn is ${playerTurn} and the winnerName: ${winnerName}`)
    } else {
        playerTurn = "cross"
        winnerName = playerOneObj.name
        console.log(`playerTurn is ${playerTurn} and the winnerName: ${winnerName}`)
    }
    // track if a winner is found
    let winnerFound = false
    // For each array within the winningCombos array, check if the elements in that array satisfy a specific condition using .every method
    winningCombos.forEach((array,index) => {
         // If the square with every id in the array has a first child element with a cross class, then set winner to true
        let winner = array.every(id => allSquares[id].firstChild?.classList.contains(playerTurn))
        // if winner is true then display who wins, remove event listener from all squares, set winnerFound to true and call resetGame function
        if (winner) {
            gameInfo.innerText = `${winnerName} Wins!!!`
            allSquares.forEach(square => square.removeEventListener("click", play))
            setTimeout(resetGame,2000)
            winnerFound = true
           return 
        }
    })
    // if turn count is 9 (every square has been clicked) and winnerFound is false then display it is a tie, remove event listener from all squares and call resetGame function
    if(turnCount === 9 && !winnerFound){
        gameInfo.innerText = "It's a tie!"
        allSquares.forEach(square => square.removeEventListener("click", play))
        setTimeout(resetGame,2000)
    }
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
        // return to main menu
        startGame()
        leaderboardButton.style.backgroundColor = "#8EE4AF" // turn leaderboard div green to show it has been updated
        leaderboardButton.addEventListener("click",openLeaderboard)
    })
}

function openLeaderboard(){
    // show leaderboard div
    leaderboard.style.display = "flex"
    // hide main menu
    form.style.display = "none"
    title.innerText = "LEADERBOARD" 
    console.log(`player 1 is ${playerOneObj.name}`)
    console.log(`player 2 is ${playerTwoObj.name}`)
    console.log(`winner is ${winnerName}`)

}