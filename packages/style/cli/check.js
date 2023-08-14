import { commands, flags } from './constants.js';
import { done, echo, info } from './format.js';
import { execute } from './utils.js';

export default async function check(files, quiet) {
  const args = {
    eslint: [...(quiet ? ['--quiet'] : []), ...flags.eslint, ...files],
    prettier: ['--check', ...flags.prettier, ...files],
  };

  echo(info('linting files...'));
  await execute(commands.eslint, args.eslint);

  echo(info('checking formats...'));
  await execute(commands.prettier, args.prettier);

  echo(done());
}
