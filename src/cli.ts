import chalk from 'chalk';
import meow from 'meow';
import notifier from 'update-notifier';
import { create } from './logger';
import { readPkg } from './utils';
import * as actions from './verbs';
import { Actions } from './types';

const { blue, cyan, gray, magenta, red } = chalk;

const { hasOwnProperty } = Object.prototype;

const logger = create('cli');

export const run = async (): Promise<void> => {
  const pkg = await readPkg();
  const { description = 'style' } = pkg;

  notifier({ pkg }).notify();

  const {
    input: [verb = 'huh', ...files],
    flags: { help, version, ...options },
    showHelp,
    showVersion,
  } = meow(
    `
      usage:
        $ ${magenta('style')} ${cyan('[verb]')} ... ${blue('[options]')}

      verbs:
        ${cyan('init')}             initialize styles
        ${cyan('check')}            check for formatting and lint issues
        ${cyan('fix')}              fix formatting and lint issues

      options:
        ${blue('-h, --help')}       print this help message
        ${blue('-v, --version')}    print package version
        ${blue('-d, --dry')}        dry run actual changes
        ${blue('-y, --yes')}        confirm yes to all prompts`,
    {
      autoHelp: false,
      autoVersion: false,
      description: gray(`[${description}]`),
      flags: {
        help: {
          type: 'boolean',
          default: false,
          alias: 'h',
        },
        version: {
          type: 'boolean',
          default: false,
          alias: 'v',
        },
        dry: {
          type: 'boolean',
          default: false,
          alias: 'd',
        },
        yes: {
          type: 'boolean',
          default: false,
          alias: 'y',
        },
      },
    }
  );

  if (help) {
    showHelp();
  } else if (version) {
    showVersion();
  }

  if (!hasOwnProperty.call(actions, verb)) {
    logger.indent(red(`${verb}?...`));
    showHelp();
  }

  await (actions as Actions)[verb](options, files);
};
