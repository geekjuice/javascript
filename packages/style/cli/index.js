#!/usr/bin/env node

import meow from 'meow';
import chalk from 'chalk';
import { before, caught, echo, indent } from './format.js';
import install from './install.js';
import prepare from './prepare.js';
import check from './check.js';
import fix from './fix.js';

const { blue, bold, cyan, dim, red } = chalk;

const {
  input: [command, ...inputs],
  flags: { help, version, debug, quiet, overwrite },
  showHelp,
  showVersion,
} = meow(
  `
  ❯ ${bold('style')} ${cyan('[command]')} ...path ${blue('[options]')}

  ${dim('commands:')}
    ${cyan('install')}        install style configurations
    ${cyan('prepare')}        prepare codebase for migration
    ${cyan('check')}          check for formatting and lint issues
    ${cyan('fix')}            fix formatting and lint issues

  ${dim('options:')}
    ${blue('--help')}         print this help message
    ${blue('--version')}      print the package version
    ${blue('--debug')}        show debug output
    ${blue('--quiet')}        only report errors
    ${blue('--overwrite')}    overwrite configurations during install
`,
  {
    importMeta: import.meta,
    autoHelp: false,
    autoVersion: false,
    description: false,
    flags: {
      debug: {
        type: 'boolean',
        default: false,
      },
      help: {
        type: 'boolean',
        default: false,
        alias: 'h',
      },
      overwrite: {
        type: 'boolean',
        default: false,
      },
      version: {
        type: 'boolean',
        default: false,
        alias: 'v',
      },
    },
  }
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

    case command === 'install': {
      await install(overwrite);
      break;
    }

    case command === 'prepare': {
      await prepare();
      break;
    }

    case command === 'check': {
      await check(files, quiet);
      break;
    }

    case command === 'fix': {
      await fix(files, quiet);
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
