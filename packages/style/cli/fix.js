import { commands, flags } from './constants.js';
import { done, echo } from './format.js';
import { execute } from './utils.js';

export default async function fix(files) {
  await execute(commands.eslint, ['--fix', ...flags.eslint, ...files]);
  await execute(commands.prettier, ['--write', ...flags.prettier, ...files]);
  echo(done());
}
