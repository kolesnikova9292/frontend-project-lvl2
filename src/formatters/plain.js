import _ from 'lodash';
import { NodeType } from '../genDiffMain.js';

const addPlainFormatter = (variable, valueOfVariable, addedOrRemovedOrTheSame, updated) => {
  if (updated === 'old') {
    return `Property '${variable ?? ''}' was updated. From ${typeof valueOfVariable === 'string' && valueOfVariable !== '[complex value]' && valueOfVariable !== 'null' ? `'${valueOfVariable}'` : valueOfVariable}`;
  }

  if (updated === 'new') {
    return ` to ${typeof valueOfVariable === 'string' && valueOfVariable !== '[complex value]' && valueOfVariable !== 'null' ? `'${valueOfVariable}'` : valueOfVariable}\n`;
  }

  if (addedOrRemovedOrTheSame === '-') {
    return `Property '${variable ?? ''}' was removed\n`;
  }

  if (addedOrRemovedOrTheSame === '+') {
    return `Property '${variable ?? ''}' was added with value: ${typeof valueOfVariable === 'string' && valueOfVariable !== '[complex value]' && valueOfVariable !== 'null' ? `'${valueOfVariable}'` : valueOfVariable}\n`;
  }

  if (addedOrRemovedOrTheSame === ' ') {
    if (valueOfVariable.indexOf('Property') > -1) {
      const regex = /Property '/g;
      return valueOfVariable.replace(regex, `Property '${variable}.`);
    }
    return '';
  }

  return `Property '${variable ?? ''}' was added with value: ${valueOfVariable ?? ''}\n`;
};

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
}

const getValueForPlain = (value, children) => {

  if(value === null || value === 'null') return null;

  if (typeof value === 'object' || !value && !_.isNil(children)) {
    return complexValue;
  }

  if (value === 'false' || value === 'true') {
    return value;
  }

  if (typeof value === 'string' && !parseInt(value, 10) && value !== complexValue) {
    return `'${value}'`;
  }

  return String(value);
}

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
        if (itemAlreadyAdded.type === NodeType.deleted && current.type === NodeType.added) {
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: complexValue, type: NodeType.changed, value: current.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
          if (current.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: itemAlreadyAdded.value, type: NodeType.changed, value: complexValue,
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
                ...itemAlreadyAdded, oldValue: complexValue, type: NodeType.changed, value: itemAlreadyAdded.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
          if (itemAlreadyAdded.children?.length > 0) {
            return [
              ...accumulator.slice(0, index),
              {
                ...itemAlreadyAdded, oldValue: complexValue, type: NodeType.changed, value: current.value,
              },
              ...accumulator.slice(index + 1),
            ];
          }
        }
        return [...accumulator];
      }
      return [...accumulator, current];
    }, []);

    /*const lines = currentValueNew
      .reduce((accumulator, current) => {
        const {
          key, value, children, type, oldValue,
        } = current;

        console.log(current);

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
      }, []);*/

    const lines = currentValueNew
      .map((line) => {
        const {
          key, value, children, type, oldValue,
        } = line;

        console.log(key + ' ' + type + ' ' + value + ' ' + children);

        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const newValue = (parseInt(value, 10) || parseInt(value, 10) === 0 || value === 'true' || value === 'false' || value === 'null' || value === '[complex value]') ? value : `'${value}'`;
        const newOldValue = (parseInt(oldValue, 10) || parseInt(oldValue, 10) === 0 || oldValue === 'true' || oldValue === 'false' || oldValue === 'null' || oldValue === '[complex value]') ? oldValue : `'${oldValue}'`;

        /*if (!_.isNil(value)) {
          if (type === 'added' || type === 'deleted' || type === 'changed' || type === 'unchanged') {
            return mapping[type](newKey, newValue, newOldValue);
          }
        }
        if (!_.isNil(children) && type === 'added') {
          return mapping[type](newKey, '[complex value]');
        }
        if (!_.isNil(children) && type === 'deleted') {
          return mapping[type](newKey, '[complex value]');
        }*/
        if (!_.isNil(children) && type !== NodeType.added && type !== NodeType.deleted && type !== NodeType.changed) {
          console.log(555)
          return iter(children, newKey);
        }

        return plainLineForNode(type, newKey, getValueForPlain(value, children), getValueForPlain(oldValue, children))
      });

    return [
      ...lines.filter(Boolean),
    ].join('\n');
  };

  return iter(tree);
};

export { addPlainFormatter as default, plain };
