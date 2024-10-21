/*
5.
Napišite funkciju koja će pamtiti s kojim parametrima se pozvala i koliko puta.
a. Na svaki poziv funkcije zapamtite vrijednost i uvećajte brojač
b. Savjet: Koristite nizove za pamtit vrijednosti.
Napomena: 0 se može preskočiti. (Koristiti closure)
*/

const rememberFunctionCalls = () => {
  const calls = [];

  return (...args) => {
    const params = args.join(', ');
    const index = calls.findIndex((el) => el.params === params);

    if (index === -1) {
      calls.push({ params, count: 1 });
    } else {
      calls[index].count++;
    }

    return calls;
  };
};

const remember = rememberFunctionCalls();

console.log(remember('a', 'b', 'c'));
console.log(remember(1, 2, 3));
console.log(remember('x', 'y'));
console.log(remember(1, 2, 3));
console.log(remember(1, 2, 3));
console.log(remember('a', 'b', 'c'));
