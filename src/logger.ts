import { green } from 'chalk';

interface Logger {
  done: () => void;
  section: (...messages: string[]) => void;
  indent: (message: string) => void;
  log: (message: string) => void;
}

export const create = (prefix: string): Logger => ({
  done: (): void => {
    console.log(`\n${green('(づ｡◕‿‿◕｡)づ all systems are go')}`);
  },
  section: (...messages: string[]): void => {
    console.log(`\n${messages.join('\n')}\n`);
  },
  indent: (message: string): void => {
    console.log(`\n  ${message}`);
  },
  log: (message: string): void => {
    console.log(`[${prefix}] ${message}`);
  },
});
