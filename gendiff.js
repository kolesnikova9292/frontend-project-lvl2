#!/usr/bin/env node
import program from 'commander';
import fs from 'fs';
import lodash from 'lodash';

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

      const keysWithObjRef = Object.keys(json1).map((x) => {
        const result = { obj: 'json1', key: x };
        return result;
      });

      const keysWithObj2Ref = Object.keys(json2).map((x) => {
        const result = { obj: 'json2', key: x };
        return result;
      });

      const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

      const obj = {};

      allKeys.forEach((x) => {
        let currentSign = ' ';
        if (Object.prototype.hasOwnProperty.call(json1, x.key)
          && !Object.prototype.hasOwnProperty.call(json2, x.key)) {
          currentSign = '-';
        }
        if (!Object.prototype.hasOwnProperty.call(json1, x.key)
          && Object.prototype.hasOwnProperty.call(json2, x.key)) {
          currentSign = '+';
        }
        if (Object.prototype.hasOwnProperty.call(json1, x.key)
          && Object.prototype.hasOwnProperty.call(json2, x.key)
          && json1[x.key] !== json2[x.key]) {
          if (x.obj === 'json1') {
            currentSign = '=';
          } else {
            currentSign = '+';
          }
        }
        const field = `${currentSign} ${x.key}`;
        if (x.obj === 'json1') {
          obj[field] = json1[x.key];
        } else {
          obj[field] = json2[x.key];
        }
      });

      console.log('{');
      Object.entries(obj).forEach((e) => console.log(`    ${e[0]}: ${e[1]}`));
      console.log('}');
    } catch (err) {
      console.error(err);
    }
  });

program.parse(process.argv);
