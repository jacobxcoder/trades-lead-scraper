import { Signale } from 'signale';

const options = {
  disabled: false,
  interactive: false,
  secrets: [],
  stream: process.stdout
};

export const logger = new Signale(options);
export default logger;
