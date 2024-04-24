import { test, expect } from '@jest/globals';
import genDiff from '../src/genDiffMain.js';
import { resultStylish, resultPlain } from '../__fixtures__/json/result.js';
import { resultStylish as resultStylish1, resultPlain as resultPlain1 } from '../__fixtures__/json2/result.js';
import result3 from '../__fixtures__/yaml/result.js';
import result4 from '../__fixtures__/yaml2/result.js';

test.each([
  ['__fixtures__/json/file1.json', '__fixtures__/json/file2.json', 'stylish', resultStylish],
  ['__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'stylish', resultStylish1],
  ['__fixtures__/yaml/file1.yaml', '__fixtures__/yaml/file2.yaml', 'stylish', result3],
  ['__fixtures__/yaml2/file1.yaml', '__fixtures__/yaml2/file2.yaml', 'stylish', result4],
  ['__fixtures__/json/file1.json', '__fixtures__/json/file2.json', 'plain', resultPlain],
  ['__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'plain', resultPlain1],
])('genDIffMain', (file1, file2, formatter, result) => {
  expect(genDiff(file1, file2, formatter)).toStrictEqual(
    result,
  );
});

test('parsing6', () => {
  const rez = genDiff('__fixtures__/json/file1.json', '__fixtures__/json/file2.json', 'json');
  expect(JSON.parse(rez).find(x => x.key === 'follow').value).toEqual(false); // eslint-disable-line
});

test('parsing7', () => {
  expect(JSON.parse(genDiff('__fixtures__/json2/file1.json', '__fixtures__/json2/file2.json', 'json')).find(x => x.key === 'common').children.find(x => x.key === 'follow').value).toEqual(false); // eslint-disable-line
});
