import { commands, flags } from './constants.js';
import { done, echo } from './format.js';
import { execute } from './utils.js';

export default async function check(files) {
  await execute(commands.eslint, [...flags.eslint, ...files]);
  await execute(commands.prettier, ['--check', ...flags.prettier, ...files]);
  echo(done());
}
