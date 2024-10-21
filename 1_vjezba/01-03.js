/*
3.
Napišite funkcije koje će ovisno o prvom parametru izvršavati osnovne aritmetičke operacije za
dva broja i pri svakom pozivu logirati koja se operacija izvršava. (Koristiti closure)
*/

const arithmeticOps = (operator) => {
  const add = (x, y) => {
    return x + y;
  };
  const subtract = (x, y) => {
    return x - y;
  };
  const multiply = (x, y) => {
    return x * y;
  };
  const division = (x, y) => {
    return y !== 0
      ? x / y
      : (() => {
          throw new Error('Division by zero');
        })();
  };

  return (x, y) => {
    console.log(`Performing operation: ${operator}`);
    switch (operator) {
      case '+':
        return add(x, y);
      case '-':
        return subtract(x, y);
      case '*':
        return multiply(x, y);
      case '/':
        return division(x, y);
      default:
        throw new Error('Invalid operator');
    }
  };
};

const x = 1;
const y = 2;
console.log(`x = ${x}, y = ${y}`);

const addClosure = arithmeticOps('+');
console.log(addClosure(x, y));

const subtractClosure = arithmeticOps('-');
console.log(subtractClosure(x, y));

const multiplyClosure = arithmeticOps('*');
console.log(multiplyClosure(x, y));

const divisionClosure = arithmeticOps('/');
console.log(divisionClosure(x, y));
