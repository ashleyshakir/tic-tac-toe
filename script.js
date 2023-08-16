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
// keep track of turn count
let turnCount = 0
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
    } else {
        e.target.style.backgroundColor = "#8EE4EF"
        playerTurn = "cross"
    }
    // update playerTurn variable with user's name 
    gameInfo.innerText = `${playerTurn} player's turn`
    // remove event listener to prevent further clicking after square is picked
    e.target.removeEventListener("click", play)
    // call function to check if there is a winner
    checkForWinner(playerTurn)
    // increment turn count
    turnCount++
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
    winningCombos.forEach(array => {
         // If the square with every id in the array has a first child element with a cross class, then set crossWins to true
        let winner = array.every(id => allSquares[id].firstChild?.classList.contains(playerTurn))
        if (winner) {
            gameInfo.innerText = `${playerTurn} Wins!!!`
            allSquares.forEach(square => square.removeEventListener("click", play))
           // allSquares.forEach(square => square.replaceWith(square.cloneNode(true))) // this line creates a copy of each square with the same attributes but removes the event listener
            return 
        } 
    })
    if (turnCount === 8){
        gameInfo.innerText = "It's a tie!"
        allSquares.forEach(square => square.removeEventListener("click", play))
    }

}
