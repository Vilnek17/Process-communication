import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomInt } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const book = 'The Wind in the Willows (introductory fragment).txt';

const readStream = fs.createReadStream(path.join(__dirname, '/files', book));
const outputPath = path.join(__dirname, '/files', 'book.txt');
const writeStream = fs.createWriteStream(outputPath);

const textIn = 'Introductory fragment, copying is prohibited!';

readStream.on('data', (chunk) => {
  const lines = chunk.toString().split('\n');
  const outputLines = [];

  lines.forEach((line) => {
    outputLines.push(line);

    if (randomInt(0, 2)) {
      outputLines.push(textIn);
    }
  });

  const showContent = outputLines.join('\n');
  writeStream.write(showContent);
});

readStream.on('end', () => {
  writeStream.end();
});

writeStream.on('finish', () => {
  console.log('Finished writing modified text to output.txt');
});

function showInConsole(value) {
  process.stdout.write(value + '\n');
}

showInConsole('Hello');

const ask = (question) => {
  return new Promise((resolve, reject) => {
    process.stdout.write(question);

    const onData = (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (['y', 'yes', 'n', 'no'].includes(answer)) {
        process.stdin.removeListener('data', onData);
        resolve(answer);
      } else {
        reject(new Error('Incorrect format responce'));
      }
    };

    process.stdin.on('data', onData);
  });
};

(async () => {
  try {
    const scssAnswer = await ask('Do you want to use SCSS? (Y/N): ');
    const eslintAnswer = await ask('Do you want to use ESLint? (Y/N): ');

    console.log('\nYour answers:');
    console.log('SCSS:', scssAnswer);
    console.log('ESLint:', eslintAnswer);
  } catch (error) {
    console.error(error.message);
  } finally {
    process.exit();
  }
})();
