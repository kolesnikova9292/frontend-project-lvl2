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

  //console.log(resultObject);

  //return formatTree(resultObject, formatter)
}


const formatTree = (tree, formatter) => {
  if(formatter === 'stylish') {
    return stringify(tree, ' ', 1);
  }
}

const stringify = (value, replacer = ' ', spacesCount = 1) => {
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
};

