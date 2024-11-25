const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

// Zadatak 1.
function zdk1Fn(cb) {
  let callsCount = 0;
  return function (...args) {
    callsCount++;
    if (typeof cb !== 'function') {
      return {
        poruka: 'Krivi poziv funkcije!',
        ukupanBrojPozivaFunkcije: callsCount,
      };
    }
    return {
      ...args,
      ukupanBrojPozivaFunkcije: callsCount,
    };
  };
}

const zdk1 = zdk1Fn();
console.log(zdk1());
console.log(zdk1());
console.log(1, 2, 3);
console.log(1, 2, 3);

// Zadatak 2.
function zdk2Fn() {
  const podaci = require('./podaciZaDatoteke.json');
  //   console.log(podaci);
  const podaciKeys = Object.keys(podaci);
  const decoded = {};
  podaciKeys.forEach((key) => {
    const data = podaci[key];
    data.forEach((el) => {
      const buff = new Buffer.from(data, 'base64');
      const base64data = buff.toString('utf-8');
      decoded[el] = base64data;
    });
  });

  return decoded;
}

console.log(zdk2Fn());

// Zadatak 3.
async function zdk3Fn(filename) {
  try {
    await fsPromises.access(filename);
    console.log(`Datoteka ${filename} postoji.`);
  } catch (error) {
    throw new Error(`Datoteka ${filename} ne postoji:`, error);
  }

  const filePath = path.join(__dirname, filename);
  try {
    const fileContents = await fsPromises.readFile(filePath, 'utf-8');
    return fileContents;
  } catch (error) {
    throw new Error(`Greška pri čitanju datoteke ${filePath}:`, error);
  }
}

zdk3Fn('tekst.txt')
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
// zdk3Fn('tekst1.txt')
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));

// Zadatak 4.
async function zdk4Fn(filename) {
  const fileContents = await zdk3Fn(filename);
  const words = fileContents.split(' ');
  const result = words.map((word, index) => {
    return index % 2 === 0 ? 'lolo' : 'tro';
  });
  return result.join(' ');
}

zdk4Fn('tekst.txt')
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

module.exports = {
  zdk1Fn,
  zdk2Fn,
  zdk3Fn,
  zdk4Fn,
};
