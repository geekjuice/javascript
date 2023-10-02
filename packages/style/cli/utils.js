import { execa } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { caught, echo } from './format.js';

export const read = async (filepath) => {
  const data = await fs.readFile(filepath);
  return JSON.parse(data);
};

export const project = async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const filepath = path.join(dirname, '../package.json');
  return read(filepath);
};

export const exists = async (filepath, exit = false) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    if (exit) {
      const message = `${filepath} not found...`;
      echo(caught(message));
      throw new Error(message);
    }
    return false;
  }
};

export const execute = async (command, args, opts) => {
  const bin = ['exec', command, '--'];
  const options = opts ?? { stdio: 'inherit' };
  return execa('npm', [...bin, ...args], options);
};
