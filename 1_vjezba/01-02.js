/*
2.
Napišite funkciju koja za primljeni niz stringova i odabrani znak lomi string u nizove.
Niz: [“pr, vi”, “drugi”, “tre, ci”]
Znak: “,”
Rezultat: [[“pr”, “vi”], [“drugi], [“tre”, “ci”]]
*/

const breakStrings = (arr, ch) => {
  // return arr.map(element => element.split(ch));
  return arr.map((element) => element.split(ch).map((el) => el.trim()));
};

const arr = ['pr, vi', 'drugi', 'tre, ci'];
const ch = ',';

console.log(breakStrings(arr, ch));
