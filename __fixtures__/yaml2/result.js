const result = '{\n'
  + '    common: {\n'
  + '      + follow: false\n'
  + '        setting1: Value 1\n'
  + '      - setting2: 200\n'
  + '      - setting3: true\n'
  + '      + setting3: {\n'
  + '            key: value\n'
  + '        }\n'
  + '      + setting4: blah blah\n'
  + '      + setting5: {\n'
  + '            key5: value5\n'
  + '        }\n'
  + '        setting6: {\n'
  + '            doge: {\n'
  + '              - wow: too much\n'
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
  + '    group4: {\n'
  + '      - default: null\n'
  + '      + default: \n'
  + '      - foo: 0\n'
  + '      + foo: null\n'
  + '      - isNested: false\n'
  + '      + isNested: none\n'
  + '      + key: false\n'
  + '        nest: {\n'
  + '          - bar: \n'
  + '          + bar: 0\n'
  + '          - isNested: true\n'
  + '        }\n'
  + '      + someKey: true\n'
  + '      - type: bas\n'
  + '      + type: bar\n'
  + '    }\n'
  + '    language: js\n'
  + '}';

export default result;
