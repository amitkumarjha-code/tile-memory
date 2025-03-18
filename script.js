const gameBoard = document.getElementById('game-board');
const playerScores = document.getElementById('player-scores');
const levelSelect = document.getElementById('level');
const startGameButton = document.getElementById('start-game');
const timerElement = document.getElementById('timer');
const timeLeftElement = document.getElementById('time-left');
const flipCounterElement = document.getElementById('flip-counter');
const flipCountElement = document.getElementById('flip-count');

let flippedTiles = [];
let matchedTiles = [];
let isCheckingMatch = false;
let timer = null;
let timeLeft = 45;
let flipCount = 0;
let maxFlips = 30;
let tilePairs = []; // Array to store the tile pairs
let gameActive = false;
// Global variables for player data
let playerData = {
    name: "Amit",
    wins: {
        easy: 0,
        hard: 0,
        hardest: 0
    },
    games: {
        easy: 0,
        hard: 0,
        hardest: 0
    }
};

// Load player data from local storage
function loadPlayerData() {
    const storedData = localStorage.getItem("memoryGamePlayer");
    if (storedData) {
        playerData = JSON.parse(storedData);
        updatePlayerStats();
    }
}

// Save player data to local storage
function savePlayerData() {
    localStorage.setItem("memoryGamePlayer", JSON.stringify(playerData));
}


// Update player stats on the page
function updatePlayerStats() {
    document.getElementById("player-name-display").textContent = playerData.name;
    document.getElementById("wins-easy").textContent = `${playerData.wins.easy} / ${playerData.games.easy}`;
    document.getElementById("wins-hard").textContent = `${playerData.wins.hard} / ${playerData.games.hard}`;
    document.getElementById("wins-hardest").textContent = `${playerData.wins.hardest} / ${playerData.games.hardest}`;
    document.getElementById("player-stats").style.display = "block";
}

// Handle saving player name
document.getElementById("save-player").addEventListener("click", () => {
    const playerNameInput = document.getElementById("player-name").value.trim();
    if (playerNameInput) {
        playerData.name = playerNameInput;
        savePlayerData();
        updatePlayerStats();
    }
});

// Function to handle game win
function handleGameWin(level) {
    playerData.wins[level]++;
    playerData.games[level]++;
    savePlayerData();
    updatePlayerStats();
    alert(`Congratulations ${playerData.name}, you won on ${level} level!`);
}

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

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to generate tiles
function generateTiles(tilePairs) {
    shuffleArray(tilePairs);
    gameBoard.innerHTML = ''; // Clear the game board
    tilePairs.forEach((pair, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = index;
        tile.dataset.value = pair;

        const imgElement = document.createElement('img');
        imgElement.src = `./brands/${pair}.svg`;
        imgElement.alt = "Tile Image";
        imgElement.classList.add('hidden');

        tile.appendChild(imgElement);
        gameBoard.appendChild(tile);

        tile.addEventListener('click', handleTileClick);
    });
}

function handleTileClick(event) {
    if (!gameActive || isCheckingMatch) return; // Prevent clicks if the game is inactive or checking for a match

    const clickedTile = event.currentTarget;
    const index = parseInt(clickedTile.dataset.index);
    const value = clickedTile.dataset.value;
    const imgElement = clickedTile.querySelector('img');

    // Prevent clicking already revealed or matched tiles
    if (clickedTile.classList.contains('revealed') || matchedTiles.includes(index)) {
        return;
    }

    imgElement.classList.remove('hidden');
    clickedTile.classList.add('revealed');
    flippedTiles.push({ tile: clickedTile, index, value });

    if (levelSelect.value === 'hardest') {
        flipCount++;
        flipCountElement.textContent = flipCount;
        if (flipCount > maxFlips) {
            endGame(false, "You exceeded the maximum number of flips!");
            return;
        }
    }

    if (flippedTiles.length === 2) {
        isCheckingMatch = true; // Set the flag to prevent further clicks
        setTimeout(checkMatch, 300);
    }
}

