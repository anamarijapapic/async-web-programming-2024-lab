/*
4.
Napišite funkciju koja za primljeni niz prirodnih brojeva filtrira niz, tako da vraća dva nova niza
parnih i neparnih brojeva. Novi nizovi su sortirani te izvorni (poslani) niz se ne smije mutirati.
*/

const filterNumbers = (arr) => {
  const even = arr.filter((el) => el % 2 === 0).sort((a, b) => a - b);
  const odd = arr.filter((el) => el % 2 !== 0).sort((a, b) => a - b);

  return [even, odd];
};

const arr = [1, 2, 3, 9, 8, 7, 4, 5, 6];
const [even, odd] = filterNumbers(arr);

console.log(`Original array: ${arr}`);
console.log(`Even numbers: ${even}`);
console.log(`Odd numbers: ${odd}`);
