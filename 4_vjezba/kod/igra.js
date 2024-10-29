function swap(arr, index01, index02) {
  const temp = arr[index01];
  arr[index01] = arr[index02];
  arr[index02] = temp;
}

const DULJINA_STRANICE_PLOCE = 5;

const Igra = function () {
  const brojMeta = 5;

  let ploca = [];
  generiraneTocke = {};
  pogodeneTocke = {};
  pokusaji = {};

  this.jeLiIgraZavrsena = function () {
    return Object.keys(pogodeneTocke).length === brojMeta;
  };

  this.napraviPotez = function (potez) {
    if (generiraneTocke[`${potez.x}-${potez.y}`]) {
      pogodeneTocke[`${potez.x}-${potez.y}`] = true;
    }
    pokusaji[`${potez.x}-${potez.y}`] = true;

    return !!pogodeneTocke[`${potez.x}-${potez.y}`];
  };

  this.ispisPloce = function () {
    console.log('Ispis ploce:');
    for (let x = 0; x < DULJINA_STRANICE_PLOCE; x++) {
      let line = [];
      for (let y = 0; y < DULJINA_STRANICE_PLOCE; y++) {
        let mark = '-';
        const key = `${x}-${y}`;

        if (pokusaji[key]) {
          mark = 'X';
        }

        if (pogodeneTocke[key]) {
          mark = 'o';
        }

        line.push(mark);
      }
      // print ploce
      console.log(line.join(' '));
    }
  };

  function generirajTocke() {
    const moguceTocke = [];
    for (let i = 0; i < DULJINA_STRANICE_PLOCE; i++) {
      for (let j = 0; j < DULJINA_STRANICE_PLOCE; j++) {
        moguceTocke.push({
          x: i,
          y: j,
        });
      }
    }

    // shuffler
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const randomA = Math.floor(Math.random() * 25) % 25;
        const randomB = Math.floor(Math.random() * 25) % 25;

        swap(moguceTocke, randomA, randomB);
      }
    }

    for (let i = 0; i < brojMeta; i++) {
      const mark = moguceTocke[i];
      generiraneTocke[`${mark.x}-${mark.y}`] = true;
    }
  }

  ploca = new Array(DULJINA_STRANICE_PLOCE);
  for (let i = 0; i < DULJINA_STRANICE_PLOCE; i++) {
    ploca[i] = new Array(DULJINA_STRANICE_PLOCE);
  }

  generirajTocke();
};

module.exports = {
  Igra,
  DULJINA_STRANICE_PLOCE,
};
