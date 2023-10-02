import dedent from 'dedent';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';

import { pragma } from './constants.js';
import { before, done, echo, info, warn, yay } from './format.js';
import { exists, project, read } from './utils.js';

const prettify = (string, parser = 'babel') => {
  return prettier.format(string, { parser, singleQuote: true });
};

export default async function install(overwrite) {
  echo(yay('style guide!'));

  const create = async (filepath, content, stat) => {
    echo(info(`creating ${filepath}...`));

    if (!overwrite && (await exists(filepath))) {
      echo(warn(`${filepath} already exists. skipping...`));
      return;
    }

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, content);

    if (stat) {
      await fs.chmod(filepath, stat);
    }
  };

  const deps = async () => {
    echo(before(info('updating package.json...')));

    await exists('package.json', true);
    const pkg = await read('package.json');

    const { name, version } = await project();

    pkg.devDependencies = {
      ...pkg.devDependencies,
      [name]: `^${version}`,
    };
    pkg.scripts = {
      ...pkg.scripts,
      check: 'style check',
      fix: 'style fix',
      prepare: 'husky install',
    };

    const json = prettify(JSON.stringify(pkg), 'json-stringify');
    await fs.writeFile('package.json', json);
  };

  const eslintrc = dedent`
    ${pragma}

    module.exports = {
      extends: '@geekjuice/eslint-config',
    };
  `;

  const prettierrc = dedent`
    ${pragma}

    module.exports = '@geekjuice/prettier-config';
  `;

  const lintstagedrc = dedent`
    ${pragma}

    module.exports = {
      '*.{js,mjs,ts,tsx}': ['eslint --fix --quiet', 'prettier --write'],
      '*.{json,md}': ['prettier --write'],
    };
  `;

  const precommit = dedent`
    #!/usr/bin/env sh

    # ${pragma}

    . "$(dirname -- "$0")/_/husky.sh"

    npm exec lint-staged\n
  `;

  await Promise.all([
    deps(),
    create('.eslintrc.js', prettify(eslintrc)),
    create('.prettierrc.js', prettify(prettierrc)),
    create('.lintstagedrc.js', prettify(lintstagedrc)),
    create('.husky/pre-commit', precommit, '755'),
  ]);

  echo(done());
}
