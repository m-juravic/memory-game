"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];
let flippedCards = [];
let twoFlipMax = false;
let currentGuesses = 0;
let matches = 0;
let matchedCards = [];
const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener('click', reset);

const colors = shuffle(COLORS);

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const card = document.createElement('div');
    card.classList.add(color);
    card.addEventListener('click', handleCardClick);
    card.style.backgroundImage = "url('thinkingEmoji.png')";
    gameBoard.appendChild(card);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.className;
  card.style.backgroundImage = "";
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundImage = "url('thinkingEmoji.png')";
}

function timeout() {
  twoFlipMax = false;
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  let clickedCard = evt.target;

  if (twoFlipMax) {
    return;
  }

  if (matches === 5) {
    return;
  }

  if (matchedCards.includes(clickedCard)) {
    return;
  }

  if (!flippedCards.includes(clickedCard)) {
    flippedCards.push(clickedCard);
    flipCard(clickedCard);
  }

  if (flippedCards.length === 2) {
    if (flippedCards[0].getAttribute("class") !== flippedCards[1].getAttribute("class")) {
      twoFlipMax = true;
      setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, flippedCards[0]);
      setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, flippedCards[1]);
      setTimeout(timeout, FOUND_MATCH_WAIT_MSECS);
      flippedCards = [];
      currentGuesses++;
      let guessesElement = document.querySelector("#guesses");
      guessesElement.innerText = `Current Guesses: ${currentGuesses}`;
    } else {
      matchedCards.push(flippedCards[0], flippedCards[1]);
      flippedCards = [];
      currentGuesses++;
      matches++;
      let guessesElement = document.querySelector("#guesses");
      guessesElement.innerText = `Current Guesses: ${currentGuesses}`;
    }
  }
}

function reset(evt) {
  let gameBoard = document.getElementById("game");
  gameBoard.innerHTML = "";

  let guessesElement = document.querySelector("#guesses");
  currentGuesses = 0;
  guessesElement.innerText = `Current Guesses: ${currentGuesses}`;

  let colors = shuffle(COLORS);
  createCards(colors);
  matches = 0;
}

