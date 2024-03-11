import {expect, test} from "@jest/globals";

const result = '{\n' +
    '  - follow: false\n' +
    '    host: hexlet.io\n' +
    '  - proxy: 123.234.53.22\n' +
    '  - timeout: 50\n' +
    '  + timeout: 20\n' +
    '  + verbose: true\n' +
    '}';

export default result;


test('result object', () => {
    expect(result).not.toBeNull();
});
