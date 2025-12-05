# Sequence Game

Single-page browser version of the board game Sequence. Play against an AI on a 10x10 board, place tokens that match your cards, and race to make two sequences of five.

## Features
- Interactive 10x10 board with Sequence-style layout and corner wilds
- Hand of 7 cards with selectable highlights for valid placements
- AI opponent that prioritizes completing or blocking sequences
- Scoreboard that tracks completed sequences for you and the AI
- Board randomizer, reset, and new game flows plus an in-app “How to Play” modal

## Run Locally
1) Clone or download this folder.
2) Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari). No build step or dependencies are required.
3) Optional: serve it locally (useful for browser security settings) with any static server, e.g. `npx http-server .` and visit the printed URL.

## How to Play
1) Click a card in your hand; matching board spaces highlight.
2) Click a highlighted space to place your token (corners are wild).
3) Draw to refill (max 7 cards) or play from what you have.
4) First to complete two sequences of five in a row (horizontal, vertical, or diagonal) wins.

## Controls
- `Draw Card`: take one card if under 7 and the deck is not empty.
- `New Game`: fresh deal and standard board layout.
- `Reset Game`: clear tokens but keep the current layout.
- `Randomize Board`: shuffle a new board layout, then redeal.
- `How to Play`: open the rules modal.

## Project Structure
- `index.html`: layout and modal markup.
- `styles.css`: board, cards, tokens, and modal styling.
- `script.js`: game logic (deck, turns, AI, sequence detection, UI rendering).

## Notes
- Everything runs client-side; no assets are fetched from the network.
- Card suit symbols rely on browser font support. If a suit looks off, try another modern browser.
