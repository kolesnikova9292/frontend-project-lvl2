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
    console.log(nodeArray1)
    if (nodeArray1.length === 0 && nodeArray2.length === 0) {
      return [];
    }
    const keys = _.union(nodeArray1.map((x) => x.key), nodeArray2.map((x) => x.key));
    console.log(keys)
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
            //{ ...objFromFirst, type: 'deleted' },
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
      return {};
    });
    /*const lines1 = keys.reduce((accumulator, currentValue) => {
      if (_.some(nodeArray1, (item) => item.key === currentValue)
        && _.some(nodeArray2, (item) => item.key === currentValue)
        && _.isEqual(
          _.find(nodeArray1, (item) => item.key === currentValue),
          _.find(nodeArray2, (item) => item.key === currentValue),
        )
      ) {
        return [...accumulator, { ..._.find(nodeArray1, (item) => item.key === currentValue), type: 'unchanged' }];
      }
      if (_.some(nodeArray1, (item) => item.key === currentValue)
        && !_.some(nodeArray2, (item) => item.key === currentValue)) {
        return [...accumulator, { ..._.find(nodeArray1, (item) => item.key === currentValue), type: 'deleted' }];
      }
      if (!_.some(nodeArray1, (item) => item.key === currentValue)
        && _.some(nodeArray2, (item) => item.key === currentValue)) {
        return [...accumulator, { ..._.find(nodeArray2, (item) => item.key === currentValue), type: 'added' }];
      }

      if (_.some(nodeArray1, (item) => item.key === currentValue)
        && _.some(nodeArray2, (item) => item.key === currentValue)
        && !_.isEqual(
          _.find(nodeArray1, (item) => item.key === currentValue),
          _.find(nodeArray2, (item) => item.key === currentValue),
        )) {
        if (!_.isNil(_.find(nodeArray1, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray2, (item) => item.key === currentValue).value)) {
          return [...accumulator,
            {
              ..._.find(nodeArray2, (item) => item.key === currentValue),
              oldValue: _.find(nodeArray1, (item) => item.key === currentValue).value,
              type: 'changed',
            }];
        }

        if (_.isNil(_.find(nodeArray1, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray1, (item) => item.key === currentValue).children)
          && _.isNil(_.find(nodeArray2, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray2, (item) => item.key === currentValue).children)) {
          return [...accumulator, {
            ..._.find(nodeArray1, (item) => item.key === currentValue),
            children: _.orderBy(
              iter(
                _.find(nodeArray1, (item) => item.key === currentValue).children,
                _.find(nodeArray2, (item) => item.key === currentValue).children,
                depth + 1,
              ),
              ['key'],
              ['asc'],
            ),
            type: 'nested',
          }];
        }

        if (_.isNil(_.find(nodeArray1, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray2, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray1, (item) => item.key === currentValue).children)
          && _.isNil(_.find(nodeArray2, (item) => item.key === currentValue).children)) {
          return [...accumulator, {
            ..._.find(nodeArray1, (item) => item.key === currentValue),
            children: _.orderBy(
              iter(
                _.find(nodeArray1, (item) => item.key === currentValue).children,
                _.find(nodeArray1, (item) => item.key === currentValue).children,
                depth + 1,
              ),
              ['key'],
              ['asc'],
            ),
            type: 'deleted',
          },
          { ..._.find(nodeArray2, (item) => item.key === currentValue), type: 'added' },
          ];
        }

        if (_.isNil(_.find(nodeArray2, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray1, (item) => item.key === currentValue).value)
          && !_.isNil(_.find(nodeArray2, (item) => item.key === currentValue).children)
          && _.isNil(_.find(nodeArray1, (item) => item.key === currentValue).children)) {
          return [...accumulator,
            { ..._.find(nodeArray1, (item) => item.key === currentValue), type: 'deleted' },
            {
              ..._.find(nodeArray2, (item) => item.key === currentValue),
              children: _.orderBy(
                iter(
                  _.find(nodeArray2, (item) => item.key === currentValue).children,
                  _.find(nodeArray2, (item) => item.key === currentValue).children,
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
    }, []);*/
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
