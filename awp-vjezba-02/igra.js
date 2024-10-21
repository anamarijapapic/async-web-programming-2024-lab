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
   * Initializes the game.
   * Calls render.init with a callback function - makeMove.
   * @method init
   */
  init: function () {
    this.currentPlayer = 'p';
    this.cbFn = this.makeMove.bind(this);
    render.init(this.cbFn);
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
      // Check if the game is over
      if (this.isGameOver()) {
        // Declare the winner
        if (this.currentPlayer === 'p') {
          console.log('Player "plavi" won!');
        } else {
          console.log('Player "crveni" won!');
        }
      }
      // Switch player
      this.currentPlayer = this.currentPlayer === 'p' ? 'c' : 'p';
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
