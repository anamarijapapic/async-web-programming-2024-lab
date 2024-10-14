/*
1.
Napišite funkciju koja će korištenjem niza ispisati sve moguće tipove u javascriptu.
(Niz može imati različite vrijednosti. Koristiti petlje i typeof!)
*/

const printTypes = (arr) => {
  arr.forEach((element) => {
    console.log(typeof element);
  });
};

const arr = [
  null,
  undefined,
  true,
  false,
  1,
  1n,
  'string',
  Symbol(),
  {},
  [],
  function () {},
];

printTypes(arr);

/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values
Type        typeof return value    Object wrapper
Null        "object"               N/A
Undefined   "undefined"            N/A
Boolean     "boolean"              Boolean
Number      "number"               Number
BigInt      "bigint"               BigInt
String      "string"               String
Symbol      "symbol"               Symbol

https://www.w3schools.com/js/js_typeof.asp
JavaScript has 7 primitive data types:
- string
- number
- boolean
- bigint
- symbol
- null
- undefined

JavaScript has one complex data type:
- object

All other complex types like arrays, functions, sets, and maps are just different types of objects.
The typeof operator returns only two types for objects:
- object
- function
*/
