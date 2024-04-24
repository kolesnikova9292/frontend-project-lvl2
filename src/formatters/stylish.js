import _ from 'lodash';
import { nodeType } from '../buildTree.js';

const sign = (type) => {
  if (type === nodeType.added) {
    return '+ ';
  }
  if (type === nodeType.deleted) {
    return '- ';
  }
  return '  ';
};

const stringifyValue = (value, currentDepth, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, currentDepth);
};

const stringify = (tree, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    console.log(currentValue)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }


    const indentSize = depth * spacesCount - 2;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);

    if (_.isPlainObject(currentValue)) {
      //return JSON.stringify(currentValue);
      return stringifyValue(currentValue, depth, replacer, spacesCount);
    }

    console.log(currentValue)
    const lines = currentValue.map(({
      key, value, children, type, oldValue,
    }) => {
      if (!_.isUndefined(value)) {
        if (type === nodeType.changed) {
          return [`${currentIndent}- ${key}: ${iter(oldValue, depth + 1)}`, `${currentIndent}+ ${key}: ${iter(value, depth + 1)}`].join('\n');
        }
        return `${currentIndent}${sign(type)}${key}: ${iter(value, depth + 1)}`;
      }

      if (!_.isUndefined(children)) {
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

export default stringify;
