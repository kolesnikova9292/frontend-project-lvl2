#!/usr/bin/env node
import program from 'commander';
import fs from 'fs';
import lodash from 'lodash';
import parsing from "./src/parsing.js";

program
  .description('Compares two configuration files and shows a difference.') // command description
  .version('output the version number')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')

  // function to execute when command is uses
  .action(() => {

  });

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0')
  .usage('[options] <file> <file>')
  .arguments('<file> <file>')
  .action((file, file2) => {
    try {
      const data = fs.readFileSync(file, 'utf8');
      const data1 = fs.readFileSync(file2, 'utf8');
      const json1 = JSON.parse(data);
      const json2 = JSON.parse(data1);

      const resultObject = parsing(json1, json2);

      console.log('{');
      Object.entries(resultObject).forEach((e) => console.log(`    ${e[0]}: ${e[1]}`));
      console.log('}');
    } catch (err) {
      console.error(err);
    }
  });

program.parse(process.argv);
