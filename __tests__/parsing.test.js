import { test, expect } from '@jest/globals';
import half from "../src/half.js";
import parsing from "../src/parsing.js";
import fs from "fs";
import * as yaml from "js-yaml";

test('half', () => {
    expect(half(6)).toBe(3);
});

test('parsing', () => {


    const data = fs.readFileSync('__tests__/__fixtures__/json/file1.json', 'utf8');
    const data1 = fs.readFileSync('__tests__/__fixtures__/json/file2.json', 'utf8');
    const json1 = JSON.parse(data);
    const json2 = JSON.parse(data1);

   // const result = {"  host": "hexlet.io", "+ timeout": 20, "+ verbose": true, "- follow": false, "- proxy": "123.234.53.22", "- timeout": 50}

    const result = '{\n' +
        ' - follow: false\n' +
        '   host: hexlet.io\n' +
        ' - proxy: 123.234.53.22\n' +
        ' + timeout: 50\n' +
        ' - timeout: 20\n' +
        ' + verbose: true\n' +
        '}';


    expect(parsing(json1, json2)).toStrictEqual(result);
});

test('parsing2', () => {


    const data = fs.readFileSync('__tests__/__fixtures__/yaml/file1.yaml', 'utf8');
    const data1 = fs.readFileSync('__tests__/__fixtures__/yaml/file2.yaml', 'utf8');
    const json1 = yaml.load(data);
    const json2 = yaml.load(data1);

    //const result = {"  host": "hexlet.io", "+ timeout": 20, "+ verbose": true, "- follow": false, "- proxy": "123.234.53.22", "- timeout": 50}
    const result = '{\n' +
        ' - follow: false\n' +
        '   host: hexlet.io\n' +
        ' - proxy: 123.234.53.22\n' +
        ' + timeout: 50\n' +
        ' - timeout: 20\n' +
        ' + verbose: true\n' +
        '}'


    expect(parsing(json1, json2)).toStrictEqual(result);
});


test('parsing', () => {


    const data = fs.readFileSync('__tests__/__fixtures__/json2/file1.json', 'utf8');
    const data1 = fs.readFileSync('__tests__/__fixtures__/json2/file2.json', 'utf8');
    const json1 = JSON.parse(data);
    const json2 = JSON.parse(data1);

    // const result = {"  host": "hexlet.io", "+ timeout": 20, "+ verbose": true, "- follow": false, "- proxy": "123.234.53.22", "- timeout": 50}

    const result = '{\n' +
        '   common: {\n' +
        '    - follow: {\n' +
        '      }\n' +
        '      setting1: Value 1\n' +
        '    - setting2: 200\n' +
        '    - setting3: true\n' +
        '    + setting4: blah blah\n' +
        '    + setting5: {\n' +
        '       key5: value5\n' +
        '      }\n' +
        '      setting6: {\n' +
        '         doge: {\n' +
        '          + wow: so much\n' +
        '         }\n' +
        '         key: value\n' +
        '       + ops: vops\n' +
        '      }\n' +
        '   }\n' +
        '   group1: {\n' +
        '    + baz: bas\n' +
        '    - baz: bars\n' +
        '      foo: bar\n' +
        '      nest: {\n' +
        '       + 0: s\n' +
        '       + 1: t\n' +
        '       + 2: r\n' +
        '       - key: value\n' +
        '      }\n' +
        '   }\n' +
        ' - group2: {\n' +
        '    abc: 12345\n' +
        '    deep: {\n' +
        '     id: 45\n' +
        '    }\n' +
        '   }\n' +
        ' + group3: {\n' +
        '    deep: {\n' +
        '     id: {\n' +
        '      number: 45\n' +
        '     }\n' +
        '    }\n' +
        '    fee: 100500\n' +
        '   }\n' +
        '}';


    expect(parsing(json1, json2)).toStrictEqual(result);
});
