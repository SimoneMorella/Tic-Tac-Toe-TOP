const gameBoard = (() => {
    let board = ["", "", "",
                 "", "", "",
                 "", "", ""];
    const setMark = (index, mark) => {
        if (index < board.length) {
            board[index] = mark;
        }
        else {
            return;
        }
    }
    const getFieldMark = (index) => {
        if (index < board.length) {
            return board[index];
        }
        else {
            return;
        }
    }
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }
    // board to cancel later, this is just to see if it works
    return {setMark, getFieldMark, reset, board};
    
})();

const player = (mark, name) => {
    let playerMark = mark;
    let playerName = name;

    const getMark = () => {
        return playerMark;
    }

    const getName = () => {
        return playerName;
    }

    return {getMark, getName};
};

const startGameLogic = (() => {
    let firstPlayerName; 
    let secondPlayerName;
    const gameSection = document.querySelector('#game');
    const nameSection = document.querySelector('#background');
    const newGameBtn = document.querySelector('#restart');
    const form = document.querySelector('form');
    // for over 1024px width
    const startMsg = document.querySelector('#startMSG');
    const messageBox = document.querySelector('#message');
    const btnBox = document.querySelector('#btnBox');
    const trisGrid = document.querySelector('#trisGrid');
    const nameBox = document.querySelector('#nameBox');

    function isViewportOverWidth(width) {
        return window.innerWidth > width;
    }
    //domani mi finisco la questione bottoni poi mando, quando imparo i keyframe bene ci aggiungo tutte le anim

    document.querySelector('#start').addEventListener('click', (event) => {
        if (form.checkValidity()) {
            event.preventDefault();
            firstPlayerName = document.querySelectorAll('.inputField')[0].value;
            secondPlayerName = document.querySelectorAll('.inputField')[1].value;
            if (isViewportOverWidth(1024)) {
                startMsg.classList.remove('lg:flex');
                messageBox.classList.remove('lg:hidden');
                messageBox.classList.add('animate-spawn');
                btnBox.classList.remove('lg:hidden');
                btnBox.classList.add('animate-spawn');
                trisGrid.classList.remove('lg:hidden');
                trisGrid.classList.add('animate-spawn');
                nameBox.classList.add('lg:hidden');
            }
            else {
                gameSection.classList.remove('hidden');
                gameSection.scrollIntoView({behavior: 'smooth'});
                setTimeout(() => {
                    nameSection.classList.add('hidden');
                }, 500);
            }
            gameFunction.initializePlayers(firstPlayerName, secondPlayerName);   
        }
    })

    newGameBtn.addEventListener('click', () => {
        document.querySelectorAll('.inputField')[0].value = '';
        document.querySelectorAll('.inputField')[1].value = '';
        
        if (isViewportOverWidth(1024)) {
            nameBox.classList.remove('lg:hidden');
            messageBox.classList.add('lg:hidden');
            btnBox.classList.add('lg:hidden');
            trisGrid.classList.add('lg:hidden');
            startMsg.classList.add('lg:flex');           
        }
        else {
            nameSection.classList.remove('hidden');
            gameSection.scrollIntoView();
            setTimeout(() => {
                nameSection.scrollIntoView({ behavior: 'smooth'});
                gameSection.classList.add('hidden');
            }, 700);
        }
    })
    
    return {getName1: () => firstPlayerName,
            getName2: () => secondPlayerName};
})();


const gameFunction = (() => {
    let round = 1;
    let gameOver = false;
    let player1;
    let player2;

    const initializePlayers = (name1, name2) => {
    player1 = player('X', startGameLogic.getName1());
    player2 = player('O', startGameLogic.getName2());
    }
    
    const playTurn = (boxIndex) => {
        if (gameBoard.board[boxIndex] === '') {
            gameBoard.setMark(boxIndex, getPlayerMark());
            if (winLogic()) {
                gameOver = true;
                //sistemare display message winner
                gameUI.setResultMessage(getCurrentPlayerName());
                return;
            }
            if (round === 9) {
                gameUI.setResultMessage('Draw');
                gameOver = true;
                return;
            }
            round++;
            gameUI.setTurnMessage(getCurrentPlayerName());
        }
        
        }
        
        const winLogic = () => {
            const winCombination = 
            [   [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ]
    
            for (let combination of winCombination) {
                let [a, b, c] = combination;
                if (gameBoard.board[a] !== '' &&
                    gameBoard.board[a] === gameBoard.board[b] &&
                    gameBoard.board[b] === gameBoard.board[c]
                ) {
                    console.log(`Player ${gameBoard.board[a]} won the game`)
                    return true;
                }
            }
        }    

    const getPlayerMark = () => {
        return round % 2 === 1 ? player1.getMark() : player2.getMark();
    }

    const getCurrentPlayerName = () => {
        return round % 2 === 1 ? player1.getName() : player2.getName();

    }

    const reset = () => {
        round = 1;
        gameOver = false;
    }

    const getGameOver = () => {
        return gameOver;
    }

    return {playTurn, reset, getGameOver, initializePlayers};
})();


const gameUI = (() => {
    const gridBoxes = document.querySelectorAll(".box");
    const resetBtn = document.querySelector('#reset');
    const messageBox = document.querySelector('#message');
    const newGameBtn = document.querySelector('#restart');

    gridBoxes.forEach((box) => {
        box.addEventListener('click', (e) => {
            if (gameFunction.getGameOver() || e.target.textContent !== '') {
                return;
            }
            gameFunction.playTurn(parseInt(e.target.dataset.index));
            updateGrid();
        })
    });
    const updateGrid = () => {
        for (let i = 0; i < gridBoxes.length; i++) {
            gridBoxes[i].textContent = gameBoard.getFieldMark(i);
            if (gridBoxes[i].textContent === 'O') {
                gridBoxes[i].classList.add('text-tangerine');
            }
            else {
                gridBoxes[i].classList.remove('text-tangerine');
            }
        }
    }

    resetBtn.addEventListener('click', () => {
        gameBoard.reset();
        gameFunction.reset();
        updateGrid();
        messageBox.textContent = 'First player starts Playing!';
    })

    newGameBtn.addEventListener('click', () => {
        setTimeout(() => {
            gameBoard.reset();
            gameFunction.reset();
            updateGrid();
            messageBox.textContent = 'First player starts Playing!';
        },1300)

    })

    const setTurnMessage = (name) => {
        messageBox.textContent = `Player ${name} turn.`
    }

    const setResultMessage = (winner) => {
        if (winner === 'Draw') {
            messageBox.textContent = 'It is a draw!';
        }
        else {
            messageBox.textContent = `Player ${winner} wins!`;
        }
    }
    return {setTurnMessage, setResultMessage}
})();