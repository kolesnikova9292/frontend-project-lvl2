#!/usr/bin/env node
import program  from 'commander';
import fs from 'fs';
import lodash from 'lodash';



program
    .description('Compares two configuration files and shows a difference.') // command description
    .version('output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')

    // function to execute when command is uses
    .action(function () {

    });

// Order a coffee
// $ coffee-shop order
// $ coffee-shop o
/*program
    .command('order') // sub-command name
    .alias('o') // alternative sub-command is `o`
    .description('Order a coffee') // command description

    // function to execute when command is uses
    .action(function () {
        console.log('Order a coffee')
        //order();
    });*/

/*program
    .command('order <type>') // sub-command name, coffeeType = type, required
    .alias('o') // alternative sub-command is `o`
    .description('Order a coffee') // command description
    .option('-s, --sugar [value]', 'Sugar level', "Low") // args.sugar = value, optional, default is 'Low'
    .option('-d, --decaf', "Decaf coffee") // args.decaf = true/false, optional, default is `undefined`
    .option('-c, --cold', "Cold coffee") // args.cold = true/false, optional, default is `undefined`
    .option('-S, --served-in [value]', "Served in", "Mug") // args.servedIn = value, optional, default is 'Mug'
    .option('--no-stirrer', 'Do not add stirrer') // args.stirrer = true/false, optional, default is `true`

    // function to execute when command is uses
    .action(function (coffeeType, args) {
        console.log("YOUR ORDER");
        console.log('------------------');

        console.log('Coffee type is %s', colors.green(coffeeType));
        console.log('args.sugar %s', colors.green(args.sugar));
        console.log('args.decaf %s', colors.green(args.decaf));
        console.log('args.cold %s', colors.green(args.cold));
        console.log('args.servedIn %s', colors.green(args.servedIn));
        console.log('args.stirrer %s', colors.green(args.stirrer));
    });*/

program
    .description('Compares two configuration files and shows a difference.')
    .version('0.1.0')
    .usage('[options] <file> <file>')
    .arguments('<file> <file>')
    .action(function(file, file2) {
        //fileValue = file;
        //console.log(file);
        //console.log(file2);
        //const fs = require('fs')

        try {
            //var fs = require('fs');
            const data = fs.readFileSync(file, 'utf8')
            const data1 = fs.readFileSync(file2, 'utf8')
            const json1 = JSON.parse(data);
            const json2 = JSON.parse(data1);

            const keysWithObjRef = Object.keys(json1).map(x => {
                return { obj: 'json1', key: x };
            })

            const keysWithObj2Ref = Object.keys(json2).map(x => {
                return { obj: 'json2', key: x };
            })

            const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => {
                //console.log(a);
                //console.log(b);
                return a.key;
            });


            const allValues = [...Object.values(json1), ...Object.values(json2)];


            const obj = {}

            allKeys.forEach((x, index) => {
                //obj[x] = {value: allValues[index], sign: '+'}
               // console.log(x);
                let currentSign = ' ';
                if(json1.hasOwnProperty(x.key) && !json2.hasOwnProperty(x.key) ) {
                    currentSign = '-';
                }
                if(!json1.hasOwnProperty(x.key) && json2.hasOwnProperty(x.key) ) {
                    currentSign = '+';
                }
                if(json1.hasOwnProperty(x.key) && json2.hasOwnProperty(x.key) && json1[x.key] !== json2[x.key]) {
                    //if((json1[x.key] > json2[x.key])) {
                        if(x.obj === 'json1') {
                            currentSign = '=';
                        } else {
                            currentSign = '+';
                        }

                    //}
                   /* else {
                        currentSign = '-';
                    }*/

                }
                const field = `${currentSign} ${x.key}`;
                //obj[field] = allValues[index];
                //console.log(this);
                //console.log(x.obj);
                if(x.obj === 'json1') {
                    obj[field] = json1[x.key];
                } else {
                    obj[field] = json2[x.key];
                }
                //obj[field] = this.x.obj[x.key];
            })


            console.log('{');
            for(let prop in obj) {
                console.log(`    ${prop}: ${obj[prop]}`);
            }
            console.log('}');

            //console.log(JSON.parse(obj))

            /*console.log(data);
            console.log(data1);

            console.log(JSON.parse(data));
            console.log(JSON.parse(data1));

            const result = { ...JSON.parse(data), ...JSON.parse(data1)};

            console.log(lodash.sortBy(result));*/



        } catch (err) {
            console.error(err)
        }
    })


program.parse(process.argv);
