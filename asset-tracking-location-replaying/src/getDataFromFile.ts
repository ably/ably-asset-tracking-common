import * as path from 'path';
import * as fs from 'fs';

export const getDataFromFile = (filename: string) => {
  if (!filename) {
    console.error(`No filename provided`);
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    console.error(`Could not find file: ${filename}`);
    process.exit(1);
  }

  if (fs.statSync(filePath).isDirectory()) {
    console.error(`Can not read from directory ${filename}`);
    process.exit(1);
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);

  return data;
};
