// initializers 

let playerAWinCount = 0
let playerBWinCount = 0 
let drawCount = 0 

let currentPlayer = 'a'
let startingPlayer = currentPlayer

let playerAScoreArr = []
let playerBScoreArr = []
const possibleWinCombos = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]]

let totalTurns = 0 

// == caching dom element references 

const gameStateDescriptionElem = document.querySelector('.game-state-description-elem')
const nextGameBtn = document.querySelector('.next-game-btn')

const gameBoardGridElems = document.querySelectorAll('.game-board-grid-section div')

const playerAWinCountElem = document.querySelector('.player-a-win-count-elem')
const drawCountElem = document.querySelector('.draws-count-elem')
const playerBWinCountElem = document.querySelector('.player-b-win-count-elem')

const resetGameBtn = document.querySelector('.reset-game-btn')

//== set up event listeners

for (let gameBoardGridElem of gameBoardGridElems) {
    gameBoardGridElem.addEventListener('click', handleGameTileSelect)
}

nextGameBtn.addEventListener('click', handleNextGame)

resetGameBtn.addEventListener('click', handleResetGame)


//== create event handlers

function handleGameTileSelect(event) {
    let selectedTile = event.target
    let gridNum = Number(selectedTile.dataset.num)
    
   
    if (currentPlayer === 'a'){ 
        selectedTile.textContent = 'x'  // update with symbol or image
        totalTurns++
        playerAScoreArr.push(gridNum)
        selectedTile.setAttribute('disabled', 'disabled')
        
        togglePlayer()
        updateTurnPlayer()

        if (winConCheck(possibleWinCombos,playerAScoreArr)) {
            gameStateDescriptionElem.textContent = 'Player A WINS!'
            nextGameBtn.style.display = 'block'
            playerAWinCount++
            playerAWinCountElem.textContent = playerAWinCount
            totalTurns = 0 
        }
    } else {
        selectedTile.textContent = 'o'  // update with symbol or image
        totalTurns++
        playerBScoreArr.push(gridNum)
        selectedTile.setAttribute('disabled', 'disabled')
        
        togglePlayer()
        updateTurnPlayer()
        
        if (winConCheck(possibleWinCombos,playerBScoreArr)) {
            gameStateDescriptionElem.textContent = 'Player B WINS!'
            nextGameBtn.style.display = 'block'
            playerBWinCount++
            playerBWinCountElem.textContent = playerBWinCount
            totalTurns = 0 
        }
    }

    if (totalTurns === 9) {
        gameStateDescriptionElem.textContent = `It's a DRAW!`
        nextGameBtn.style.display = 'block'
        drawCount++
        drawCountElem.textContent = drawCount
        totalTurns = 0 
    }
}

// check for win con 
    // display next game button
    // update game state display to highlight winner
    // update scores

// next game button
function handleNextGame() {
    // reset board
    resetBoard()
    updateTurnPlayer()
    nextGameBtn.style.display = 'none'


    //ensure the starting player alternates between games
    if (startingPlayer === 'a') {
        startingPlayer = 'b'
    } else {
        startingPlayer = 'a'
    }

    currentPlayer = startingPlayer
}

// reset game button
function handleResetGame() {
    currentPlayer = 'a'
    playerAWinCount = 0
    playerBWinCount = 0 
    drawCount = 0 

    resetBoard()
    updateTurnPlayer()

    nextGameBtn.style.display = 'none'
    playerAWinCountElem.textContent = playerAWinCount
    playerBWinCountElem.textContent = playerBWinCount
    drawCountElem.textContent = drawCount
}



//== other functions 
function updateTurnPlayer(){
    gameStateDescriptionElem.textContent = `Player ${currentPlayer.toUpperCase()}'s Turn`
}

function togglePlayer(){
    if (currentPlayer === 'a') {
        currentPlayer = 'b'
    } else if (currentPlayer === 'b') {
        currentPlayer = 'a'
    }
}

function resetBoard() {
    for (let gameBoardGridElem of gameBoardGridElems) {
        gameBoardGridElem.textContent = ""
    }
    playerAScoreArr = []
    playerBScoreArr = []
}


// test function 
// i want two arrays and i want the numbers of the first array to be contianed somewhere in the second array. 
function winConCheck(winConArr,playerScoreArr){
    let numbersInARow = 0
    let j = 0                          //outer index
   
    while (numbersInARow !== 3 && j < winConArr.length) {
        numbersInARow = 0 
        for (i = 0; i < winConArr[j].length; i++) {
            if (playerScoreArr.includes(winConArr[j][i])) {
                numbersInARow ++
            } 
        }
        j++
    }
    
    if (numbersInARow === 3) {
        return true
    } else {
        return false
    }
    
}



//== game initializations (maybe)