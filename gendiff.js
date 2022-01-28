#!/usr/bin/env node
import program  from 'commander';



program
    .description('Compares two configuration files and shows a difference.') // command description
    .version('output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')

    // function to execute when command is uses
    .action(function () {

    });

program.parse(process.argv);
