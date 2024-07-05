import chalk from 'chalk';

const { dim, green, magenta, red, yellow } = chalk;

export const echo = (message) => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(message);
};

export const before = (message) => {
  return `\n${message}`;
};

export const indent = (message) => {
  return `  ${message}`;
};

export const info = (message) => {
  return indent(dim(`❯ ${message}`));
};

export const warn = (message) => {
  return indent(yellow(`❯ ${message}`));
};

export const yay = (message = 'yay!') => {
  return before(indent(magenta(`\\ (•◡•) / ${message}`)));
};

export const done = (message = 'done!') => {
  return before(indent(green(`(づ｡◕‿‿◕｡)づ ${message}`)));
};

export const caught = (message = 'what!') => {
  return before(indent(red(`(╯°□°)╯︵ ┻━┻ ${message}`)));
};
