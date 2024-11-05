/**
 * @file index.js
 */
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const DEFAULT_IMAGE_SIZES = ['150x150', '100x100', '50x50'];
const inputDirPath = path.join(__dirname, '..', 'slike');
const outputDirPath = path.join(__dirname, '..', 'slike-resized');

/**
 * For each image in the input directory, it resizes the image to the given sizes.
 *
 * If no sizes are provided, the default sizes are used (150x150, 100x100, 50x50).
 *
 * @function processImages
 * @returns {void}
 */
async function processImages() {
  // Check if input directory exists
  try {
    await fsPromises.access(inputDirPath);
  } catch (error) {
    console.log(`Folder ${inputDirPath} does not exist.`);
    return;
  }

  // Check if output directory exists, create it if it doesn't
  try {
    await fsPromises.access(outputDirPath);
  } catch (error) {
    try {
      await fsPromises.mkdir(outputDirPath);
      console.log(`Created directory ${outputDirPath}.`);
    } catch (error) {
      console.log('Error creating directory:', error);
      return;
    }
  }

  // Get image files from the input directory
  let imageFiles = [];
  try {
    const files = await fsPromises.readdir(inputDirPath);
    imageFiles = files.filter((file) => file.endsWith('.jpg'));
    console.log('Found image files (.jpg):', imageFiles);
  } catch (error) {
    console.log('Error reading directory contents:', error);
  }
}

processImages()
  .then(() => console.log('All images processed.'))
  .catch((error) => console.error('Error processing images:', error));
