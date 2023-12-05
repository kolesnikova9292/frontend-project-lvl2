#!/usr/bin/env node
import program from 'commander';
import fs from 'fs';
import lodash from 'lodash';
import parsing from "./src/parsing.js";
import * as path from 'path';
import * as yaml from 'js-yaml';

//import { createRequire } from "module";

//const path = require('node:path');

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

        //const path = require('path');

        const extension1 = path.extname(file);
        const extension2 = path.extname(file2);



        if(extension1 === '.json' && extension2 === '.json') {

            const data = fs.readFileSync(file, 'utf8');
            const data1 = fs.readFileSync(file2, 'utf8');
            const json1 = JSON.parse(data);
            const json2 = JSON.parse(data1);

            const resultObject = parsing(json1, json2);

            console.log(resultObject)

            //console.log('{');
            //Object.entries(resultObject).forEach((e) => console.log(`    ${e[0]}: ${e[1]}`));
            //console.log('}');

        }



        if(extension1 === '.yaml' && extension2 === '.yaml') {

            const data = fs.readFileSync(file, 'utf8');
            const data1 = fs.readFileSync(file2, 'utf8');

            const doc = yaml.load(data);
            const doc2 = yaml.load(data1);
            //console.log(doc);


            //const json1 = JSON.parse(doc);
            //const json2 = JSON.parse(doc2);
            const resultObject = parsing(doc, doc2);
            console.log('{');
            Object.entries(resultObject).forEach((e) => console.log(`    ${e[0]}: ${e[1]}`));
            console.log('}');

        }


    } catch (err) {
      console.error(err);
    }
  });

//использую для тестирования
//program.parse(process.argv);
