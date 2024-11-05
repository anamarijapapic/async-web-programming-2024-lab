/**
 * @file index.js
 */
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const util = require('util');
const stream = require('stream');
const sharp = require('sharp'); // Node.js image processing module

const pipelinePromise = util.promisify(stream.pipeline);

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

  // Resize images
  for (const file of imageFiles) {
    console.log(`Processing image ${file}...`);
    const filePath = path.join(inputDirPath, file);

    for (const size of DEFAULT_IMAGE_SIZES) {
      await resizeImage(filePath, size);
    }
  }
}

/**
 * Resizes an image to the given size.
 *
 * The resized image is saved in the output directory.
 * New file name is in format 'filename-SIZExSIZE.ext'.
 *
 * @function resizeImage
 * @param {String} filePath - Path to the image file
 * @param {String} size - Size in the format 'WIDTHxHEIGHT'
 * @returns {void}
 */
async function resizeImage(filePath, size) {
  // Check if size is in the correct format
  const sizeRegex = new RegExp(/^\d+x\d+$/);
  if (!sizeRegex.test(size)) {
    console.log(`Invalid size format: ${size}. Use format 'WIDTHxHEIGHT'.`);
    return;
  }

  // Get width and height values from size string
  const [width, height] = size.split('x').map(Number);

  // Construct output file path
  // Example: 'slika1.jpg' => 'slika1-150x150.jpg', in corresponding directories
  const extName = path.extname(filePath);
  const fileName = path.basename(filePath, extName);
  const outputFileName = `${fileName}-${size}${extName}`;
  const outputPath = path.join(outputDirPath, outputFileName);

  console.log(`Resizing image ${fileName} to ${size}...`);

  try {
    const rfs = fs.createReadStream(filePath);
    const wfs = fs.createWriteStream(outputPath);

    const transformer = sharp().resize(width, height);

    await pipelinePromise(rfs, transformer, wfs);
    console.log(`Image ${fileName} resized to ${size}.`);
  } catch (error) {
    console.log('Error resizing image:', error);
  }
}

processImages()
  .then(() => console.log('All images processed.'))
  .catch((error) => console.error('Error processing images:', error));
