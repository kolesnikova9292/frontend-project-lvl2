import _ from 'lodash';
import { nodeType } from '../buildTree.js';

const complexValue = '[complex value]';

const plainLineForNode = (type, key, value, oldValue) => {
  if (type === nodeType.deleted) {
    return `Property '${key}' was removed`;
  }

  if (type === nodeType.added) {
    return `Property '${key}' was added with value: ${value}`;
  }

  if (type === nodeType.changed) {
    return `Property '${key}' was updated. From ${oldValue} to ${value}`;
  }

  if (type === nodeType.unchanged) {
    return null;
  }

  if (type === nodeType.nested) {
    return null;
  }
  return null;
};

const getValueForPlain = (value, children) => {
  if (value === null || value === 'null') return null;

  if ((!value && !_.isNil(children)) || typeof value === 'object') {
    return complexValue;
  }

  if (value === 'false' || value === 'true') {
    return value;
  }

  if (typeof value === 'string' && !parseInt(value, 10) && value !== complexValue && value !== '0') {
    return `'${value}'`;
  }

  return String(value);
};

const keyPath = (parentKey, key) => (parentKey ? `${parentKey}.${key}` : key);

const plain = (tree) => {
  const iter = (currentValue, parentKey) => {
    const currentValueNew = currentValue.reduce((accumulator, current) => {
      if (_.some(accumulator, (item) => item.key === current.key)) {
        const index = accumulator.findIndex(({ key }) => key === current.key);
        const itemAlreadyAdded = accumulator[index];
        if (itemAlreadyAdded.type === nodeType.deleted && current.type === nodeType.added) {
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded,
                oldValue: complexValue,
                type: nodeType.changed,
                value: current.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
          if (current.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded,
                oldValue: itemAlreadyAdded.value,
                type: nodeType.changed,
                value: complexValue,
              },
              ...accumulator.slice(index + 1),
            ];
          }
        }

        if (current.type === nodeType.deleted && itemAlreadyAdded.type === nodeType.added) {
          if (current.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded,
                oldValue: complexValue,
                type: nodeType.changed,
                value: itemAlreadyAdded.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded,
                oldValue: complexValue,
                type: nodeType.changed,
                value: current.value,
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
      .map((line) => {
        const {
          key, value, children, type, oldValue,
        } = line;

        if (!_.isNil(children)
          && type !== nodeType.added
          && type !== nodeType.deleted
          && type !== nodeType.changed) {
          return iter(children, keyPath(parentKey, key));
        }

        return plainLineForNode(
          type,
          keyPath(parentKey, key),
          getValueForPlain(value, children),
          getValueForPlain(oldValue, children),
        );
      });

    return [
      ...lines.filter(Boolean),
    ].join('\n');
  };

  return iter(tree);
};

export default plain;