function checkMatch() {
    const [tile1, tile2] = flippedTiles;

    if (tile1.value === tile2.value) {
        // Match found
        matchedTiles.push(tile1.index, tile2.index);
        flippedTiles = [];
        isCheckingMatch = false; // Allow further clicks after processing the match
        checkWinCondition();
    } else {
        // No match, hide the tiles again
        setTimeout(() => {
            tile1.tile.querySelector('img').classList.add('hidden');
            tile2.tile.querySelector('img').classList.add('hidden');
            tile1.tile.classList.remove('revealed');
            tile2.tile.classList.remove('revealed');
            flippedTiles = [];
            isCheckingMatch = false; // Reset the flag only after hiding unmatched tiles
        }, 300); // Delay for visual feedback
    }
}

// Function to check win condition
function checkWinCondition() {
    if (matchedTiles.length === tilePairs.length) {
        endGame(true, "Congratulations! You won!");
    }
}

// Function to start the timer
function startTimer() {
    //timeLeft = 30;
    timeLeftElement.textContent = timeLeft;
    timerElement.style.display = 'block';

    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(false, "Time's up! Try again.");
        }
    }, 1000);
}

// Function to handle game loss
function handleGameLoss(level) {
    playerData.games[level]++;
    savePlayerData();
    updatePlayerStats();
    alert(`Sorry ${playerData.name}, you lost on ${level} level. Better luck next time!`);
}

// Function to end the game
function endGame(isWin, message) {
    clearInterval(timer);
    gameActive = false; // Set the game as inactive
    const level = levelSelect.value;
    if (isWin) {
        handleGameWin(level);
    } else {
        handleGameLoss(level);
    }
    alert(message);
    resetGame();
}


function resetGame() {
    clearInterval(timer); // Clear any existing timer
    flippedTiles = [];
    matchedTiles = [];
    isCheckingMatch = false;
    flipCount = 0;
    flipCountElement.textContent = flipCount;
    timerElement.style.display = 'none';
    flipCounterElement.style.display = 'none';
    gameActive = false; // Reset the gameActive flag
    timeLeft = 45
}

// Function to start the game
function startGame() {
    resetGame();
    gameActive = true; // Set the game as active

    const level = levelSelect.value; // Get the selected level
    playerData.games[level]++; // Increment the games played for the selected level
    savePlayerData(); // Save the updated data to local storage
    updatePlayerStats(); // Update the stats on the page

    const randomNumbers = pickRandomNumbers(1, 156, 10);
    tilePairs = [...randomNumbers, ...randomNumbers];

    if (level === 'hard' || level === 'hardest') {
        startTimer();
    }

    if (level === 'hardest') {
        flipCounterElement.style.display = 'block';
    }

    generateTiles(tilePairs);
}

// Load player data on page load
window.addEventListener("load", () => {
    loadPlayerData();
});
// Event listener for the start game button
startGameButton.addEventListener('click', startGame);

// Hide player name input and save button on game start
function hidePlayerInfo() {
    document.getElementById("player-info").style.display = "none";
}

// Toggle collapsible player stats
function togglePlayerStats() {
    const statsContent = document.getElementById("player-stats");
    const icon = document.getElementById("collapsible-icon");

    if (statsContent.style.display === "none") {
        statsContent.style.display = "block";
        icon.classList.remove("collapsed"); // Show expanded icon
    } else {
        statsContent.style.display = "none";
        icon.classList.add("collapsed"); // Show collapsed icon
    }
}

// Attach event listener to the player stats header
document.getElementById("player-stats-header").addEventListener("click", togglePlayerStats);

// Attach event listener to the player stats header
document.getElementById("player-stats-header").addEventListener("click", togglePlayerStats);

// Function to start the game
function startGame() {
    resetGame();
    gameActive = true; // Set the game as active

    hidePlayerInfo(); // Hide player name input and save button

    const level = levelSelect.value; // Get the selected level
    playerData.games[level]++; // Increment the games played for the selected level
    savePlayerData(); // Save the updated data to local storage
    updatePlayerStats(); // Update the stats on the page

    const randomNumbers = pickRandomNumbers(1, 156, 10);
    tilePairs = [...randomNumbers, ...randomNumbers];

    if (level === 'hard' || level === 'hardest') {
        startTimer();
    }

    if (level === 'hardest') {
        flipCounterElement.style.display = 'block';
    }

    generateTiles(tilePairs);
}
