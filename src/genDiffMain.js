#!/usr/bin/env node
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import buildTree from "./buildTree.js";
import _ from 'lodash';

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

  //console.log(getDataByType(fileName1));

  console.log(resultObject[1].children);

  return formatTree(resultObject, formatter)
}


const formatTree = (tree, formatter) => {
  if(formatter === 'stylish') {
    console.log(stringify(tree, ' ', 4))
    return stringify(tree, ' ', 4);
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

