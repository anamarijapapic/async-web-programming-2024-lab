/**
 * @file test.js
 */

const { parseTextFiles } = require('./index');

try {
  parseTextFiles().then((data) => {
    console.log(data);
  });
} catch (error) {
  console.log('Error parsing text files:', error);
}
