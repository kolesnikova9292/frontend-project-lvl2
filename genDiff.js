#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import parsing from './src/parsing.js';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {startResult} from './src/formatters/index.js';

//const program = new Command();

//import { createRequire } from "module";

//const path = require('node:path');

/*program
    .description('Compares two configuration files and shows a difference.') // command description
    .version('output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')

    // function to execute when command is uses
    .action(() => {

    });*/


program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format <type>', 'output format', 'stylish')
    .arguments('<filepath1>')
    .arguments('<filepath2>')
    .allowUnknownOption(true)
    .action((filepath1, filepath2) => {
        //const result = genDiff(filepath1, filepath2, program.opts().format);
        const result = genDiff(filepath1, filepath2, program.opts().format);
        console.log(result);
    });


/*program
    .description('Compares two configuration files and shows a difference.')
    .version('0.1.0')
    .usage('[options] <file> <file>')
    .arguments('<file> <file>')
    .allowUnknownOption(true)
    .action((file, file2) => {
       // const result = genDiff(file, file2);
       // console.log(result);
        try {
            return genDiff(file, file2);
        } catch (err) {
            console.error(err);
        }
    });*/

program.parse();

export default function genDiff(fileName1, fileName2, formatter = 'stylish', replacer = ' ', spacesCount = 1,  result = startResult(formatter), step = 1) {

    const extension1 = path.extname(fileName1);
    const extension2 = path.extname(fileName2);

    const file1 = path.resolve(fileName1);
    const file2 = path.resolve(fileName2);


    if (extension1 === '.json' && extension2 === '.json') {

        //console.log(8888)

        const data = fs.readFileSync(file1, 'utf8');
        const data1 = fs.readFileSync(file2, 'utf8');
        //console.log(data)
        //console.log(data1)
        const json1 = JSON.parse(data);
        const json2 = JSON.parse(data1);

        //console.log(json1)
        //console.log(json2)

        let resultObject = parsing(json1, json2, formatter, replacer, spacesCount,  result, step);

        if(formatter === 'plain') {
            resultObject = resultObject.slice(0, -1);
           // console.log(resultObject)
        }

        //console.log(9999)

        //console.log(resultObject)

        return resultObject;

        //console.log(resultObject)

        //console.log('{');
        //Object.entries(resultObject).forEach((e) => console.log(`    ${e[0]}: ${e[1]}`));
        //console.log('}');

    }


    if (extension1 === '.yaml' && extension2 === '.yaml' || extension1 === '.yml' && extension2 === '.yml') {

        const data = fs.readFileSync(file1, 'utf8');
        const data1 = fs.readFileSync(file2, 'utf8');

        const doc = yaml.load(data);
        const doc2 = yaml.load(data1);
        //console.log(doc);


        //const json1 = JSON.parse(doc);
        //const json2 = JSON.parse(doc2);
        let resultObject = parsing(doc, doc2, formatter, replacer, spacesCount,  result, step);

        if(formatter === 'plain') {
            resultObject = resultObject.slice(0, -1);
           // console.log(resultObject)
        }

        return resultObject;
        /*console.log('{');
        Object.entries(resultObject).forEach((e) => console.log(`    ${e[0]}: ${e[1]}`));
        console.log('}');*/

    }


}
