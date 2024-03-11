import _ from 'lodash';

const stringify = (value) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => {
        const nodeValue = iter(val, depth + 1);
        const resultValue = { key };

        if (!_.isObject(nodeValue)) {
          return { ...resultValue, value: nodeValue }
        };

        return { key: key, children: nodeValue };
        }
      );
    return [ ...lines ];
  };

  return iter(value, 1);
};

export const hasObjectThisProp = (object, prop) => {
  if(object.map(x => x.key).indexOf(prop) <= -1) {
    return false;
  }
  if(object.map(x => x.key).indexOf(prop) > -1) {
    return true;
  }
}

const getElementByKey = (object, prop) => {
  const index = object.map(x => x.key).indexOf(prop);
  return object[index];
}

const commonTree = (nodeArray1, nodeArray2) => {
  const iter = (nodeArray1, nodeArray2, depth) => {
    if(nodeArray1.length === 0 && nodeArray2.length === 0) {
      return [];
    }
    const keys = _.union(nodeArray1.map(x => x.key), nodeArray2.map(x => x.key));
    const lines1 = keys.reduce((accumulator, currentValue) => {
      if(hasObjectThisProp(nodeArray1, currentValue) && hasObjectThisProp(nodeArray2, currentValue)
        && _.isEqual(getElementByKey(nodeArray1, currentValue), getElementByKey(nodeArray2, currentValue))) {
        return [ ...accumulator, { ...getElementByKey(nodeArray1, currentValue), type: 'unchanged' } ];
      }
      if(hasObjectThisProp(nodeArray1, currentValue) && !hasObjectThisProp(nodeArray2, currentValue)) {
        return [ ...accumulator, { ...getElementByKey(nodeArray1, currentValue), type: 'deleted' } ]
      }
      if(!hasObjectThisProp(nodeArray1, currentValue) && hasObjectThisProp(nodeArray2, currentValue)) {
        return [ ...accumulator, { ...getElementByKey(nodeArray2, currentValue), type: 'added' } ]
      }

      if(hasObjectThisProp(nodeArray1, currentValue) && hasObjectThisProp(nodeArray2, currentValue)
        && !_.isEqual(getElementByKey(nodeArray1, currentValue), getElementByKey(nodeArray2, currentValue))) {
        if(!_.isNil(getElementByKey(nodeArray1, currentValue)['value']) && !_.isNil(getElementByKey(nodeArray2, currentValue)['value'])) {
          return [ ...accumulator, { ...getElementByKey(nodeArray2, currentValue), oldValue: getElementByKey(nodeArray1, currentValue)['value'], type: 'changed' } ];
        }

        if(_.isNil(getElementByKey(nodeArray1, currentValue)['value']) && !_.isNil(getElementByKey(nodeArray1, currentValue)['children']) &&
          _.isNil(getElementByKey(nodeArray2, currentValue)['value']) && !_.isNil(getElementByKey(nodeArray2, currentValue)['children'])) {
          return [ ...accumulator, { ...getElementByKey(nodeArray1, currentValue),
            children: _.orderBy(iter(getElementByKey(nodeArray1, currentValue)['children'], getElementByKey(nodeArray2, currentValue)['children'], depth + 1),
              ['key'], ['asc']
            ),
            type: 'nested'
          }];
        }

        if (_.isNil(getElementByKey(nodeArray1, currentValue).value) && !_.isNil(getElementByKey(nodeArray2, currentValue).value)
          && !_.isNil(getElementByKey(nodeArray1, currentValue).children) && _.isNil(getElementByKey(nodeArray2, currentValue).children)) {
          return [...accumulator, {
            ...getElementByKey(nodeArray1, currentValue),
            children: _.orderBy(
              iter(
              getElementByKey(nodeArray1, currentValue).children,
              getElementByKey(nodeArray1, currentValue).children,
              depth + 1,
            ),
            ['key'],
            ['asc'],
            ),
            type: 'deleted',
          },
          { ...getElementByKey(nodeArray2, currentValue), type: 'added' },
          ];
        }

        if (_.isNil(getElementByKey(nodeArray2, currentValue).value)
          && !_.isNil(getElementByKey(nodeArray1, currentValue).value)
          && !_.isNil(getElementByKey(nodeArray2, currentValue).children)
          && _.isNil(getElementByKey(nodeArray1, currentValue).children)) {
          return [...accumulator,
            { ...getElementByKey(nodeArray1, currentValue), type: 'deleted' },
            {
              ...getElementByKey(nodeArray2, currentValue),
              children: _.orderBy(
                iter(
                  getElementByKey(nodeArray2, currentValue).children,
                  getElementByKey(nodeArray2, currentValue).children,
                  depth + 1,
                ),
                ['key'],
                ['asc'],
              ),
              type: 'added',
            }];
        }
      }
      return [...accumulator];
    }, []);
    return lines1;
  };

  return iter(nodeArray1, nodeArray2, 1);
};

const buildTree = (json1, json2) => {
  const nodeArray1 = stringify(json1);
  const nodeArray2 = stringify(json2);
  const commonTreeResult = commonTree(nodeArray1, nodeArray2);
  return _.orderBy(commonTreeResult, ['key'], ['asc']);
};

export default buildTree;
