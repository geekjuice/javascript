import { done, echo, info } from './format.js';
import { execute } from './utils.js';

const args = ['check', '--write', '--no-errors-on-unmatched'];

export default async function fix(files) {
  echo(info('processing files...'));
  await execute('@biomejs/biome', [...args, ...files]);

  echo(done());
}
