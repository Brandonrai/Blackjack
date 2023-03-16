// Card values
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];

let playerCards = [];
let dealerCards = [];

let playerScore = 0;
let dealerScore = 0;

let gameStatus = 'playing';

// Create a deck of cards
function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ value, suit });
    }
  }
  return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Deal a card
function dealCard(deck) {
  return deck.pop();
}

// Calculate the score of a hand
function calculateScore(hand) {
  let score = 0;
  let hasAce = false;

  for (const card of hand) {
    const value = card.value;
    let cardScore;

    if (value === 'A') {
      hasAce = true;
      cardScore = 11;
    } else if (['K', 'Q', 'J'].includes(value)) {
      cardScore = 10;
    } else {
      cardScore = parseInt(value);
    }

    score += cardScore;
  }

  if (hasAce && score > 21) {
    score -= 10;
  }

  return score;
}

// Start a new game
function newGame(deck) {
  gameStatus = 'playing'; // Add this line to reset the gameStatus

  playerCards = [dealCard(deck), dealCard(deck)];
  dealerCards = [dealCard(deck), dealCard(deck)];

  playerScore = calculateScore(playerCards);
  dealerScore = calculateScore(dealerCards);

  showMessage(''); // Add this line to clear any previous messages
  updateUI();
}

// Hit
function hit(deck) {
  if (gameStatus === 'playing') {
    playerCards.push(dealCard(deck));
    playerScore = calculateScore(playerCards);
    
    if (playerScore > 21) {
      gameStatus = 'lost';
      showMessage("You've busted!");
    }
    updateUI();
  }
}

// Stand
function stand(deck) {
  if (gameStatus === 'playing') {
    while (dealerScore < 17) {
      dealerCards.push(dealCard(deck));
      dealerScore = calculateScore(dealerCards);
    }

    if (dealerScore > 21) {
      gameStatus = 'won';
      showMessage("Dealer busted! You win!");
    } else if (dealerScore > playerScore) {
      gameStatus = 'lost';
      showMessage("Dealer wins!");
    } else if (dealerScore === playerScore) {
      gameStatus = 'tie';
      showMessage("It's a tie!");
    } else {
      gameStatus = 'won';
      showMessage("You win!");
    }

    updateUI();
  }
}

// Update the UI
function updateUI() {
  document.getElementById('player-cards').innerText = playerCards.map(card => card.value).join(', ');
  document.getElementById('dealer-cards').innerText = dealerCards.map(card => card.value).join(', ');
  document.getElementById('player-score').innerText = `Player: ${playerScore}`;
  document.getElementById('dealer-score').innerText = `Dealer: ${dealerScore}`;
}

// Show a message
function showMessage(message) {
  document.getElementById('message').innerText = message;
}

// Initialize the game
function initGame() {
  const deck = shuffleDeck(createDeck());

  const newGameButton = document.getElementById('new-game');
  const hitButton = document.getElementById('hit');
  const standButton = document.getElementById('stand');

  newGameButton.addEventListener('click', () => newGame(deck));
  hitButton.addEventListener('click', () => hit(deck));
  standButton.addEventListener('click', () => stand(deck));

  newGame(deck);
}

// Start the game
initGame();

