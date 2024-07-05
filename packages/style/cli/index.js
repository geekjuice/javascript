#!/usr/bin/env node

import chalk from 'chalk';
import meow from 'meow';

import check from './check.js';
import fix from './fix.js';
import { before, caught, echo, indent } from './format.js';

const { blue, bold, cyan, dim, red } = chalk;

const {
  flags: { debug, help, version },
  input: [command, ...inputs],
  showHelp,
  showVersion,
} = meow(
  `
  ❯ ${bold('style')} ${cyan('[command]')} ...path ${blue('[options]')}

  ${dim('commands:')}
    ${cyan('check')}          check for formatting and lint issues
    ${cyan('fix')}            fix formatting and lint issues

  ${dim('options:')}
    ${blue('--help')}         print this help message
    ${blue('--version')}      print the package version
    ${blue('--debug')}        show debug output
`,
  {
    autoHelp: false,
    autoVersion: false,
    description: false,
    flags: {
      debug: {
        default: false,
        type: 'boolean',
      },
      help: {
        default: false,
        shortFlag: 'h',
        type: 'boolean',
      },
      version: {
        default: false,
        shortFlag: 'v',
        type: 'boolean',
      },
    },
    importMeta: import.meta,
  },
);

const files = inputs.length > 0 ? inputs : ['.'];

try {
  switch (true) {
    case Boolean(version): {
      showVersion();
      break;
    }

    case Boolean(help) || command == null: {
      showHelp();
      break;
    }

    case command === 'check': {
      await check(files);
      break;
    }

    case command === 'fix': {
      await fix(files);
      break;
    }

    default: {
      echo(before(indent(red(`${command}?...`))));
      showHelp();
    }
  }
} catch (error) {
  echo(caught());

  if (debug) {
    echo('');
    throw error;
  }

  process.exit(1);
}
