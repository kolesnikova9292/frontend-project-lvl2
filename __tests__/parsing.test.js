import {test, expect} from '@jest/globals';
import genDiff from '../src/genDiffMain.js';
import { resultStylish, resultPlain } from '../__fixtures__/json/result.js'
import { resultStylish as resultStylish1, resultPlain as resultPlain1 } from '../__fixtures__/json2/result.js'
import result3 from '../__fixtures__/yaml/result.js'

  test.each([
    ['__fixtures__/json/file1.json', '__fixtures__/json/file2.json', 'stylish', resultStylish],
    ['__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'stylish', resultStylish1],
    ['__fixtures__/yaml/file1.yaml', '__fixtures__/yaml/file2.yaml', 'stylish', result3],
    ['__fixtures__/json/file1.json', '__fixtures__/json/file2.json', 'plain', resultPlain],
    ['__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'plain', resultPlain1]
  ])('genDIffMain', (file1, file2, formatter, result) => {
    expect(genDiff(file1, file2, formatter)).toStrictEqual(
        result,
    );
  });

test('parsing6', () => {
  const rez = genDiff('__fixtures__/json/file1.json', '__fixtures__/json/file2.json', 'json');
  expect(JSON.parse(rez)["- follow"]).toEqual("false"); // eslint-disable-line
});

test('parsing7', () => {
  expect(JSON.parse(genDiff('__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'json'))["  common"]["+ follow"]).toEqual("false"); // eslint-disable-line
  expect(JSON.parse(genDiff('__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'json'))["+ group3"]["  fee"]).toEqual("100500"); // eslint-disable-line
});
