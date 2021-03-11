const path = require('path');
const fs = require('fs');

module.exports = (input) => {
  const filePath = input ? path.resolve(process.cwd(), input) : path.resolve(__dirname, 'defaultJourney.json');

  if (!fs.existsSync(filePath)) {
    console.error(`Could not find file: ${input}`);
    process.exit(1);
  }

  if (fs.statSync(filePath).isDirectory()) {
    console.error(`Could not read from directory ${input}`);
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);


  return data;
}
