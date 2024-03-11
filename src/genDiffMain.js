#!/usr/bin/env node
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import _ from 'lodash';
import buildTree, { hasObjectThisProp } from './buildTree.js';

const mapping = {
  added: (prop, value) => `Property '${prop}' was added with value: ${value}`,
  deleted: (prop) => `Property '${prop}' was removed`,
  changed: (prop, value, oldValue) => `Property '${prop}' was updated. From ${oldValue} to ${value}`,
  unchanged: () => null,
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

const stringify = (tree, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    // глубина * количество отступов — смещение влево.

    const indentSize = depth * spacesCount - 2;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);
    const lines = currentValue.map(({
      key, value, children, type, oldValue,
    }) => {
      let sign = '  ';

      if (type === 'added') {
        sign = '+ ';
      }
      if (type === 'deleted') {
        sign = '- ';
      }

      if (!_.isNil(value)) {
        if (type === 'changed') {
          return [`${currentIndent}- ${key}: ${iter(oldValue, depth + 1)}`, `${currentIndent}+ ${key}: ${iter(value, depth + 1)}`].join('\n');
        }
        return `${currentIndent}${sign}${key}: ${iter(value, depth + 1)}`;
      }

      if (!_.isNil(children)) {
        return `${currentIndent}${sign}${key}: ${iter(children, depth + 1)}`;
      }
      return '';
    });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(tree, 1);
};

const plain = (tree) => {
  const iter = (currentValue, parentKey) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    /*if (!_.isObject(currentValue)) {
      // return `${currentValue}`;
      return mapping[currentValue.type](parentKey + '.' + key, value, oldValue);
    }*/

    const currentValueNew = currentValue.reduce((accumulator, current) => {
      if (hasObjectThisProp(accumulator, current.key)) {
        const index = accumulator.map((x) => x.key).indexOf(current.key);
        const itemAlreadyAdded = accumulator[index];
        // вот сюда нужно добавить какбы обратное условие
        if (itemAlreadyAdded.type === 'deleted' && current.type === 'added') {
          if (itemAlreadyAdded.children?.length > 0) {
            accumulator[index].oldValue = '[complex value]';
            accumulator[index].type = 'changed';
            accumulator[index].value = current.value;
            return [...accumulator];
          }
          if (current.children?.length > 0) {
            accumulator[index].oldValue = itemAlreadyAdded.value;
            accumulator[index].type = 'changed';
            accumulator[index].value = '[complex value]';
            return [...accumulator];
          }
        }

        if (current.type === 'deleted' && itemAlreadyAdded.type === 'added') {
          if (current.children?.length > 0) {
            accumulator[index].oldValue = '[complex value]';
            accumulator[index].type = 'changed';
            accumulator[index].value = itemAlreadyAdded.value;
            return [...accumulator];
          }
          if (itemAlreadyAdded.children?.length > 0) {
            accumulator[index].oldValue = '[complex value]';
            accumulator[index].type = 'changed';
            accumulator[index].value = current.value;
            return [...accumulator];
          }
        }
        return [...accumulator];
      }
      return [...accumulator, current];
    }, []);

    const lines = currentValueNew
      .reduce((accumulator, current) => {
        const {
          key, value, children, type, oldValue
        } = current;

        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const newValue = (parseInt(value) || parseInt(value) === 0 || value === 'true' || value === 'false' || value === 'null' || value === '[complex value]') ? value : `'${value}'`;
        const newOldValue = (parseInt(oldValue) || parseInt(oldValue) === 0 || oldValue === 'true' || oldValue === 'false' || oldValue === 'null' || oldValue === '[complex value]') ? oldValue : `'${oldValue}'`;

        if (!_.isNil(value)) {
          if (type === 'added' || type === 'deleted' || type === 'changed' || type === 'unchanged') {
            return [...accumulator, mapping[type](newKey, newValue, newOldValue)];
          }
          return accumulator;
        }
        if (!_.isNil(children) && type === 'added') {
          return [...accumulator, mapping[type](newKey, '[complex value]')];
        }
        if (!_.isNil(children) && type === 'deleted') {
          return [...accumulator, mapping[type](newKey, '[complex value]')];
        }
        if (!_.isNil(children)) {
          return [...accumulator, iter(children, newKey)];
        }
        return [...accumulator];
      }, []);

    return [
      ...lines.filter(Boolean),
    ].join('\n');
  };

  return iter(tree);
};

const json = (tree, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount - 2;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);
    const lines = currentValue
      .map(({
        key, value, children, type, oldValue,
      }) => {
        let sign = '  ';

        if (type === 'added') {
          sign = '+ ';
        }
        if (type === 'deleted') {
          sign = '- ';
        }

        if (!_.isNil(value)) {
          if (type === 'changed') {
            return [`${currentIndent}"- ${key}": "${iter(oldValue, depth + 1)}",`, `${currentIndent}"+ ${key}": "${iter(value, depth + 1)}",`].join('\n');
          }
          return `${currentIndent}"${sign}${key}": "${iter(value, depth + 1)}",`;
        }

        if (!_.isNil(children)) {
          return `${currentIndent}"${sign}${key}": ${iter(children, depth + 1)},`;
        }
        return null;
      });

    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(tree, 1);
};

const formatTree = (tree, formatter) => {
  if (formatter === 'stylish') {
    return stringify(tree, ' ', 4);
  }

  if (formatter === 'plain') {
    return plain(tree);
  }

  if (formatter === 'json') {
    return json(tree, ' ', 4);
  }
  return '';
};

export default function genDiffMain(fileName1, fileName2, formatter = 'stylish') {
  const resultObject = buildTree(
    getDataByType(fileName1),
    getDataByType(fileName2),
  );

  return formatTree(resultObject, formatter);
}
