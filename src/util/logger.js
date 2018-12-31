// Attatches to the string prototype
require('colors');

/**
 * Logger object for colourful logging :)
 *
 */
const logger = {
  log: (...args) => {
    // Sets loggin output tag to green
    let tag = "[ LOG ]".green;

    
    // Maps through arguments and attaches tag to each arg
    let colorArgs = args.map(arg => {

      if(typeof arg === 'object') {
        // turn the object to a string so we
        // can log all the properties and color it
        var string = JSON.stringify(arg, null, 2);
        return tag + '  ' + string.cyan;
      } else {
        return tag + '  ' + arg.cyan;
      }

    });
    console.log.apply(console, colorArgs);
  },
  error: (...args) => {
    // Sets error output to red
    let tag = "[ ERROR ]".red;

    // Maps through arguments and attaches tag to each arg
    let colorArgs = args.map(arg => {
      // Returns colored string
      return tag + ' ' + arg.yellow;
    });

    // Logs arguments
    console.log.apply(console, colorArgs);
  }
};

module.exports = logger;