import { test, expect } from '@jest/globals';
import half from "../src/half.js";
import parsing from "../src/parsing.js";
import fs from "fs";

test('half', () => {
    expect(half(6)).toBe(3);
});

test('parsing', () => {


    const data = fs.readFileSync('__tests__/__fixtures__/file1.json', 'utf8');
    const data1 = fs.readFileSync('__tests__/__fixtures__/file2.json', 'utf8');
    const json1 = JSON.parse(data);
    const json2 = JSON.parse(data1);

    const result = {"  host": "hexlet.io", "+ timeout": 20, "+ verbose": true, "- follow": false, "- proxy": "123.234.53.22", "= timeout": 50}


    expect(parsing(json1, json2)).toStrictEqual(result);
});
