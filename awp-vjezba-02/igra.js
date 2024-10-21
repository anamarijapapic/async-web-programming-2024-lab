/**
 * Connect Four game.
 * @type object
 */
const igra = {
  /**
   * @property {function} cbFn - Callback function for the game.
   */
  cbFn: null,

  /**
   * @property {object} board - Game board.
   */
  board: {},

  /**
   * @property {string} currentPlayer - Current player.
   */
  currentPlayer: null,

  /**
   * @property {number} moveNumber - Number of moves.
   */
  moveCount: 0,

  /**
   * @property {number} zWins - Number of yellow wins.
   */
  zWins: 0,

  /**
   * @property {number} cWins - Number of red wins.
   */
  cWins: 0,

  /**
   * Initializes the game.
   * Calls render.init with a callback function - makeMove.
   * @method init
   */
  init: function (startPlayer = 'z', zWins = 0, cWins = 0) {
    this.board = {};
    this.moveCount = 0;
    document.getElementById('igra-potezi').innerText = this.moveCount;
    this.currentPlayer = startPlayer;
    document.getElementById('igra-igrac').innerText =
      startPlayer === 'z' ? 'zuti' : 'crveni';
    document.getElementById('igra-pobjednik').innerText = '-';
    this.zWins = zWins;
    document.getElementById('igra-z-pobjede').innerText = this.zWins;
    this.cWins = cWins;
    document.getElementById('igra-c-pobjede').innerText = this.cWins;
    this.cbFn = this.makeMove.bind(this);
    render.init(this.cbFn);
  },

  /**
   * Restarts the game.
   * @method restart
   */
  restart: function () {
    render.clear();
    this.init(this.currentPlayer, this.zWins, this.cWins);
  },

  /**
   * Makes a move on the board.
   * @method makeMove
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   */
  makeMove: function (x, y) {
    if (!this.isGameOver() && this.isMoveValid(x, y)) {
      this.board[`${x}-${y}`] = this.currentPlayer;
      console.log(`Move: ${this.currentPlayer} -> x: ${x}, y: ${y}`);
      render.draw(this.board);
      this.moveCount++;
      document.getElementById('igra-potezi').innerText = this.moveCount;
      // Check if the game is over
      if (this.isGameOver()) {
        // Declare the winner
        if (this.currentPlayer === 'z') {
          console.log('Player "zuti" won!');
          this.zWins++;
          document.getElementById('igra-z-pobjede').innerText = this.zWins;
        } else {
          console.log('Player "crveni" won!');
          this.cWins++;
          document.getElementById('igra-c-pobjede').innerText = this.cWins;
        }

        document.getElementById('igra-pobjednik').innerText =
          this.currentPlayer === 'z' ? 'zuti' : 'crveni';
      }
      // Switch player
      this.currentPlayer = this.currentPlayer === 'z' ? 'c' : 'z';
      document.getElementById('igra-igrac').innerText =
        this.currentPlayer === 'z' ? 'zuti' : 'crveni';
    }
  },

  /**
   * Checks if the move is valid.
   * @method isMoveValid
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @returns {boolean} - True if the move is valid, false otherwise
   */
  isMoveValid: function (x, y) {
    // Check if the cell is already taken
    if (this.board[`${x}-${y}`]) {
      console.log('Invalid move: Cell is already taken');
      return false;
    }

    // Check if the cells below are taken
    for (let i = y - 1; i >= 0; i--) {
      if (!this.board[`${x}-${i}`]) {
        console.log('Invalid move: Cells below are not taken');
        return false;
      }
    }

    return true;
  },

  /**
   * Checks if the game is over.
   * Game is over when there are four cells in a row (horizontally, vertically or diagonally).
   * @method isGameOver
   * @returns {boolean} - True if the game is over, false otherwise
   */
  isGameOver: function () {
    // Check horizontally
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        const cell = this.board[`${x}-${y}`];
        if (!cell) {
          continue;
        }

        if (
          this.board[`${x + 1}-${y}`] === cell &&
          this.board[`${x + 2}-${y}`] === cell &&
          this.board[`${x + 3}-${y}`] === cell
        ) {
          console.log('Game over: Horizontal -');
          return true;
        }
      }
    }

    // Check vertically
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        const cell = this.board[`${x}-${y}`];
        if (!cell) {
          continue;
        }

        if (
          this.board[`${x}-${y + 1}`] === cell &&
          this.board[`${x}-${y + 2}`] === cell &&
          this.board[`${x}-${y + 3}`] === cell
        ) {
          console.log('Game over: Vertical |');
          return true;
        }
      }
    }

    // Check diagonally
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        const cell = this.board[`${x}-${y}`];
        if (!cell) {
          continue;
        }

        if (
          this.board[`${x + 1}-${y + 1}`] === cell &&
          this.board[`${x + 2}-${y + 2}`] === cell &&
          this.board[`${x + 3}-${y + 3}`] === cell
        ) {
          console.log('Game over: Diagonal /');
          return true;
        }

        if (
          this.board[`${x - 1}-${y + 1}`] === cell &&
          this.board[`${x - 2}-${y + 2}`] === cell &&
          this.board[`${x - 3}-${y + 3}`] === cell
        ) {
          console.log('Game over: Diagonal \\');
          return true;
        }
      }
    }

    // Check if the board is full
    let isBoardFull = Object.keys(this.board).length === WIDTH * (HEIGHT + 1);
    if (isBoardFull) {
      console.log('Game over: Draw');
      return true;
    }

    return false;
  },
};

igra.init();

document.getElementById('igra-restart').onclick = () => {
  igra.restart();
};
