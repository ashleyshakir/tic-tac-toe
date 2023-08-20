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
// set winner name equal to an empty string
let winnerName = ""
// grab form element and both player one and player two input fields
const form = document.querySelector("form")
const player1Input = document.querySelector("#player1-txt")
const player2Input = document.querySelector("#player2-txt")
// grab the leaderboard
const leaderboard = document.querySelector("#board")
// grab the leaderboard button on the main menu 
const leaderboardButton = document.querySelector("#leaderboard-button")
// grab the leaderboard column elements
const columns = document.querySelectorAll('.board-column')
// grab the back to menu button and call the start game function when it is clicked
const returnButton = document.querySelector("#return-button")
returnButton.addEventListener("click",menuScreen)
// grab the single player button 
const singlePlayerButton = document.querySelector("#play-ai")
// set single mode to false unless single player button is clicked
let singleMode = false
// track if a winner is found
let winnerFound = false
// create objects for each player
let playerOneObj = {
    name: "",
    winCount: 0
}
let playerTwoObj ={
    name: "",
    winCount: 0
}
// create an array that will hold player names and player win counts for displaying on leaderboard
let playerStats = [[],[]]

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
    // show the return to menu button
    // returnButton.style.display = "flex" not sure if I want to show this here yet
    // clear all previous game elements
    choicesDiv.innerText = ""
    gameInfo.innerText = ""
    gameBoard.innerText = ""
    // set the count to 0 each time a new game begins
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
 * display menu screen elements
 */
function menuScreen(){
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
    // set leaderboard button to original color
    leaderboardButton.style.backgroundColor = "#D9D9D9"
    // hide the return to menu button
    returnButton.style.display = "none"
    // add event listener to the leaderboard button
    leaderboardButton.addEventListener("click",openLeaderboard)
}

/**
 * start game when players have entered their names
 */
