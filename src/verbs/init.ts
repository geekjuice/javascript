import chalk from 'chalk';
import dedent from 'dedent';
import execa from 'execa';
import prompts from 'prompts';
import { PackageJson } from '@npm/types';
import {
  PACKAGEJSON,
  ESLINTRC,
  PRETTIERRC,
  HUSKYRC,
  LINTSTAGEDRC,
  STYLES,
  PRAGMA,
} from '../constants';
import { create } from '../logger';
import { fileExists, readJson, readPkg, writeFile } from '../utils';
import { Bag, Options } from '../types';

const { bold, dim, green, red, yellow } = chalk;

const logger = create('init');

const ask = async (question: string): Promise<boolean> => {
  const { answer } = await prompts({
    name: 'answer',
    type: 'confirm',
    message: question,
  });

  if (answer == null) {
    throw new Error('bye?...');
  }

  return answer;
};

const initFile = async (
  filename: string,
  config: string | (() => string | Promise<string>),
  { dry, yes }: Options
): Promise<void> => {
  if (!yes) {
    const exists = await fileExists(filename);

    if (exists) {
      logger.log(yellow(`${bold(filename)} already exists:`));
      const replace = await ask('replace?');

      if (!replace) {
        logger.log(dim(`skipping ${bold(filename)}...`));
        return;
      }
    }
  }

  const content = typeof config === 'function' ? await config() : config;

  const watermarked = `${PRAGMA}\n${content}`;

  logger.log(green(`writing ${bold(filename)}...`));
  logger.section(dim(`// ${filename}`), watermarked);

  if (!dry) {
    await writeFile(filename, watermarked);
  }
};

const updatePackageJson = async (
  field: 'scripts' | 'devDependencies',
  pkg: PackageJson,
  values: Bag<string>,
  yes: Options['yes']
): Promise<{ updated: PackageJson; patch: Bag<string> }> => {
  const patch = {} as Bag<string>;
  const existing = (pkg[field] || {}) as Bag<string>;

  for (const [key, expected] of Object.entries(values)) {
    const actual = existing[key];

    let replace = true;
    if (!yes && actual != null && actual !== expected) {
      logger.log(yellow(`${bold(key)} already exists in ${field}:`));
      logger.log(`- ${red(actual)}`);
      logger.log(`+ ${green(expected)}`);
      replace = await ask('replace?');
    }

    if (replace) {
      patch[key] = expected;
    }
  }

  const updated = Object.entries(patch).reduce(
    (memo, [key, next]) => {
      const mutable = (memo[field] || {}) as Bag<string>;
      mutable[key] = next;
      // eslint-disable-next-line no-param-reassign
      memo[field] = mutable;
      return memo;
    },
    { ...pkg }
  );

  return { updated, patch };
};

const initPackageJson = async ({ dry, yes }: Options): Promise<void> => {
  const pkg = await readJson<PackageJson>(PACKAGEJSON);

  if (pkg === null) {
    throw new Error(`no ${PACKAGEJSON} found`);
  }

  const { name, version, peerDependencies = {} } = await readPkg();

  const dependencies = {
    [name]: `^${version}`,
    ...peerDependencies,
  };

  const {
    updated: withDevDependencies,
    patch: devDependencies,
  } = await updatePackageJson('devDependencies', pkg, dependencies, yes);

  const commands = {
    'style:check': 'style check',
    'style:fix': 'style fix',
  };

  const {
    updated: withScriptsAndDevDependencies,
    patch: scripts,
  } = await updatePackageJson('scripts', withDevDependencies, commands, yes);

  const patch = {
    ...(Object.keys(devDependencies).length > 0 && { devDependencies }),
    ...(Object.keys(scripts).length > 0 && { scripts }),
  };

  if (Object.keys(patch).length === 0) {
    logger.log(dim(`${bold(PACKAGEJSON)} already up-to-date`));
    logger.log(dim(`skipping ${bold(PACKAGEJSON)}...`));
    return;
  }

  logger.log(green(`writing ${bold(PACKAGEJSON)}...`));
  logger.section(dim(`// ${PACKAGEJSON}`), JSON.stringify(patch, null, 2));

  if (!dry) {
    const updated = JSON.stringify(withScriptsAndDevDependencies, null, 2);
    await writeFile(PACKAGEJSON, updated);
  }
};

const initEslintConfig = async ({ dry, yes }: Options): Promise<void> => {
  const PLUGINS = ['node', 'react'];

  const generate = async (): Promise<string> => {
    let plugins = [] as string[];

    if (yes) {
      plugins = PLUGINS;
    } else {
      for (const plugin of PLUGINS) {
        const add = await ask(`extend ${bold(plugin)}?`);
        plugins = add ? [...plugins, plugin] : plugins;
      }
    }

    let config;
    switch (plugins.length) {
      case 0: {
        config = dedent`
          module.exports = {
            extends: '${STYLES}/eslint/base',
          };
        `;
        break;
      }

      case 1: {
        config = dedent`
          module.exports = {
            extends: [
              '${STYLES}/eslint/base',
              '${STYLES}/eslint/${plugins[0]}',
            ]
          };
        `;
        break;
      }

      case 2: {
        config = dedent`
          module.exports = {
            extends: '${STYLES}/eslint',
          };
        `;
        break;
      }

      default:
        throw new Error('how?...');
    }

    return config;
  };

  await initFile(ESLINTRC, generate, { dry, yes });
};

const initPrettierConfig = async (options: Options): Promise<void> => {
  const config = dedent`
    module.exports = {
      ...require('${STYLES}/prettier'),
    };
  `;

  await initFile(PRETTIERRC, config, options);
};

const initHuskyConfig = async (options: Options): Promise<void> => {
  const config = dedent`
    module.exports = {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    };
  `;

  await initFile(HUSKYRC, config, options);
};

const initLintstagedConfig = async (options: Options): Promise<void> => {
  const config = dedent`
    module.exports = {
      '**/*.{js,json,md,ts,tsx}': ['prettier --check'],
      '**/*.{js,ts,tsx}': ['eslint'],
    };
  `;

  await initFile(LINTSTAGEDRC, config, options);
};

const installPackages = async ({ dry }: Options): Promise<void> => {
  logger.log(green('installing packages...'));
  if (!dry) {
    await execa('npm', ['install'], { stdio: 'inherit' });
  }
};

export default async (options: Options): Promise<void> => {
  await initPackageJson(options);
  await initEslintConfig(options);
  await initPrettierConfig(options);
  await initHuskyConfig(options);
  await initLintstagedConfig(options);
  await installPackages(options);
  logger.done();
};
