import { test, expect } from '@jest/globals';
import half from '../src/half.js';
import genDiff from '../genDiff.js';

test('half', () => {
  expect(half(6)).toBe(3);
});

test('parsing1', () => {
  const result = '{\n'
      + '  - follow: false\n'
      + '    host: hexlet.io\n'
      + '  - proxy: 123.234.53.22\n'
      + '  - timeout: 50\n'
      + '  + timeout: 20\n'
      + '  + verbose: true\n'
      + '}';
  expect(genDiff('__tests__/__fixtures__/json/file1.json', '__tests__/__fixtures__/json/file2.json', 'stylish')).toStrictEqual(result);
});
test('parsing2', () => {
  const result = '{\n'
        + '  - follow: false\n'
        + '    host: hexlet.io\n'
        + '  - proxy: 123.234.53.22\n'
        + '  - timeout: 50\n'
        + '  + timeout: 20\n'
        + '  + verbose: true\n'
        + '}';
  expect(genDiff('__tests__/__fixtures__/yaml/file1.yaml', '__tests__/__fixtures__/yaml/file2.yaml')).toStrictEqual(result);
});
test('parsing3', () => {
  const result = '{\n'
        + '    common: {\n'
        + '      + follow: false\n'
        + '        setting1: Value 1\n'
        + '      - setting2: 200\n'
        + '      - setting3: true\n'
        + '      + setting3: null\n'
        + '      + setting4: blah blah\n'
        + '      + setting5: {\n'
        + '            key5: value5\n'
        + '        }\n'
        + '        setting6: {\n'
        + '            doge: {\n'
        + '              - wow: \n'
        + '              + wow: so much\n'
        + '            }\n'
        + '            key: value\n'
        + '          + ops: vops\n'
        + '        }\n'
        + '    }\n'
        + '    group1: {\n'
        + '      - baz: bas\n'
        + '      + baz: bars\n'
        + '        foo: bar\n'
        + '      - nest: {\n'
        + '            key: value\n'
        + '        }\n'
        + '      + nest: str\n'
        + '    }\n'
        + '  - group2: {\n'
        + '        abc: 12345\n'
        + '        deep: {\n'
        + '            id: 45\n'
        + '        }\n'
        + '    }\n'
        + '  + group3: {\n'
        + '        deep: {\n'
        + '            id: {\n'
        + '                number: 45\n'
        + '            }\n'
        + '        }\n'
        + '        fee: 100500\n'
        + '    }\n'
        + '}';
  expect(genDiff('__tests__/__fixtures__/json2/file1.json', '__tests__/__fixtures__/json2/file2.json')).toStrictEqual(result);
});

test('parsing4', () => {
  const result = ''
      + 'Property \'follow\' was removed\n'
      + 'Property \'proxy\' was removed\n'
      + 'Property \'timeout\' was updated. From 50 to 20\n'
      + 'Property \'verbose\' was added with value: true';
  expect(genDiff('__tests__/__fixtures__/json/file1.json', '__tests__/__fixtures__/json/file2.json', 'plain')).toStrictEqual(result);
});

test('parsing5', () => {
  const result = ''
        + 'Property \'common.follow\' was added with value: false\n'
        + 'Property \'common.setting2\' was removed\n'
        + 'Property \'common.setting3\' was updated. From true to null\n'
        + 'Property \'common.setting4\' was added with value: \'blah blah\'\n'
        + 'Property \'common.setting5\' was added with value: [complex value]\n'
        + 'Property \'common.setting6.doge.wow\' was updated. From \'\' to \'so much\'\n'
        + 'Property \'common.setting6.ops\' was added with value: \'vops\'\n'
        + 'Property \'group1.baz\' was updated. From \'bas\' to \'bars\'\n'
        + 'Property \'group1.nest\' was updated. From [complex value] to \'str\'\n'
        + 'Property \'group2\' was removed\n'
        + 'Property \'group3\' was added with value: [complex value]';
  expect(genDiff('__tests__/__fixtures__/json2/file1.json', '__tests__/__fixtures__/json2/file2.json', 'plain')).toStrictEqual(result);
});

test('parsing6', () => {
  const result = {
    "-follow": false, // eslint-disable-line
    " host": "hexlet.io", // eslint-disable-line
    "-proxy": "123.234.53.22", // eslint-disable-line
    "-timeout": 50, // eslint-disable-line
    "+timeout": 20, // eslint-disable-line
    "+verbose": true, // eslint-disable-line
  };
  expect(genDiff('__tests__/__fixtures__/json/file1.json', '__tests__/__fixtures__/json/file2.json', 'json')).toStrictEqual(result);
  expect(genDiff('__tests__/__fixtures__/json/file1.json', '__tests__/__fixtures__/json/file2.json', 'json')["-follow"]).toStrictEqual(false); // eslint-disable-line
});

test('parsing7', () => {
  expect(JSON.parse(genDiff('__tests__/__fixtures__/json2/file1.json', '__tests__/__fixtures__/json2/file2.json', 'json'))[" common"]["+follow"]).toEqual("false"); // eslint-disable-line
  expect(JSON.parse(genDiff('__tests__/__fixtures__/json2/file1.json', '__tests__/__fixtures__/json2/file2.json', 'json'))["+group3"][" fee"]).toEqual("100500"); // eslint-disable-line
});
