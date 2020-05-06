import { red } from 'chalk';
import { run } from './cli';
import { create } from './logger';

const logger = create('index');

(async (): Promise<void> => {
  try {
    await run();
  } catch (error) {
    if (error instanceof Error && error.message) {
      logger.indent(red(error.message));
    }

    logger.indent(red('(╯°□°)╯︵ ┻━┻'));

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
})();
