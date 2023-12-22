// == initializers and game variables

let playerAWinCount = 0
let playerBWinCount = 0 
let drawCount = 0 

let currentPlayer = 'a'
let startingPlayer = currentPlayer

let playerAScoreArr = []
let playerBScoreArr = []
const possibleWinCombos = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]]
let winningCombo = []

let totalTurns = 0 

let playerADisplayTokenCount = 5
let playerBDisplayTokenCount = 5


let audioPlayerA = new Audio('audio/squelch.mp3')
let audioPlayerB = new Audio('audio/squash.mp3')
let audioWin = new Audio('audio/success.mp3')
let audioDraw = new Audio('audio/coin.mp3')


// == caching dom element references 

const gameStateDescriptionElem = document.querySelector('.game-state-description-elem')
const nextGameBtn = document.querySelector('.next-game-btn')

const gameBoardGridElems = document.querySelectorAll('.game-board-grid-section div')

const playerAWinCountElem = document.querySelector('.player-a-win-count-elem')
const drawCountElem = document.querySelector('.draws-count-elem')
const playerBWinCountElem = document.querySelector('.player-b-win-count-elem')

const resetGameBtn = document.querySelector('.reset-game-btn')


//== event listeners

for (let gameBoardGridElem of gameBoardGridElems) {
    gameBoardGridElem.addEventListener('click', handleGameTileSelect)
}

nextGameBtn.addEventListener('click', handleNextGame)

resetGameBtn.addEventListener('click', handleResetGame)


//== create event handlers

function handleGameTileSelect(event) {
    let selectedTile = event.target
    let gridNum = Number(selectedTile.dataset.num)

    if (playerAScoreArr.includes(gridNum)||playerBScoreArr.includes(gridNum)||nextGameBtn.style.display == 'block'){
        return
    }
   
    if (currentPlayer === 'a'){
        //if player A clicks tile 
        displayTokenImage(selectedTile)
        selectedTile.classList.add("animate__animated")
        selectedTile.classList.add("animate__jello")
        audioPlayerA.play()
        totalTurns++
        playerAScoreArr.push(gridNum)
        selectedTile.setAttribute('disabled', 'disabled')
        
        removePlayerSideDisplayToken()
        togglePlayer()
        updateTurnPlayer()

        if (winConCheck(possibleWinCombos,playerAScoreArr)) {           
            gameStateDescriptionElem.textContent = 'Player A WINS!'
            audioWin.play()
            winAnimation()
            nextGameBtn.style.display = 'block'
            playerAWinCount++
            playerAWinCountElem.textContent = playerAWinCount
            totalTurns = 0 
        }

    } else {          
        //if player B clicks tile                                                
        displayTokenImage(selectedTile)
        selectedTile.classList.add("animate__animated")
        selectedTile.classList.add("animate__jello")
        audioPlayerB.play()
        totalTurns++
        playerBScoreArr.push(gridNum)
        selectedTile.setAttribute('disabled', 'disabled')
        
        removePlayerSideDisplayToken()
        togglePlayer()
        updateTurnPlayer()
        
        if (winConCheck(possibleWinCombos,playerBScoreArr)) {
            gameStateDescriptionElem.textContent = 'Player B WINS!'
            audioWin.play()
            winAnimation()
            nextGameBtn.style.display = 'block'
            playerBWinCount++
            playerBWinCountElem.textContent = playerBWinCount
            totalTurns = 0 
        }
    }

    if (totalTurns === 9) {
        //testing for draw                                           
        gameStateDescriptionElem.textContent = `It's a DRAW!`
        audioDraw.play()
        nextGameBtn.style.display = 'block'
        drawCount++
        drawCountElem.textContent = drawCount
    }
}

// next game button
function handleNextGame() {
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

function removePlayerSideDisplayToken(){
    if (currentPlayer === 'a') {
        const playerSideDisplayTokenElem = document.querySelector('.left-aside div')
        playerSideDisplayTokenElem.remove()
        playerADisplayTokenCount--
    } else {
        const playerSideDisplayTokenElem = document.querySelector('.right-aside div')
        playerSideDisplayTokenElem.remove()
        playerBDisplayTokenCount--
    }
}

function resetBoard() {
    // resetting game board tiles 
    for (let gameBoardGridElem of gameBoardGridElems) {
        gameBoardGridElem.style.backgroundImage = 'none'
        gameBoardGridElem.classList.remove("animate__animated")
        gameBoardGridElem.classList.remove("animate__jello")
    }

    // resetting display tokens for player A
    for (i = 0; i < 5 - playerADisplayTokenCount; i++){
        const newPlayerADisplayTokenElem = document.createElement('div')
        newPlayerADisplayTokenElem.classList.add("animate__animated")
        newPlayerADisplayTokenElem.classList.add("animate__jello")
        const playerADisplayTokenAside = document.querySelector('.left-aside')
        playerADisplayTokenAside.appendChild(newPlayerADisplayTokenElem)
        audioPlayerA.play()
    }

    // restting display tokens for player B
    for (i = 0; i < 5 - playerBDisplayTokenCount; i++){
        const newPlayerBDisplayTokenElem = document.createElement('div')
        newPlayerBDisplayTokenElem.classList.add("animate__animated")
        newPlayerBDisplayTokenElem.classList.add("animate__jello")
        const playerBDisplayTokenAside = document.querySelector('.right-aside')
        playerBDisplayTokenAside.appendChild(newPlayerBDisplayTokenElem)
        audioPlayerB.play()
    }
    
    // resetting winning tile display if there was a winner
    if (winningCombo.length === 3) {
         for (i = 0; i < 3; i++) {
            let winningTile = document.querySelector(`.tile-${winningCombo[i]}`)
            winningTile.style.backgroundColor = 'rgba(255, 255, 255, 0)'
        }
    }
   
    playerAScoreArr = []
    playerBScoreArr = []
    winningCombo = [] 

    totalTurns = 0 

    playerADisplayTokenCount = 5
    playerBDisplayTokenCount = 5
}

function displayTokenImage(selectedTile) {
    
    if (currentPlayer === 'a') {
        selectedTile.style.backgroundImage = 'url(css/sushi-roll-pixel-art.png)'
    } else {
        selectedTile.style.backgroundImage = 'url(css/nigiri-pixel-art.png)'
    }
}

function winConCheck(winConArr,playerScoreArr){
/* to test for a win condition each tile clicked on by a player is added to their score array. this score aray is then checked against an array of smaller arrays containg all possible win combos as integers from 1 to 9 (left to right, top to bottom) eg. a win through the middle row would be [4,5,6]. a winning combo array is built as part of the testing which if filled meets the win condition. This array can be used later. */ 

    let j = 0                           //outer array index
   
    while (winningCombo.length !== 3 && j < winConArr.length) {
        winningCombo = [] 
        for (i = 0; i < 3; i++) {
            if (playerScoreArr.includes(winConArr[j][i])) {
                winningCombo.push(winConArr[j][i])
            } 
        }
        j++
    }
    
    if (winningCombo.length === 3) {
        return true
    } else {
        return false
    }
}

function winAnimation() {
    for (i = 0; i < 3; i++) {
        let winningTile = document.querySelector(`.tile-${winningCombo[i]}`)
        winningTile.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    }
}
