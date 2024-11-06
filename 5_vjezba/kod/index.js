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
 * The resized images are saved in the output directory.
 * After resizing, it saves the resized images stats to a file `legenda.txt` in the output directory.
 * `legenda.txt` contains the file names and sizes (in bytes) of the resized images.
 *
 * @function processImages
 * @returns {void}
 * @throws {Error} If input directory does not exist
 * @throws {Error} If error creating output directory
 * @throws {Error} If error reading directory contents
 * @throws {Error} If error resizing image
 * @throws {Error} If error writing file
 */
async function processImages() {
  // Check if input directory exists
  try {
    await fsPromises.access(inputDirPath);
    console.log(`Found input directory: ${inputDirPath}`);
  } catch (error) {
    throw new Error(`Folder ${inputDirPath} does not exist.`, error);
  }

  // Check if output directory exists, create it if it doesn't
  try {
    await fsPromises.access(outputDirPath);
    console.log(`Found output directory: ${outputDirPath}`);
  } catch (error) {
    console.log(`Directory ${outputDirPath} does not exist. Creating...`);
    try {
      await fsPromises.mkdir(outputDirPath);
      console.log(`Created directory ${outputDirPath}.`);
    } catch (error) {
      throw new Error(`Error creating directory:`, error);
    }
  }

  // Get image files from the input directory
  let imageFiles = [];
  try {
    const files = await fsPromises.readdir(inputDirPath);
    imageFiles = files.filter((file) => file.endsWith('.jpg'));
    console.log('Found image files (.jpg):', imageFiles);
    if (imageFiles.length === 0) {
      console.log('No image files found in the input directory.');
      return;
    }
  } catch (error) {
    throw new Error(`Error reading directory contents:`, error);
  }

  // Resize images and collect file stats
  let fileStats = [];
  for (const file of imageFiles) {
    console.log(`Processing image ${file}...`);
    const filePath = path.join(inputDirPath, file);

    for (const size of DEFAULT_IMAGE_SIZES) {
      try {
        const resizedFilePath = await resizeImage(filePath, size);
        const stats = await fsPromises.stat(resizedFilePath);
        fileStats.push({
          fileName: path.basename(resizedFilePath),
          size: stats.size,
        });
      } catch (error) {
        console.error(`Error resizing image ${file} to size ${size}:`, error);
      }
    }
  }

  // Write file stats to a file
  console.log('File stats:', fileStats);
  const fileStatsFilePath = path.join(
    __dirname,
    '..',
    'slike-resized',
    'legenda.txt'
  );
  try {
    const fileStatsContent = fileStats
      .map((stat) => `${stat.fileName}: ${stat.size} B`)
      .join('\n');
    await fsPromises.writeFile(fileStatsFilePath, fileStatsContent);
  } catch (error) {
    throw new Error(
      `Error writing file stats to file ${fileStatsFilePath}:`,
      error
    );
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
 * @returns {String} Path to the resized image file
 * @throws {Error} If size is not in the correct format
 * @throws {Error} If width or height are not positive integers
 * @throws {Error} If error reading image file or writing resized image
 */
async function resizeImage(filePath, size) {
  // Check if size is in the correct format
  const sizeRegex = new RegExp(/^\d+x\d+$/);
  if (!sizeRegex.test(size)) {
    throw new Error(`Invalid size format: ${size}. Use format 'WIDTHxHEIGHT'.`);
  }

  // Get width and height values from size string
  const [width, height] = size.split('x').map(Number);

  // Ensure width and height are positive
  if (width <= 0 || height <= 0) {
    throw new Error('Width and height must be positive integers.');
  }

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

    // Return resized file path
    return outputPath;
  } catch (error) {
    throw new Error(`Error resizing image ${fileName} to ${size}:`, error);
  }
}

processImages()
  .then(() => console.log('All images processed.'))
  .catch((error) => console.error('Error processing images:', error));
