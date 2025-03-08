const gameBoard = document.getElementById('game-board');
const playerScores = document.getElementById('player-scores');

// Function to pick random numbers within a range
function pickRandomNumbers(min, max, count) {
    if (max - min + 1 < count) {
        throw new Error("Range is smaller than the number of requested random numbers.");
    }

    const numbers = new Set();
    while (numbers.size < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}

// Example usage: Pick 10 unique random numbers between 1 and 156
const randomNumbers = pickRandomNumbers(1, 156, 10);
const tilePairs = [...randomNumbers, ...randomNumbers]; // Example tile pairs
let flippedTiles = []; // Array to store flipped tiles
let matchedTiles = []; // Array to store matched tile indexes
let isCheckingMatch = false; // Flag to prevent clicking during match check

// Function to shuffle an array for randomness of images on app
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

        //images
        const imageFolder = './brands';
        const imgElement = document.createElement('img');
        imgElement.src = `${imageFolder}/${pair}.svg`;
        imgElement.alt = "Random SVG Image";
        imgElement.classList.add('hidden'); // Initially hide the image

        // Append the img element to the new div
        tile.appendChild(imgElement);
        gameBoard.appendChild(tile);

        // Add event listener
        tile.addEventListener('click', handleTileClick);
    });
}

function handleTileClick(event) {
    if (isCheckingMatch) return; // Prevent clicking during match check

    const clickedTile = event.currentTarget; // Use currentTarget to get the tile div
    const index = parseInt(clickedTile.dataset.index);
    const value = clickedTile.dataset.value;
    const imgElement = clickedTile.querySelector('img');

    // Prevent clicking already flipped or matched tiles
    if (clickedTile.classList.contains('revealed') || matchedTiles.includes(index)) {
        return;
    }

    // Flip the tile
    imgElement.classList.remove('hidden'); // Show the image
    clickedTile.classList.add('revealed');
    flippedTiles.push({ tile: clickedTile, index: index, value: value });

    // Check for match
    if (flippedTiles.length === 2) {
        isCheckingMatch = true; // Set flag to prevent further clicks
        setTimeout(checkMatch, 500); // Delay for visual feedback
    }
}

function checkMatch() {
    const [tile1, tile2] = flippedTiles;

    if (tile1.value === tile2.value) {
        // Match
        matchedTiles.push(tile1.index, tile2.index);
        flippedTiles = [];
        checkWinCondition();
    } else {
        // No match
        tile1.tile.querySelector('img').classList.add('hidden'); // Hide the image
        tile2.tile.querySelector('img').classList.add('hidden'); // Hide the image
        tile1.tile.classList.remove('revealed');
        tile2.tile.classList.remove('revealed');
        flippedTiles = [];
    }

    isCheckingMatch = false; // Reset flag to allow clicks
}

function checkWinCondition() {
    if (matchedTiles.length === tilePairs.length) {
        alert('You win!'); // Basic win condition
    }
}

generateTiles();