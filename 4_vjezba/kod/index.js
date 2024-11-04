const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { styleText } = require('node:util'); // from Node.js v21.7.0, backported to v20.12.0

const { Igra: IgraPotapanja, DULJINA_STRANICE_PLOCE } = require('./igra');

/**
 * Custom error class
 * Custom status codes description:
 * - `600`: Unos nije valjan: Nema unosa
 * - `601`: Unos nije valjan: Krivi unos
 * - `700`: Potez nije valjan: Igra zavrsena, a korisnik pokusava napraviti potez
 * - `701`: Potez nije valjan: Potez je izvan ploce
 * @class MyBaseError
 * @extends {Error}
 */
class MyBaseError extends Error {
  constructor(status, message, ...params) {
    super(...params);
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
    // Remove new line characters from stack trace
    this.stack = this.stack.replace(/\n/g, ' ');
  }
}

const novaIgra = new IgraPotapanja();

const questionTekst = `
Opcije:
- n          => napravi novu igru
- p          => ispisi plocu
- m x:1 y:3  => napravi potez na ovim koordinatama
- q          => zaustavi proces

Vas odabir: `;

const moveRegex = new RegExp(/m\ x:\d+\ y:\d/);

/**
 * Helper to format user input
 * @param {String} input
 * @returns
 */
function formatInput(input) {
  if (!input) {
    throw new MyBaseError('600', 'Nema unosa');
  }

  switch (input) {
    case 'n':
    case 'p':
    case 'q':
      return { input };
  }

  if (moveRegex.test(input)) {
    const splitInputs = input.split(' ');
    const formattedInput = { input: 'm' };

    for (let i = 1; i < 3; i++) {
      const [key, value] = splitInputs[i].split(':');
      formattedInput[key] = Number(value);
    }
    return formattedInput;
  }
  // wrong input
  throw new MyBaseError('601', 'Krivi unos');
}

/**
 * Log error to file `log.txt`
 * Log error message format example: `Sat Sep 10 21:33:06 UTC 2011 IME_ERRORA ERROR-STACK-TRACE`
 * @function logError
 * @param {Error} error
 */
function logError(error) {
  try {
    const logFilePath = path.join(__dirname, 'log.txt');
    const logMessage = `${new Date().toString()} ${error.name} ${
      error.stack
    }\n`;
    fs.appendFileSync(logFilePath, logMessage);
  } catch (err) {
    console.error('Failed to log error:', err);
  }
}

function inputLoop(igraObj) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(questionTekst, (input) => {
    rl.close();

    try {
      const formattedInput = formatInput(input);
      console.log(formattedInput);

      switch (formattedInput.input) {
        case 'n': // => napravi novu igru
          igraObj = new IgraPotapanja();
          console.log('Nova igra kreirana');
          break;
        case 'p': // => ispisi plocu
          igraObj.ispisPloce();
          break;
        case 'm': // => napravi potez na ovim koordinatama
          if (igraObj.jeLiIgraZavrsena()) {
            throw new MyBaseError(
              '700',
              'Igra zavrsena, a korisnik pokusava napraviti potez'
            );
          }

          // Check if the move is within the board
          if (
            formattedInput.x >= DULJINA_STRANICE_PLOCE ||
            formattedInput.y >= DULJINA_STRANICE_PLOCE
          ) {
            throw new MyBaseError('701', 'Potez je izvan ploce');
          }

          // Check the move if it's a hit or miss
          if (igraObj.napraviPotez(formattedInput)) {
            console.log(styleText('green', 'Pogodak!'));
          } else {
            console.log(styleText('grey', 'Promasaj!'));
          }
          break;
        case 'q': // => zaustavi proces
          console.log('Proces je zaustavljen');
          process.exit(0);
      }
    } catch (err) {
      if (err instanceof MyBaseError) {
        console.error(
          styleText(
            'red',
            `Greska => Status: ${err.status}, Poruka: ${err.message}`
          )
        );
        logError(err);
      } else {
        console.error('Nepoznata greska:', err);
      }
    }

    console.log('\n');
    process.nextTick(() => inputLoop(igraObj));
  });
}

/**
 *
 * @param {Object} igraObj
 */
function main(igraObj) {
  inputLoop(igraObj);
}

process.nextTick(() => main(novaIgra));
