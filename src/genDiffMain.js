import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import _ from 'lodash';
import buildTree from './buildTree.js';

const mapping = {
  added: (prop, value) => `Property '${prop}' was added with value: ${value}`,
  deleted: (prop) => `Property '${prop}' was removed`,
  changed: (prop, value, oldValue) => `Property '${prop}' was updated. From ${oldValue} to ${value}`,
  unchanged: () => null,
};

const sign = (type) => {
  if (type === 'added') {
    return '+ ';
  }
  if (type === 'deleted') {
    return '- ';
  }
  return '  ';
};

const parsedDataByType = (data, dateType) => {
  if (dateType === 'json') {
    return JSON.parse(data);
  }
  if (dateType === 'yaml' || dateType === 'yml') {
    return yaml.load(data);
  }
  return null;
};

const getParsedData = (fileName) => {
  const dateType = path.extname(fileName).slice(1);
  const filePath = path.resolve(fileName);
  const data = fs.readFileSync(filePath, 'utf8');
  return parsedDataByType(data, dateType);
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
      if (!_.isNil(value)) {
        if (type === 'changed') {
          return [`${currentIndent}- ${key}: ${iter(oldValue, depth + 1)}`, `${currentIndent}+ ${key}: ${iter(value, depth + 1)}`].join('\n');
        }
        return `${currentIndent}${sign(type)}${key}: ${iter(value, depth + 1)}`;
      }

      if (!_.isNil(children)) {
        return `${currentIndent}${sign(type)}${key}: ${iter(children, depth + 1)}`;
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
    /* if (!_.isObject(currentValue)) {
      // return `${currentValue}`;
      return mapping[currentValue.type](parentKey + '.' + key, value, oldValue);
    } */

    const currentValueNew = currentValue.reduce((accumulator, current) => {
      if (_.some(accumulator, (item) => item.key === current.key)) {
        const index = accumulator.findIndex(({ key }) => key === current.key);
        const itemAlreadyAdded = accumulator[index];
        if (itemAlreadyAdded.type === 'deleted' && current.type === 'added') {
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: '[complex value]', type: 'changed', value: current.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
          if (current.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: itemAlreadyAdded.value, type: 'changed', value: '[complex value]',
              },
              ...accumulator.slice(index + 1),
            ];
          }
        }

        if (current.type === 'deleted' && itemAlreadyAdded.type === 'added') {
          if (current.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: '[complex value]', type: 'changed', value: itemAlreadyAdded.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: '[complex value]', type: 'changed', value: current.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
        }
        return [...accumulator];
      }
      return [...accumulator, current];
    }, []);

    const lines = currentValueNew
      .reduce((accumulator, current) => {
        const {
          key, value, children, type, oldValue,
        } = current;

        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const newValue = (parseInt(value, 10) || parseInt(value, 10) === 0 || value === 'true' || value === 'false' || value === 'null' || value === '[complex value]') ? value : `'${value}'`;
        const newOldValue = (parseInt(oldValue, 10) || parseInt(oldValue, 10) === 0 || oldValue === 'true' || oldValue === 'false' || oldValue === 'null' || oldValue === '[complex value]') ? oldValue : `'${oldValue}'`;

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

const formatTree = (tree, formatter) => {
  if (formatter === 'stylish') {
    return stringify(tree, ' ', 4);
  }

  if (formatter === 'plain') {
    return plain(tree);
  }

  if (formatter === 'json') {
    return JSON.stringify(tree);
  }
  return '';
};

export default function genDiffMain(fileName1, fileName2, formatter = 'stylish') {
  const resultObject = buildTree(
    getParsedData(fileName1),
    getParsedData(fileName2),
  );

  return formatTree(resultObject, formatter);
}
