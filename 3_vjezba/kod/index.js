/**
 * @file index.js
 */

const path = require('path');
const fs = require('fs'); // synchronous, callback-based
const fsPromises = fs.promises; // asynchronous, promise-based

/**
 * Reads all text files in `tekstualneDatoteke` directory.
 * For each file, it reads/calculates the following data:
 * 1. total word count
 * 2. file name
 * 3. number of words with the same length.
 * It returns an array of objects, where each object represents one file stats.
 * It also creates a new file that combines all files into one, without spaces.
 * @function parseTextFiles
 * @returns data {Array} - Array of objects, where each object represents one file stats.
 */
async function parseTextFiles() {
  const folderName = '../tekstualneDatoteke';
  const folderPath = path.join(__dirname, folderName);
  console.log(`Reading files from ${folderPath}.`);

  // Check if folder exists
  try {
    await fsPromises.access(folderPath);
  } catch (error) {
    console.log(`Folder ${folderName} does not exist.`);
    return;
  }

  // Filter directory contents to only include text files.
  let textFiles = [];
  try {
    const files = await fsPromises.readdir(folderPath);
    textFiles = files.filter((file) => file.endsWith('.txt'));
    console.log('Found files (.txt):', textFiles);
  } catch (error) {
    console.log('Error reading directory contents:', error);
  }

  // Parse each file
  let data = [];
  for (const file of textFiles) {
    const filePath = path.join(folderPath, file);
    const [fileContent, fileData] = await parseTextFile(filePath);
    data.push(fileData);
    // TO-DO: Write to a new file - append file content without spaces
  }

  return data;
}

/**
 * Helper function to read and parse a text file.
 * Reads the file and calculates the stats.
 * @function parseTextFile
 * @param filePath {String} - Path to the text file.
 * @returns {Array.<String, fileData} - Array containing file content and file stats.
 */
async function parseTextFile(filePath) {
  console.log(`Reading file ${filePath}.`);

  let fileContent = '';

  /**
   * @typedef {Object} fileData
   * @property {String} imeDatoteke - File name.
   * @property {Number} ukupanBrojRijeci - Total word count.
   * @property {Object} brojRijeciSaIstimBrojemSlova - Number of words with the same length.
   */
  let fileData = {};

  try {
    fileContent = await fsPromises.readFile(filePath, 'utf-8');

    // Count total word count
    const words = fileContent.split(' ');
    const totalWordCount = words.length;

    // Count words with the same length
    /**
     * @typedef {Object.<string, number} wordLengths
     */
    const wordLengths = {};
    words.forEach((word) => {
      const length = word.length;
      // FYI: In JS, the key will always be converted to a string.
      if (wordLengths[length]) {
        wordLengths[length]++;
      } else {
        wordLengths[length] = 1;
      }
    });

    fileData = {
      imeDatoteke: path.basename(filePath),
      ukupanBrojRijeci: totalWordCount,
      brojRijeciSaIstimBrojemSlova: wordLengths,
    };

    // TO-DO: Write to a new file - append file content without spaces
  } catch (error) {
    console.log('Error reading file:', error);
  }

  return [fileContent, fileData];
}

module.exports = {
  parseTextFiles,
};
