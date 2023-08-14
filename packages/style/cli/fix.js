import { commands, flags } from './constants.js';
import { done, echo, info } from './format.js';
import { execute } from './utils.js';

export default async function fix(files, quiet) {
  const args = {
    eslint: [...(quiet ? ['--quiet'] : []), '--fix', ...flags.eslint, ...files],
    prettier: ['--write', ...flags.prettier, ...files],
  };

  echo(info('applying linter autofixes...'));
  await execute(commands.eslint, args.eslint);

  echo(info('formatting files...'));
  await execute(commands.prettier, args.prettier);

  echo(done());
}
