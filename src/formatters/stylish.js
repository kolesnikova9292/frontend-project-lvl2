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

const stringify = (tree, replacer = ' ', spacesCount = 4) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount - 2;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);

    if (_.isPlainObject(currentValue)) {
      return stringifyValue(currentValue, depth, replacer, spacesCount);
    }

    const lines = currentValue.map((node) => {
      if (!_.isUndefined(node?.value)) {
        if (node?.type === nodeType.changed) {
          return [`${currentIndent}- ${node?.key}: ${iter(node?.oldValue, depth + 1)}`, `${currentIndent}+ ${node?.key}: ${iter(node?.value, depth + 1)}`].join('\n');
        }
        return `${currentIndent}${sign(node?.type)}${node?.key}: ${iter(node?.value, depth + 1)}`;
      }

      if (!_.isUndefined(node?.children)) {
        return `${currentIndent}${sign(node?.type)}${node?.key}: ${iter(node?.children, depth + 1)}`;
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
