import fs from 'fs';
import { promisify } from 'util';
import readPkgUp from 'read-pkg-up';
import { PackageJson } from '@npm/types';

export const readFile = promisify(fs.readFile);

export const writeFile = async (
  filepath: string,
  data: string
): Promise<void> => {
  await promisify(fs.writeFile)(filepath, `${data}\n`);
};

export const fileExists = async (filepath: string): Promise<boolean> => {
  try {
    await promisify(fs.stat)(filepath);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return false;
  }
};

export const readJson = async <T extends {}>(
  filepath: string,
  fallback: T | null = null
): Promise<T | null> => {
  try {
    const buffer = await promisify(fs.readFile)(filepath);
    return JSON.parse(buffer.toString());
  } catch (error) {
    return fallback;
  }
};

export const readPkg = async (): Promise<PackageJson> => {
  const result = await readPkgUp({ cwd: __dirname });
  const { packageJson = {} } = result || {};
  return packageJson as PackageJson;
};
