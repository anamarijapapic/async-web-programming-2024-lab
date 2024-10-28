/**
 * @file test.js
 */

const { parseTextFiles } = require('./index');

parseTextFiles()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log('Error parsing/appending text files:', error);
  });
