const gameBoard = document.getElementById('game-board');
const playerScores = document.getElementById('player-scores');

const tilePairs = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D']; // Example tile pairs
let flippedTiles = []; // Array to store flipped tiles
let matchedTiles = []; // Array to store matched tile indexes

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateTiles() {
    shuffleArray(tilePairs);
    tilePairs.forEach((pair, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = index; // Store the index
        tile.dataset.value = pair; // Store the value
        gameBoard.appendChild(tile);

        // Add event listener
        tile.addEventListener('click', handleTileClick);
    });
}

function handleTileClick(event) {
    const clickedTile = event.target;
    const index = parseInt(clickedTile.dataset.index);
    const value = clickedTile.dataset.value;

    // Prevent clicking already flipped or matched tiles
    if (clickedTile.classList.contains('revealed') || matchedTiles.includes(index)) {
        return;
    }

    // Flip the tile
    clickedTile.textContent = value;
    clickedTile.classList.add('revealed');
    flippedTiles.push({ tile: clickedTile, index: index, value: value });

    // Check for match
    if (flippedTiles.length === 2) {
        setTimeout(checkMatch, 500); // Delay for visual feedback
    }
}

function checkMatch() {
    const tile1 = flippedTiles[0];
    const tile2 = flippedTiles[1];

    if (tile1.value === tile2.value) {
        // Match
        matchedTiles.push(tile1.index, tile2.index);
        flippedTiles = [];
        checkWinCondition();
    } else {
        // No match
        tile1.tile.textContent = '';
        tile2.tile.textContent = '';
        tile1.tile.classList.remove('revealed');
        tile2.tile.classList.remove('revealed');
        flippedTiles = [];
    }
}

function checkWinCondition() {
    if (matchedTiles.length === tilePairs.length) {
        alert('You win!'); // Basic win condition
    }
}

generateTiles();