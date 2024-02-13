#!/usr/bin/env node
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { startResult } from './formatters/index.js';
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
    getDataByType(fileName2),
    //formatter,
    //startResult(formatter),
  );
  /*if (formatter === 'plain') {
    return resultObject.slice(0, -1);
  }*/

  return formatTree(resultObject, formatter)

  //return resultObject;
}


const formatTree = (tree, formatter) => {
  if(formatter === 'stylish') {
    //console.log(tree[0])
    console.log(stringify(tree[0]))
    //return stringify(tree);
  }

}

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {

    //console.log(currentValue)
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (currentValue.value && !_.isObject(currentValue.value)) {
      return currentValue.value;
    }

    let indentSize = depth * spacesCount;
    let currentIndent = replacer.repeat(indentSize);
    let bracketIndent = replacer.repeat(indentSize - spacesCount);
    //console.log(currentValue)

   // if(currentValue.type === 'nested') {
      const lines = currentValue.children
          .map((x) => {
            if(x.type === 'nested') {
              const qwe = depth - 1;
              const ert = qwe * spacesCount;
              const uio = replacer.repeat(ert);
              //return `${currentIndent}${x.key}: ${iter(x, depth + 1)}`
              return `${uio}${iter(x, depth+1)}`
            } else {
              const qwe = depth + 1;
              const ert = qwe * spacesCount;
              const uio = replacer.repeat(ert);
              return `${uio}${x.key}: ${x.value}`
              //return `${currentIndent}${x.key}: ${x.value}`
            }
          }
        );

      console.log(lines)

      depth = depth + 1;
      let indentSize1 = depth * spacesCount;
     // let currentIndent1 = replacer.repeat(indentSize1);
      let bracketIndent1 = replacer.repeat(indentSize1 - spacesCount);

      return [
        //`${bracketIndent}{`,
        `${currentIndent}${currentValue.key} : {`,
        ...lines,
         // '}'
        `${bracketIndent1}}`,
      ].join('\n');


   // } else {

     // console.log(55555)
    //  console.log(currentValue)

  //    return currentValue.value;

   // }
  };

  return `{\n${iter(value, 1)}\n}` ;
};