function startGame(){
    menuScreen()
    form.addEventListener("submit", function(event){
        event.preventDefault()
        singleMode = false
        // reset player win counts 
        playerOneObj.winCount = 0
        playerTwoObj.winCount = 0
        // set player names to inputed values 
        playerOneObj.name = player1Input.value
        playerTwoObj.name = player2Input.value
        // only create the board if both players have entered their names
        // add shake effect if input box is left emoty
        if (playerOneObj.name !== "" && playerTwoObj.name !== ""){
            createBoard()
            if (!playerStats[0].includes(playerOneObj.name)){
                playerStats[0].push(playerOneObj.name)
                playerStats[1].push(playerOneObj.winCount)
            }
            if (!playerStats[0].includes(playerTwoObj.name)){
                playerStats[0].push(playerTwoObj.name)
                playerStats[1].push(playerTwoObj.winCount)
            }
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
    })
    singlePlayerButton.addEventListener("click",function(){
        singleMode = true
        playerOneObj.name = player1Input.value
        playerTwoObj.name = "Computer"
        if (playerOneObj.name !== ""){
            createBoard()
        } else if(playerOneObj.name === ""){
            player1Input.classList.add("shake")
            setTimeout(()=>{
                player1Input.classList.remove("shake")
            },500)
        }
    })
    // retrieve top players from localStorage and display on board
    const savedTopPlayers = localStorage.getItem("topPlayers")
    if(savedTopPlayers){
        const parsedTopPlayers = JSON.parse(savedTopPlayers)
        playerStats = parsedTopPlayers
        updateLeaderboard()
    }
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
    // functionality for single player mode
    if (playerTurn === "circle" && singleMode === true && !winnerFound){
        const getSquares = document.querySelectorAll(".square")
        const emptySquares = Array.from(getSquares).filter(square => square.childElementCount === 0)
        const computerPlay = emptySquares[Math.floor(Math.random()*emptySquares.length)]
        playerTurn = "circle"
        gameInfo.innerText = `${playerTwoObj.name}'s turn`
        setTimeout(function(){
            const display = document.createElement("img")
            display.classList.add(playerTurn)
            display.src = `images/${playerTurn}-black.jpeg`
            display.alt = playerTurn
            computerPlay.appendChild(display)
            computerPlay.style.backgroundColor = "#8EE4EF"
            computerPlay.removeEventListener("click", play)
            playerTurn = "cross"
            gameInfo.innerText = `${playerOneObj.name}'s turn`
            turnCount++
            checkForWinner(playerTurn)
        },1000)
    }
}

/* winning squares: use square id to reference each square 
 * horizontal: [0,1,2], [3,4,5], [6,7,8]
 * vertical: [0,3,6], [1,4,7], [2,5,8]
 * diagonal: [0,4,8], [2,4,6] */
/**
 * check the gameboard for a winner
 */

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
    // set the winner name equal to the player who just took their turn
    if(playerTurn === "cross"){
        playerTurn = "circle" 
        winnerName = playerTwoObj.name
    } else {
        playerTurn = "cross"
        winnerName = playerOneObj.name
    }

    // For each array within the winningCombos array, check if the elements in that array satisfy a specific condition using .every method
    winningCombos.forEach(array => {
         // If the square with every id in the array has a first child element with a cross class, then set winner to true
        let winner = array.every(id => allSquares[id].firstChild?.classList.contains(playerTurn))
        // if winner is true then display who wins, remove event listener from all squares, set winnerFound to true and call resetGame function
        if (winner) {
            gameInfo.innerText = `${winnerName} Wins!!!`
            allSquares.forEach(square => square.removeEventListener("click", play))
            setTimeout(resetGame,2000)
            winnerFound = true
            // update win count
            let playerIndex = playerStats[0].indexOf(winnerName)
            if(winnerName === playerOneObj.name && winnerName !== ""){
                playerStats[1][playerIndex] += 1
            } else if(winnerName === playerTwoObj.name && winnerName !== ""){
                playerStats[1][playerIndex] += 1
            } 
            return 
        }
    })
    // if turn count is 9 (every square has been clicked) and winnerFound is false then display it is a tie, remove event listener from all squares and call resetGame function
    if(turnCount === 9 && !winnerFound){
        gameInfo.innerText = "It's a tie!"
        allSquares.forEach(square => square.removeEventListener("click", play))
        winnerName = ""
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
        winnerFound = false
        createBoard()
    })
    no.addEventListener("click", () => {
        // return to menu 
        menuScreen()
        winnerFound = false
        // turn leaderboard div green to show it has been updated 
        if (winnerName !== ""){
            leaderboardButton.style.backgroundColor = "#8EE4AF" 
        }
        // update leader board with player stats
        updateLeaderboard()
    })
}
/**
 * display leaderboard elements
 */
function openLeaderboard(){
    // show leaderboard div
    leaderboard.style.display = "flex"
    // hide main menu
    form.style.display = "none"
    title.innerText = "LEADERBOARD" 
    returnButton.style.display = "flex"
}
/**
 * update leaderboard elements
 */
function updateLeaderboard(){
    // // clears the board 
    const allNames = document.querySelectorAll(".name")
    const allCounts = document.querySelectorAll(".win-count")
    allNames.forEach(name => {
        name.remove()
    })
    allCounts.forEach(count => {
        count.remove()
    })
    // map over the winCount array and save an array of indices
    let playerIndices = playerStats[1].map((_winCount, index) => index)
    // sort playerIndices array by comparing the values of the playerStats winCount array 
    playerIndices.sort((a,b)=> playerStats[1][b] - playerStats[1][a])
    // create variable to specify max number of players to display
    const topFive = 5
    // calculate the minimum value between 5 and the length of the playerIndices array to make sure
    // the loop doesn't iterate beyond the available number of players or the top 5
    for (let i = 0; i < Math.min(topFive,playerIndices.length); i++){
        // save the current player index
        const currentIndex = playerIndices[i]
        let playerName = document.createElement("p")
        playerName.classList.add("name")
        columns[0].appendChild(playerName)
        playerName.innerText = playerStats[0][currentIndex]
        let playerWinCount = document.createElement("p")
        playerWinCount.classList.add("win-count")
        columns[1].appendChild(playerWinCount)
        playerWinCount.innerText = playerStats[1][currentIndex]
    }
    // save to local storage
    localStorage.setItem("topPlayers",JSON.stringify(playerStats))
}   

