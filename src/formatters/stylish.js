import _ from 'lodash';
import { NodeType } from '../buildTree.js';

const sign = (type) => {
  if (type === NodeType.added) {
    return '+ ';
  }
  if (type === NodeType.deleted) {
    return '- ';
  }
  return '  ';
};

const stringify = (tree, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount - 2;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);
    const lines = currentValue.map(({
      key, value, children, type, oldValue,
    }) => {
      if (!_.isNil(value)) {
        if (type === NodeType.changed) {
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

export default stringify;
