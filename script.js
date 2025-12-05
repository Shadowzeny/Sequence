class SequenceGame {
    constructor() {
        this.boardSize = 10;
        this.board = [];
        this.playerCards = [];
        this.aiCards = [];
        this.deck = [];
        this.currentPlayer = 'player';
        this.selectedCard = null;
        this.playerSequences = 0;
        this.aiSequences = 0;
        this.gameOver = false;
        
        this.initializeGame();
        this.attachEventListeners();
    }
    
    initializeGame() {
        this.createBoard();
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.renderBoard();
        this.renderPlayerCards();
        this.updateGameStatus("Click on a card, then click on a matching board space to place your token.");
    }
    
    createBoard() {
        // Create a 10x10 board with card values
        // Standard Sequence board layout with corners as wild cards
        this.board = [];
        
        // Define the card layout for the Sequence board
        const cardLayout = [
            ['A♠', 'K♠', 'Q♠', 'J♠', '10♠', '9♠', '8♠', '7♠', '6♠', '5♠'],
            ['4♠', '3♠', '2♠', 'A♥', 'K♥', 'Q♥', 'J♥', '10♥', '9♥', '8♥'],
            ['7♥', '6♥', '5♥', '4♥', '3♥', '2♥', 'A♣', 'K♣', 'Q♣', 'J♣'],
            ['10♣', '9♣', '8♣', '7♣', '6♣', '5♣', '4♣', '3♣', '2♣', 'A♦'],
            ['K♦', 'Q♦', 'J♦', '10♦', '9♦', '8♦', '7♦', '6♦', '5♦', '4♦'],
            ['3♦', '2♦', 'A♠', 'K♠', 'Q♠', 'J♠', '10♠', '9♠', '8♠', '7♠'],
            ['6♠', '5♠', '4♠', '3♠', '2♠', 'A♥', 'K♥', 'Q♥', 'J♥', '10♥'],
            ['9♥', '8♥', '7♥', '6♥', '5♥', '4♥', '3♥', '2♥', 'A♣', 'K♣'],
            ['Q♣', 'J♣', '10♣', '9♣', '8♣', '7♣', '6♣', '5♣', '4♣', '3♣'],
            ['2♣', 'A♦', 'K♦', 'Q♦', 'J♦', '10♦', '9♦', '8♦', '7♦', '6♦']
        ];
        
        // Create board with card values and state
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const isCorner = (row === 0 && col === 0) || 
                                (row === 0 && col === 9) || 
                                (row === 9 && col === 0) || 
                                (row === 9 && col === 9);
                
                this.board[row][col] = {
                    card: isCorner ? 'WILD' : cardLayout[row][col],
                    token: null, // null, 'player', or 'ai'
                    isCorner: isCorner
                };
            }
        }
    }
    
    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = [];
        
        // Create two of each card for a standard Sequence deck
        for (let deckNum = 0; deckNum < 2; deckNum++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    this.deck.push(rank + suit);
                }
            }
        }
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    dealCards() {
        // Deal 7 cards to each player
        for (let i = 0; i < 7; i++) {
            this.playerCards.push(this.deck.pop());
            this.aiCards.push(this.deck.pop());
        }
    }
    
    renderBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const cellData = this.board[row][col];
                
                if (cellData.isCorner) {
                    cell.classList.add('corner');
                    cell.innerHTML = `
                        <div class="joker-card">
                            <div class="joker-symbol">🃏</div>
                            <div>WILD</div>
                        </div>
                    `;
                } else {
                    const cardData = this.parseCard(cellData.card);
                    cell.innerHTML = `
                        <div class="mini-card">
                            <div class="mini-card-rank">${cardData.rank}</div>
                            <div class="mini-card-suit ${cardData.color}">${cardData.suitSymbol}</div>
                            <div class="mini-card-rank">${cardData.rank}</div>
                        </div>
                    `;
                }
                
                if (cellData.token === 'player') {
                    cell.classList.add('player-token');
                    const token = document.createElement('div');
                    token.className = 'token';
                    cell.appendChild(token);
                } else if (cellData.token === 'ai') {
                    cell.classList.add('ai-token');
                    const token = document.createElement('div');
                    token.className = 'token';
                    cell.appendChild(token);
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                boardElement.appendChild(cell);
            }
        }
    }
    
    renderPlayerCards() {
        const cardsElement = document.getElementById('player-cards');
        cardsElement.innerHTML = '';
        
        this.playerCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            // Parse the card to get rank and suit
            const cardData = this.parseCard(card);
            
            // Create card structure
            const topLeftCorner = document.createElement('div');
            topLeftCorner.className = 'card-corner top-left';
            topLeftCorner.innerHTML = `${cardData.rank}<br>${cardData.suit}`;
            topLeftCorner.classList.add(cardData.color);
            
            const center = document.createElement('div');
            center.className = 'card-center';
            center.innerHTML = `<div class="card-rank">${cardData.rank}</div><div class="card-suit ${cardData.color}">${cardData.suitSymbol}</div>`;
            
            const bottomRightCorner = document.createElement('div');
            bottomRightCorner.className = 'card-corner bottom-right';
            bottomRightCorner.innerHTML = `${cardData.rank}<br>${cardData.suit}`;
            bottomRightCorner.classList.add(cardData.color);
            
            cardElement.appendChild(topLeftCorner);
            cardElement.appendChild(center);
            cardElement.appendChild(bottomRightCorner);
            
            if (this.selectedCard === index) {
                cardElement.classList.add('selected');
            }
            
            cardElement.addEventListener('click', () => this.selectCard(index));
            cardsElement.appendChild(cardElement);
        });
    }
    
    parseCard(cardString) {
        // Parse card string like "A♠" into rank, suit, and color
        let rank, suit;
        
        // Handle 10 as a special case
        if (cardString.startsWith('10')) {
            rank = '10';
            suit = cardString.substring(2);
        } else {
            rank = cardString.substring(0, cardString.length - 1);
            suit = cardString.substring(cardString.length - 1);
        }
        
        // Determine color and symbol
        let color, suitSymbol;
        switch (suit) {
            case '♥':
                color = 'red';
                suitSymbol = '♥';
                break;
            case '♦':
                color = 'red';
                suitSymbol = '♦';
                break;
            case '♣':
                color = 'black';
                suitSymbol = '♣';
                break;
            case '♠':
                color = 'black';
                suitSymbol = '♠';
                break;
            default:
                color = 'black';
                suitSymbol = suit;
        }
        
        return { rank, suit, color, suitSymbol };
    }
    
    selectCard(index) {
        if (this.currentPlayer !== 'player' || this.gameOver) return;
        
        this.selectedCard = index;
        this.renderPlayerCards();
        this.highlightMatchingCards(this.playerCards[index]);
        this.updateGameStatus(`Selected ${this.playerCards[index]}. Now click on a matching board space.`);
    }
    
    highlightMatchingCards(selectedCard) {
        // Clear all existing highlights
        document.querySelectorAll('.board-cell').forEach(cell => {
            cell.classList.remove('highlighted');
        });
        
        // Highlight matching cards on the board
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cellData = this.board[row][col];
                
                // Highlight if card matches and is not already occupied
                if (cellData.token === null && (cellData.isCorner || cellData.card === selectedCard)) {
                    const cellElement = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
                    if (cellElement) {
                        cellElement.classList.add('highlighted');
                    }
                }
            }
        }
    }
    
    clearHighlights() {
        document.querySelectorAll('.board-cell').forEach(cell => {
            cell.classList.remove('highlighted');
        });
    }
    
    handleCellClick(row, col) {
        if (this.currentPlayer !== 'player' || this.gameOver) return;
        
        if (this.selectedCard === null) {
            this.updateGameStatus("Please select a card first.");
            return;
        }
        
        const cellData = this.board[row][col];
        const selectedCard = this.playerCards[this.selectedCard];
        
        // Check if the move is valid
        if (cellData.token !== null) {
            this.updateGameStatus("This space is already occupied!");
            return;
        }
        
        if (!cellData.isCorner && cellData.card !== selectedCard) {
            this.updateGameStatus("The card doesn't match this space!");
            return;
        }
        
        // Place the token
        this.board[row][col].token = 'player';
        this.playerCards.splice(this.selectedCard, 1);
        this.selectedCard = null;
        
        // Clear highlights after placing token
        this.clearHighlights();
        
        // Check for sequences
        this.checkForSequences('player');
        
        // Render the updated board
        this.renderBoard();
        this.renderPlayerCards();
        
        // Check for win condition
        if (this.playerSequences >= 2) {
            this.endGame('player');
            return;
        }
        
        // Switch to AI turn
        this.currentPlayer = 'ai';
        this.updateGameStatus("AI is thinking...");
        document.getElementById('current-player').textContent = 'AI';
        
        // AI makes a move after a delay
        setTimeout(() => this.aiTurn(), 1500);
    }
    
    aiTurn() {
        if (this.gameOver) return;
        
        // Simple AI strategy: try to complete sequences or block player
        let bestMove = this.findBestAIMove();
        
        if (bestMove) {
            // Make the move
            this.board[bestMove.row][bestMove.col].token = 'ai';
            this.aiCards.splice(bestMove.cardIndex, 1);
            
            // Check for sequences
            this.checkForSequences('ai');
            
            // Render the updated board
            this.renderBoard();
            
            // Check for win condition
            if (this.aiSequences >= 2) {
                this.endGame('ai');
                return;
            }
        }
        
        // Switch back to player
        this.currentPlayer = 'player';
        this.updateGameStatus("Your turn! Select a card and then a board space.");
        document.getElementById('current-player').textContent = 'You';
        
        // AI draws a card
        if (this.aiCards.length < 7 && this.deck.length > 0) {
            this.aiCards.push(this.deck.pop());
        }
    }
    
    findBestAIMove() {
        // Simple AI strategy
        // 1. Try to complete a sequence
        // 2. Try to block player from completing a sequence
        // 3. Play a random valid move
        
        // Find all possible moves
        const possibleMoves = [];
        
        for (let cardIndex = 0; cardIndex < this.aiCards.length; cardIndex++) {
            const card = this.aiCards[cardIndex];
            
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    const cellData = this.board[row][col];
                    
                    if (cellData.token === null && (cellData.isCorner || cellData.card === card)) {
                        possibleMoves.push({ row, col, cardIndex, card });
                    }
                }
            }
        }
        
        if (possibleMoves.length === 0) return null;
        
        // Check for moves that complete a sequence
        for (const move of possibleMoves) {
            this.board[move.row][move.col].token = 'ai';
            const wouldComplete = this.checkForSequencesAtPosition('ai', move.row, move.col);
            this.board[move.row][move.col].token = null;
            
            if (wouldComplete) {
                return move;
            }
        }
        
        // Check for moves that block player from completing a sequence
        for (const move of possibleMoves) {
            this.board[move.row][move.col].token = 'player';
            const wouldBlock = this.checkForSequencesAtPosition('player', move.row, move.col);
            this.board[move.row][move.col].token = null;
            
            if (wouldBlock) {
                return move;
            }
        }
        
        // Play a random valid move
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    
    checkForSequences(player) {
        // Check all positions for new sequences
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col].token === player) {
                    this.checkForSequencesAtPosition(player, row, col);
                }
            }
        }
        
        this.updateScore();
    }
    
    checkForSequencesAtPosition(player, startRow, startCol) {
        // Check horizontal, vertical, and diagonal sequences
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down-right
            [1, -1]   // diagonal down-left
        ];
        
        for (const [dRow, dCol] of directions) {
            const sequence = this.getSequenceInDirection(player, startRow, startCol, dRow, dCol);
            if (sequence.length >= 5) {
                this.markSequence(player, sequence);
                return true;
            }
        }
        
        return false;
    }
    
    getSequenceInDirection(player, startRow, startCol, dRow, dCol) {
        const sequence = [];
        
        // Check in the positive direction
        let row = startRow;
        let col = startCol;
        
        while (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            if (this.board[row][col].token === player) {
                sequence.push({ row, col });
            } else if (this.board[row][col].isCorner) {
                // Wild cards count as any player's token
                sequence.push({ row, col });
            } else {
                break;
            }
            row += dRow;
            col += dCol;
        }
        
        // Check in the negative direction
        row = startRow - dRow;
        col = startCol - dCol;
        
        while (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            if (this.board[row][col].token === player) {
                sequence.unshift({ row, col });
            } else if (this.board[row][col].isCorner) {
                sequence.unshift({ row, col });
            } else {
                break;
            }
            row -= dRow;
            col -= dCol;
        }
        
        return sequence;
    }
    
    markSequence(player, sequence) {
        // Mark the sequence (could add visual indicators here)
        if (player === 'player') {
            this.playerSequences++;
        } else {
            this.aiSequences++;
        }
    }
    
    updateScore() {
        document.getElementById('player-score').textContent = this.playerSequences;
        document.getElementById('ai-score').textContent = this.aiSequences;
    }
    
    updateGameStatus(message) {
        document.getElementById('game-status').textContent = message;
    }
    
    endGame(winner) {
        this.gameOver = true;
        if (winner === 'player') {
            this.updateGameStatus("Congratulations! You won!");
        } else {
            this.updateGameStatus("AI won! Better luck next time.");
        }
    }
    
    drawCard() {
        if (this.currentPlayer !== 'player' || this.gameOver) return;
        
        if (this.deck.length === 0) {
            this.updateGameStatus("No more cards in the deck!");
            return;
        }
        
        if (this.playerCards.length >= 7) {
            this.updateGameStatus("You already have 7 cards!");
            return;
        }
        
        this.playerCards.push(this.deck.pop());
        this.renderPlayerCards();
        this.updateGameStatus("Card drawn!");
    }
    
    resetGame() {
        // Clear all tokens from the board but keep the same layout
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                this.board[row][col].token = null;
            }
        }
        
        // Reset game state
        this.currentPlayer = 'player';
        this.selectedCard = null;
        this.playerSequences = 0;
        this.aiSequences = 0;
        this.gameOver = false;
        
        // Reset cards
        this.playerCards = [];
        this.aiCards = [];
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        
        // Update UI
        document.getElementById('current-player').textContent = 'You';
        this.renderBoard();
        this.renderPlayerCards();
        this.updateScore();
        this.updateGameStatus("Game reset! Click on a card, then click on a matching board space to place your token.");
    }
    
    randomizeBoard() {
        // Create a pool of all cards (excluding corners)
        const allCards = [];
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // Add 4 of each card (since we have 96 non-corner spaces and 52 unique cards)
        for (let i = 0; i < 4; i++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    allCards.push(rank + suit);
                }
            }
        }
        
        // Shuffle the cards
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }
        
        // Place random cards on the board (excluding corners)
        let cardIndex = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const isCorner = (row === 0 && col === 0) ||
                                (row === 0 && col === 9) ||
                                (row === 9 && col === 0) ||
                                (row === 9 && col === 9);
                
                if (!isCorner) {
                    this.board[row][col].card = allCards[cardIndex++];
                }
                
                // Clear any existing tokens
                this.board[row][col].token = null;
            }
        }
        
        // Reset game state
        this.currentPlayer = 'player';
        this.selectedCard = null;
        this.playerSequences = 0;
        this.aiSequences = 0;
        this.gameOver = false;
        
        // Reset cards to match the new board
        this.playerCards = [];
        this.aiCards = [];
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        
        // Update UI
        document.getElementById('current-player').textContent = 'You';
        this.renderBoard();
        this.renderPlayerCards();
        this.updateScore();
        this.updateGameStatus("Board randomized! New layout generated. Click on a card, then click on a matching board space to place your token.");
    }
    
    newGame() {
        this.board = [];
        this.playerCards = [];
        this.aiCards = [];
        this.deck = [];
        this.currentPlayer = 'player';
        this.selectedCard = null;
        this.playerSequences = 0;
        this.aiSequences = 0;
        this.gameOver = false;
        
        document.getElementById('current-player').textContent = 'You';
        
        this.initializeGame();
        this.updateScore();
    }
    
    attachEventListeners() {
        document.getElementById('draw-card').addEventListener('click', () => this.drawCard());
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('randomize-board').addEventListener('click', () => this.randomizeBoard());
        document.getElementById('how-to-play').addEventListener('click', () => this.openHowToPlay());
        
        // Close modal when clicking outside or on close button
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('how-to-play-modal');
            if (event.target === modal) {
                this.closeHowToPlay();
            }
        });
        
        document.querySelector('.close').addEventListener('click', () => this.closeHowToPlay());
    }
    
    openHowToPlay() {
        document.getElementById('how-to-play-modal').style.display = 'block';
    }
    
    closeHowToPlay() {
        document.getElementById('how-to-play-modal').style.display = 'none';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SequenceGame();
});