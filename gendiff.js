#!/usr/bin/env node
import program  from 'commander';

program
    .description('Compares two configuration files and shows a difference.') // command description
    .version('output the version number')
    .helpOption('-h, --HELP', 'output usage information')
    // function to execute when command is uses
    .action(function () {

    });

program.parse(process.argv);
