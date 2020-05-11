import { yellow } from 'chalk';
import execa from 'execa';
import { BIN, ESLINT_GLOB, PRETTIER_GLOB } from '../constants';
import { create } from '../logger';
import { Files, Options } from '../types';
import check from './check';

const logger = create('fix');

const attempt = async (file: string, args: string[]): Promise<void> => {
  try {
    await execa(file, args, { stdio: 'inherit' });
  } catch (error) {
    throw new Error();
  }
};

export default async (options: Options, files: Files): Promise<void> => {
  if (options.dry) {
    logger.log(yellow('running `check` which is equivalent to `fix --dry`...'));
    await check(options, files);
    return;
  }

  const eslint = [
    ...(files.length === 0 ? [ESLINT_GLOB] : files),
    '--no-error-on-unmatched-pattern',
    '--fix',
  ];

  const prettier = [
    ...(files.length === 0 ? [PRETTIER_GLOB] : files),
    '--write',
  ];

  await attempt(`${BIN}/eslint`, eslint);
  await attempt(`${BIN}/prettier`, prettier);

  logger.done();
};
