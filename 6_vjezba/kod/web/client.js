/**
 * @file client.js
 */

let currentPosition = { x: 0, y: 0 };
let totalPoints = 0;

/**
 * Listeneri koje trebate imati za komunikaciju:
 * - “initial-data” - dobiti ćete JSON objekt sa vašom početnom pozicijom
 * - “status” - poslati će JSON objekt sa { gameData, points }
 *   - gameData - trenutna ploča kako izgleda
 *   - points - broj plavih kvadratića koje ste pojeli
 * - “move-response” - odgovor na “make-move” će vam reći je li vaš trenutni potez prihvaćen ili ne
 */

// Get initial data - starting position
socket.on('initial-data', function (position) {
  console.log('Starting position:', position);
  currentPosition = position;
});

// Get the current status of the game and points
// Update the total points
socket.on('status', function ({ gameData, points }) {
  console.log('Current game data:', gameData);
  console.log('New points earned:', points);
  totalPoints += points;
  console.log('Total points:', totalPoints);
  document.getElementById('igra-bodovi').innerText = totalPoints;
});

// Get the response to the make move event
// Update the current position if the move was accepted
socket.on('move-response', function (response) {
  if (response) {
    console.log('Valid move:', response);
    currentPosition = response;
  } else {
    console.log('Invalid move');
  }
});

/**
 * Eventovi koje trebate slati:
 * - “game-start” - poslati JSON objekt { “isPlayer”: true }, kako bi server znao da ste igrač
 * - “make-move” - poslati JSON objekt sa { x, y } vašom pozicijom
 */

// Start the game on 'spacebar' key press
document.addEventListener('keydown', function (event) {
  if (event.key === ' ') {
    socket.emit('game-start', { isPlayer: true });
  }
});

// Make a move on arrow/WASD key press
document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      socket.emit('make-move', {
        x: currentPosition.x,
        y: currentPosition.y + 1,
      });
      break;
    case 'ArrowDown':
    case 's':
      socket.emit('make-move', {
        x: currentPosition.x,
        y: currentPosition.y - 1,
      });
      break;
    case 'ArrowLeft':
    case 'a':
      socket.emit('make-move', {
        x: currentPosition.x - 1,
        y: currentPosition.y,
      });
      break;
    case 'ArrowRight':
    case 'd':
      socket.emit('make-move', {
        x: currentPosition.x + 1,
        y: currentPosition.y,
      });
      break;
  }
});
