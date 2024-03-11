import { expect, test } from '@jest/globals';

const resultStylish = '{\n'
    + '  - follow: false\n'
    + '    host: hexlet.io\n'
    + '  - proxy: 123.234.53.22\n'
    + '  - timeout: 50\n'
    + '  + timeout: 20\n' 
    + '  + verbose: true\n'
    + '}';

const resultPlain = 'Property \'follow\' was removed\n'
    + 'Property \'proxy\' was removed\n'
    + 'Property \'timeout\' was updated. From 50 to 20\n'
    + 'Property \'verbose\' was added with value: true';

export { resultStylish, resultPlain };


test('result object', () => {
    expect(resultStylish).not.toBeNull();
    expect(resultPlain).not.toBeNull();
});
