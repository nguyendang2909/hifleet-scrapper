const env = process.env.NODE_ENV;

let headless = true;
if (env === 'development') headless = false;


export default {
  // Hide Chrome or not?
  headless,
  // slowMo: 100,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-notifications',
  ],
  defaultViewport: {
    width: 1100,
    height: 600,
  },
};
