import _ from 'lodash';
import { NodeType } from '../genDiffMain.js';

const complexValue = '[complex value]';

const plainLineForNode = (type, key, value, oldValue) => {
  if (type === NodeType.deleted) {
    return `Property '${key}' was removed`;
  }

  if (type === NodeType.added) {
    return `Property '${key}' was added with value: ${value}`;
  }

  if (type === NodeType.changed) {
    return `Property '${key}' was updated. From ${oldValue} to ${value}`;
  }

  if (type === NodeType.unchanged) {
    return null;
  }

  if (type === NodeType.nested) {
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
        if (itemAlreadyAdded.type === NodeType.deleted && current.type === NodeType.added) {
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded,
                oldValue: complexValue,
                type: NodeType.changed,
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
                type: NodeType.changed,
                value: complexValue,
              },
              ...accumulator.slice(index + 1),
            ];
          }
        }

        if (current.type === NodeType.deleted && itemAlreadyAdded.type === NodeType.added) {
          if (current.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded,
                oldValue: complexValue,
                type: NodeType.changed,
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
                type: NodeType.changed,
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
          && type !== NodeType.added
          && type !== NodeType.deleted
          && type !== NodeType.changed) {
          return iter(children, keyPath(parentKey, key));
        }

        return plainLineForNode(
          type,
          keyPath(parentKey, key),
          getValueForPlain(value, children),
          getValueForPlain(oldValue, children)
        )
      });

    return [
      ...lines.filter(Boolean),
    ].join('\n');
  };

  return iter(tree);
};

export default plain;
