import { done, echo, info } from './format.js';
import { execute } from './utils.js';

const args = ['check', '--no-errors-on-unmatched'];

export default async function check(files) {
  echo(info('checking files...'));
  await execute('@biomejs/biome', [...args, ...files]);

  echo(done());
}
