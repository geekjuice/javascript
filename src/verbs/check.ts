import execa from 'execa';
import { BIN, ESLINT_GLOB, PRETTIER_GLOB } from '../constants';
import { create } from '../logger';
import { Files, Options } from '../types';

const logger = create('check');

const attempt = async (file: string, args: string[]): Promise<void> => {
  try {
    await execa(file, args, { stdio: 'inherit' });
  } catch (error) {
    throw new Error();
  }
};

export default async (options: Options, files: Files): Promise<void> => {
  const eslint = [
    ...(files.length === 0 ? [ESLINT_GLOB] : files),
    '--no-error-on-unmatched-pattern',
  ];

  const prettier = [
    ...(files.length === 0 ? [PRETTIER_GLOB] : files),
    '--check',
  ];

  await Promise.all([
    attempt(`${BIN}/eslint`, eslint),
    attempt(`${BIN}/prettier`, prettier),
  ]);

  logger.done();
};
