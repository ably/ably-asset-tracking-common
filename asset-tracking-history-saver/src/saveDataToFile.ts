import * as path from 'path';
import * as fs from 'fs';
import { EnhancedLocationUpdate } from './types';

export const saveDataToFile = (filename: string, locationUpdates: EnhancedLocationUpdate[]) => {
  if (!filename) {
    console.error(`No filename provided`);
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), filename);
  fs.writeFileSync(filePath, JSON.stringify(locationUpdates));
};
