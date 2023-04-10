const chalk = require('chalk')
const pkg = require('../package.json')

console.log(`

${chalk.green('Hey there! 👋')}

Thanks for giving the ${pkg.name} a try. 🎉

To get you going add your Aamu.app API key to the file .env.example, then rename that file to .env.

After that you can:

${chalk.yellow(
  'npm run dev'
)} to start a development environment at ${chalk.green('localhost:8000')}

or

${chalk.yellow(
  'npm run build'
)} to create a production ready static site in ${chalk.green('./public')}


`)
