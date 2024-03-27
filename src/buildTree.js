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
          return { ...resultValue, value: nodeValue };
        }

        return { key, children: nodeValue };
      });
    return [...lines];
  };

  return iter(value, 1);
};

const commonTree = (nodeArrayFirst, nodeArraySecond) => {
  const iter = (nodeArray1, nodeArray2, depth) => {
    if (nodeArray1.length === 0 && nodeArray2.length === 0) {
      return [];
    }
    const keys = _.union(nodeArray1.map((x) => x.key), nodeArray2.map((x) => x.key));
    const lines1 = keys.flatMap((currentValue) => {
      const objFromFirst = _.find(nodeArray1, (item) => item.key === currentValue);
      const objFromSecond = _.find(nodeArray2, (item) => item.key === currentValue);
      if (objFromFirst && objFromSecond && _.isEqual(objFromFirst, objFromSecond)) {
        return { ...objFromFirst, type: 'unchanged' };
      }
      if (objFromFirst && !objFromSecond) {
        return { ...objFromFirst, type: 'deleted' };
      }
      if (!objFromFirst && objFromSecond) {
        return { ...objFromSecond, type: 'added' };
      }

      if (objFromFirst && objFromSecond && !_.isEqual(objFromFirst, objFromSecond)) {
        if (!_.isNil(objFromFirst.value) && !_.isNil(objFromSecond.value)) {
          return { ...objFromSecond, oldValue: objFromFirst.value, type: 'changed' };
        }

        if (_.isNil(objFromFirst.value) && !_.isNil(objFromFirst.children)
          && _.isNil(objFromSecond.value) && !_.isNil(objFromSecond.children)) {
          return {
            ...objFromFirst,
            children: _.orderBy(
              iter(objFromFirst.children, objFromSecond.children, depth + 1),
              ['key'],
              ['asc'],
            ),
            type: 'nested',
          };
        }

        if (_.isNil(objFromFirst.value) && !_.isNil(objFromSecond.value)
          && !_.isNil(objFromFirst.children) && _.isNil(objFromSecond.children)) {
          return [{
            ...objFromFirst,
            children: _.orderBy(
              iter(objFromFirst.children, objFromFirst.children, depth + 1),
              ['key'],
              ['asc'],
            ),
            type: 'deleted',
          },
          { ...objFromSecond, type: 'added' }];
        }

        if (_.isNil(objFromSecond.value) && !_.isNil(objFromFirst.value)
          && !_.isNil(objFromSecond.children) && _.isNil(objFromFirst.children)) {
          return [
            { ...objFromFirst, type: 'deleted' },
            {
              ...objFromSecond,
              children: _.orderBy(
                iter(objFromSecond.children, objFromSecond.children, depth + 1),
                ['key'],
                ['asc'],
              ),
              type: 'added',
            }];
        }
      }
      return [];
    });
    return lines1;
  };

  return iter(nodeArrayFirst, nodeArraySecond, 1);
};

const buildTree = (json1, json2) => {
  const nodeArray1 = stringify(json1);
  const nodeArray2 = stringify(json2);
  const commonTreeResult = commonTree(nodeArray1, nodeArray2);
  return _.orderBy(commonTreeResult, ['key'], ['asc']);
};

export default buildTree;
