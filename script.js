// grab the gameboard div 
const gameBoard = document.querySelector("#gameboard")
// create array of 9 empty strings - these will hold the game squares
const gameSquares = ["","","","","","","","",""]
// grab the game info p tag
const gameInfo = document.querySelector("#game-info")
// loop through array creating a div with an id number for each index
gameSquares.forEach((_square, index) => {
    const gameSqaure = document.createElement("div")
    gameSqaure.id = index
    gameSqaure.classList.add("square")
    gameBoard.appendChild(gameSqaure)
    gameSqaure.addEventListener("click",play)
})

// set cross to go first - will change later when implementing who goes first
let playerTurn = "cross"
// update playerTurn variable with user's name 
gameInfo.innerText = `${playerTurn} player's turn`

/** 
 * display crosses and circles on gameboard when square clicked
 * */
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
    } else {
        e.target.style.backgroundColor = "#8EE4EF"
        playerTurn = "cross"
    }
    // update playerTurn variable with user's name 
    gameInfo.innerText = `${playerTurn} player's turn`
    // remove event listener to prevent further clicking after square is picked
    e.target.removeEventListener("click", play)
}

