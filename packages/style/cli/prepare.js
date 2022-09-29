import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import { commands, flags } from './constants.js';
import { before, done, echo, info, warn } from './format.js';
import { execute } from './utils.js';

export default async function prepare() {
  const filepath = 'rules.json';
  const options = { reject: false };

  echo(before(info('applying autofixes...')));

  await execute(commands.eslint, ['--fix', ...flags.eslint, '.'], options);
  await execute(
    commands.prettier,
    ['--write', ...flags.prettier, '.'],
    options
  );

  echo(info('extracting rules to suppress...'));

  const { stdout } = await execute(
    commands.eslint,
    ['--format=json', ...flags.eslint, '.'],
    options
  );
  const rules = JSON.parse(stdout).reduce(
    (accumulator, { messages }) => ({
      ...accumulator,
      ...messages
        .filter(({ severity }) => severity === 2)
        .reduce(
          (acc, { ruleId }) => ({
            ...acc,
            [ruleId]: 'warn',
          }),
          {}
        ),
    }),
    {}
  );

  echo(info(`saving rules to ${filepath}...`));

  const json = prettier.format(JSON.stringify(rules), {
    parser: 'json-stringify',
  });
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, json);

  echo(before(warn(`next: add rules to .eslintrc.js!`)));

  echo(done());
}
