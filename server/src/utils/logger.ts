export const logger = {
  info(message: string) {
    // eslint-disable-next-line no-console
    console.log(message);
  },
  error(message: string, error?: unknown) {
    // eslint-disable-next-line no-console
    console.error(message, error);
  },
};
