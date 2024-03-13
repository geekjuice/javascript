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
    echo(before(info(`creating ${filepath}...`)));

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

  const deps = async (pkgjson = 'package.json') => {
    echo(before(info(`updating ${pkgjson}...`)));

    await exists(pkgjson, true);
    const pkg = await read(pkgjson);

    const draft = { ...pkg };

    const { name, version } = await project();

    draft.devDependencies = {
      ...draft.devDependencies,
      [name]: version,
    };
    draft.scripts = {
      ...draft.scripts,
      check: 'style check',
      fix: 'style fix',
      prepare: 'husky',
    };

    const original = await prettify(JSON.stringify(pkg), 'json-stringify');
    const updated = await prettify(JSON.stringify(draft), 'json-stringify');

    if (updated === original) {
      echo(warn(`${pkgjson} already updated. skipping...`));
    } else {
      await fs.writeFile(pkgjson, updated);
    }
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
    # ${pragma}

    npm exec lint-staged\n
  `;

  const pnpm = async (npmrc = '.npmrc') => {
    if (!(await exists('pnpm-lock.yaml'))) {
      return;
    }

    const hoisted = ['eslint', 'prettier', 'husky', 'lint-staged'];

    const patterns = (file) => {
      const lines = hoisted.reduce((acc, command) => {
        const pattern = `*${command}*`;

        if (file == null || !file.includes(pattern)) {
          acc.push(`public-hoist-pattern[]=${pattern}\n`);
        }

        return acc;
      }, []);

      return lines.length === 0 ? null : lines.join('');
    };

    if (await exists(npmrc)) {
      echo(before(info(`updating ${npmrc}...`)));

      const rc = await read(npmrc, false);

      const lines = patterns(rc);

      if (lines == null) {
        echo(warn(`${npmrc} already updated. skipping...`));
      } else {
        await fs.writeFile(npmrc, [rc.trim(), lines].join('\n'));
      }
    } else {
      await create(npmrc, patterns());
    }
  };

  await deps();
  await pnpm();
  await create('.eslintrc.js', prettify(eslintrc));
  await create('.prettierrc.js', prettify(prettierrc));
  await create('.lintstagedrc.js', prettify(lintstagedrc));
  await create('.husky/pre-commit', precommit, '755');

  echo(done());
}
