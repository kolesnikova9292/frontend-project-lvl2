#!/usr/bin/env node
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import buildTree, {hasObjectThisProp} from "./buildTree.js";
import _ from 'lodash';

const mapping = {
    added: (prop, value) => `Property '${prop}' was added with value: ${value}`,
    deleted: (prop) => `Property '${prop}' was removed`,
    changed: (prop, value, oldValue) => `Property '${prop}' was updated. From ${oldValue} to ${value}`,
    unchanged: (prop) => null,
};

const getDataByType = (fileName) => {
  const dateType = path.extname(fileName).slice(1);
  const filePath = path.resolve(fileName);
  const data = fs.readFileSync(filePath, 'utf8');

  if (dateType === 'json') {
    return JSON.parse(data);
  }
  if (dateType === 'yaml' || dateType === 'yml') {
    return yaml.load(data);
  }
  return null;
};

export default function genDiffMain(fileName1, fileName2, formatter = 'stylish') {
  const resultObject = buildTree(
    getDataByType(fileName1),
    getDataByType(fileName2)
  );

  return formatTree(resultObject, formatter)
}


const formatTree = (tree, formatter) => {
  if(formatter === 'stylish') {
    //console.log(stringify(tree, ' ', 4))
    return stringify(tree, ' ', 4);
  }

    if(formatter === 'plain') {
        //console.log(plain(tree))
        return plain(tree);
    }
}

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    //глубина * количество отступов — смещение влево.

    const indentSize = depth * spacesCount - 2;
    const currentIndent = replacer.repeat(indentSize);
    //const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const bracketIndent = replacer.repeat(indentSize - 2);
    //console.log(8888);
    //console.log(currentIndent);
    const lines =
        //Object
        //.entries(currentValue)
        currentValue
        .map(({ key, value, children, type, oldValue }) => {

          let sign = '  ';

          if(type === 'added') {
            sign = '+ '

          }
          if(type === 'deleted') {
            sign = '- ';
          }

          if(!_.isNil(value)) {
            if (type === 'changed') {
              return [`${currentIndent}- ${key}: ${iter(oldValue, depth + 1)}`, `${currentIndent}+ ${key}: ${iter(value, depth + 1)}`].join('\n');
            }
            return `${currentIndent}${sign}${key}: ${iter(value, depth + 1)}`;
          }

          if(!_.isNil(children)) {
            return `${currentIndent}${sign}${key}: ${iter(children, depth + 1)}`;
          }



        });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, 1);
};

