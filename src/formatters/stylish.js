import _ from 'lodash';
import { NodeType } from '../genDiffMain.js';

export const stylishStyle = { replacer: ' ', spacesCount: 1 };

const addStylishFormater = (
  step = 1,
  variable = '',
  valueOfVariable = '',
  addedOrRemovedOrTheSame = '',
) => `${stylishStyle.replacer.repeat((step - 1) * (stylishStyle.spacesCount + 2))}`
  + `${stylishStyle.replacer.repeat(step * stylishStyle.spacesCount)} ${addedOrRemovedOrTheSame} `
  + `${variable ?? ''}${variable ? ': ' : ''}${valueOfVariable ?? ''}${variable ? '\n' : ''}`;

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

export { addStylishFormater as default, stringify };
