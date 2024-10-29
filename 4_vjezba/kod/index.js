const readline = require('readline')

const {
  Igra: IgraPotapanja,
  DULJINA_STRANICE_PLOCE,
} = require('./igra')

const novaIgra = new IgraPotapanja()

const questionTekst =
`
Opcije:
- n          => napravi novu igru
- p          => ispisi plocu
- m x:1 y:3 => napravi potez na ovim koordinatama
- q          => zaustavi proces

Vas odabir: `

const moveRegex = new RegExp(/m\ x:\d+\ y:\d/)
/**
 * Helper to format user input
 * @param {String} input
 * @returns
 */
function formatInput (input) {
  if (!input) {
    return {}
  }

  switch (input) {
    case 'n':
    case 'p':
    case 'q':
      return { input }
  }

  if (moveRegex.test(input)) {
    const splitInputs = input.split(' ')
    const formattedInput = { input: 'm' }

    for (let i = 1;i < 3; i++) {
      const [key, value] = splitInputs[i].split(':')
      formattedInput[key] = Number(value)
    }
    return formattedInput
  }
  // wrong input
  return {}
}

function inputLoop (igraObj) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(questionTekst, input => {
    rl.close()

    try {
      const formattedInput = formatInput(input)
      console.log(formattedInput)
      /*
        Ovdje dodati kod za razlicite odabire.
        Primjeri poziva:
        - igraObj.ispisPloce()
        - igraObj.napraviPotez({x: 1, y: 2})
      */
    } catch (err) {

    }

    console.log('\n')
    process.nextTick(() => inputLoop(igraObj))
  })
}

/**
 * 
 * @param {Object} igraObj 
 */
function main (igraObj) {
  inputLoop(igraObj)
}

process.nextTick(() => main(novaIgra))