const plain = (value) => {
    const iter = (currentValue, parentKey) => {
        //console.log(currentValue)
        // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
        if (!_.isObject(currentValue)) {
            //return `${currentValue}`;
            return mapping[type](parentKey + '.' + key, value, oldValue);
        }

        /*const lines = currentValue
                .map(({ key, value, children, type, oldValue }) => {
                    const newKey = parentKey ? parentKey + '.' + key : key;
                    const newValue = (Number(value) || value == 'true' || value == 'false' || value == 'null') ? value :  '\'' + value + '\'';
                    const newOldValue = (Number(oldValue) || oldValue == 'true' || oldValue == 'false' || oldValue == 'null') ? oldValue :  '\'' + oldValue + '\'';
                    if(!_.isNil(value)) {
                        if (type === 'added' || type === 'deleted' || type === 'changed' || type === 'unchanged') {
                            return mapping[type](newKey, newValue, newOldValue);
                        }
                        return null;
                    }
                    if(!_.isNil(children) && type === 'added') {
                        return mapping[type](newKey, '[complex value]');
                    }
                    if(!_.isNil(children) && type === 'deleted') {
                        return mapping[type](newKey, '[complex value]');
                    }
                    if(!_.isNil(children)) {
                        return iter(children, newKey);
                    }
                });*/

        const currentValueNew = currentValue.reduce((accumulator, currentValue) => {

            if(hasObjectThisProp(accumulator, currentValue.key)) {

                const index = accumulator.map(x => x.key).indexOf(currentValue.key);

                const itemAlreadyAdded = accumulator[index]

                console.log(itemAlreadyAdded);
                console.log(currentValue);

                //вот сюда нужно добавить какбы обратное условие
                if(itemAlreadyAdded.type === 'deleted' && currentValue.type === 'added') {
                    if(itemAlreadyAdded.children?.length > 0) {
                        accumulator[index].oldValue = '[complex value]';
                        accumulator[index].type = 'changed';
                        accumulator[index].value = currentValue.value;
                        return [ ...accumulator ]
                    }
                    if(currentValue.children?.length > 0) {
                        accumulator[index].oldValue = itemAlreadyAdded.value;
                        accumulator[index].type = 'changed';
                        accumulator[index].value = '[complex value]';
                        return [ ...accumulator ]
                    }
                }

                if(currentValue.type === 'deleted' && itemAlreadyAdded.type === 'added') {
                    console.log(7777)
                    if(currentValue.children?.length > 0) {
                        console.log(7777)
                        accumulator[index].oldValue = '[complex value]';
                        accumulator[index].type = 'changed';
                        accumulator[index].value = itemAlreadyAdded.value;
                        console.log(accumulator[index]);
                        return [ ...accumulator ]
                    }
                    if(itemAlreadyAdded.children?.length > 0) {
                        console.log(7777)
                        accumulator[index].oldValue = '[complex value]';
                        accumulator[index].type = 'changed';
                        accumulator[index].value = currentValue.value;
                        console.log(accumulator[index]);
                        return [ ...accumulator ]
                    }
                }

                return [ ...accumulator ]
            }

            return [ ...accumulator, currentValue ]

        }, []);


        const lines = currentValueNew
            .reduce((accumulator, currentValue) => {
                const { key, value, children, type, oldValue } = currentValue;

                const newKey = parentKey ? parentKey + '.' + key : key;
                const newValue = (Number(value) || value == 'true' || value == 'false' || value == 'null' || value == '[complex value]' || value == 0 || value == '') ? value :  '\'' + value + '\'';
                const newOldValue = (Number(oldValue) || oldValue == 'true' || oldValue == 'false' || oldValue == 'null' || oldValue == '[complex value]' || oldValue == 0 || oldValue == '') ? oldValue :  '\'' + oldValue + '\'';

                if(!_.isNil(value)) {
                    if (type === 'added' || type === 'deleted' || type === 'changed' || type === 'unchanged') {
                        return [ ...accumulator, mapping[type](newKey, newValue, newOldValue) ];
                    }
                    return accumulator;
                }
                if(!_.isNil(children) && type === 'added') {
                    return [ ...accumulator, mapping[type](newKey, '[complex value]') ];
                }
                if(!_.isNil(children) && type === 'deleted') {
                    return [ ...accumulator, mapping[type](newKey, '[complex value]') ];
                }
                if(!_.isNil(children)) {
                    return [ ...accumulator, iter(children, newKey) ];
                }
            }, []);

        return [
            ...lines.filter(Boolean) ,
        ].join('\n');
    };

    return iter(value);
};

/*const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    let indentSize = depth * spacesCount;
    let currentIndent = replacer.repeat(indentSize);
    let bracketIndent = replacer.repeat(indentSize - spacesCount);


    if(currentValue.type === 'nested') {
      const lines = currentValue.children
            .map((x) => {
                  if(x.type === 'nested') {
                    return `${currentIndent}${iter(x, depth+1)}`
                  } else {
                    let firstSymbol = ' ';
                    if(x.type === 'added')
                      firstSymbol = '+';
                    if(x.type === 'deleted')
                      firstSymbol = '-';

                    if(x.type === 'changed') {
                      return `${currentIndent}- ${x.key}: ${x.oldValue}\n${currentIndent}+ ${x.key}: ${x.newValue}`;
                    }

                    return `${currentIndent}${firstSymbol} ${x.key}: ${x.value}`;
                  }
                }
            );

        return [
          //`${bracketIndent}{`,
          `${currentIndent}${currentValue.key}: {`,
          ...lines,
          // '}'
          `${bracketIndent}}`,
        ].join('\n');

      } else {
        let firstSymbol = ' ';
        if(currentValue.type === 'added')
          firstSymbol = '+';
        if(currentValue.type === 'deleted')
          firstSymbol = '-';

        if(currentValue.type === 'changed') {
          return `${currentIndent}- ${currentValue.key}: ${currentValue.oldValue}\n${currentIndent}+ ${currentValue.key}: ${currentValue.newValue}`;
        }

        return `${currentIndent}${firstSymbol} ${currentValue.key}: ${currentValue.value}`;

      }
  };

  return `{\n${value.map(value1 => {
    const rez = iter(value1, 1);
    return rez;
  }).join('\n')}\n}` ;
};*/

