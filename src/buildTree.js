import _ from 'lodash';

export const nodeType = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested',
};

/*const stringify = (value) => {
  const iter = (currentValue, depth) => {
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
};*/

/*const commonTree = (nodeArrayFirst, nodeArraySecond) => {
  const iter = (nodeArray1, nodeArray2, depth) => {
    if (nodeArray1.length === 0 && nodeArray2.length === 0) {
      return [];
    }
    const keys = _.union(nodeArray1.map((x) => x.key), nodeArray2.map((x) => x.key));
    const lines1 = keys.flatMap((currentValue) => {
      const objFromFirst = _.find(nodeArray1, (item) => item.key === currentValue);
      const objFromSecond = _.find(nodeArray2, (item) => item.key === currentValue);
      if (objFromFirst && objFromSecond && _.isEqual(objFromFirst, objFromSecond)) {
        return { ...objFromFirst, type: nodeType.unchanged };
      }
      if (objFromFirst && !objFromSecond) {
        return { ...objFromFirst, type: nodeType.deleted };
      }
      if (!objFromFirst && objFromSecond) {
        return { ...objFromSecond, type: nodeType.added };
      }

      if (objFromFirst && objFromSecond && !_.isEqual(objFromFirst, objFromSecond)) {
        if (!_.isNil(objFromFirst.value) && !_.isNil(objFromSecond.value)) {
          return { ...objFromSecond, oldValue: objFromFirst.value, type: nodeType.changed };
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
            type: nodeType.nested,
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
            type: nodeType.deleted,
          },
          { ...objFromSecond, type: nodeType.added }];
        }

        if (_.isNil(objFromSecond.value) && !_.isNil(objFromFirst.value)
          && !_.isNil(objFromSecond.children) && _.isNil(objFromFirst.children)) {
          return [
            { ...objFromFirst, type: nodeType.deleted },
            {
              ...objFromSecond,
              children: _.orderBy(
                iter(objFromSecond.children, objFromSecond.children, depth + 1),
                ['key'],
                ['asc'],
              ),
              type: nodeType.added,
            }];
        }
      }
      return [];
    });
    return lines1;
  };

  return iter(nodeArrayFirst, nodeArraySecond, 1);
};*/

const commonTree = (nodeArrayFirst, nodeArraySecond) => {
  const keys = _.sortBy(_.union(_.keys(nodeArrayFirst), _.keys(nodeArraySecond)));
  const result = [];
  for (const key of keys) {
    const objFromFirst = nodeArrayFirst[key];
    const objFromSecond = nodeArraySecond[key];

    //вот это условие нужно переделывать добавлять ответвления если в обоих случаях объект, если только в одном, только в другом
    if (_.isPlainObject(objFromFirst) && _.isPlainObject(objFromSecond)) {
      result.push({ key,
        children: commonTree(objFromFirst, objFromSecond),
        type: nodeType.nested });
    } /*else if (_.isPlainObject(objFromFirst) && !_.isPlainObject(objFromSecond) && !_.isUndefined(objFromSecond)) {
      console.log(key)
      console.log(objFromFirst)
      console.log(objFromSecond)
      result.push({ key,
        children: commonTree(objFromFirst, objFromSecond),
        type: nodeType.deleted });
    } else if (!_.isPlainObject(objFromFirst) && _.isPlainObject(objFromSecond)) {
      console.log(key)
      console.log(objFromFirst)
      console.log(objFromSecond)
      result.push({ key,
        children: commonTree(objFromFirst, objFromSecond),
        type: nodeType.nested });
    }*/

    /*else if (!_.isPlainObject(objFromFirst) && _.isUndefined(objFromFirst) && _.isPlainObject(objFromSecond)) {
      console.log(key)
      console.log(objFromFirst)
      console.log(objFromSecond)
      result.push({ key,
        children: commonTree(objFromFirst, objFromSecond),
        type: nodeType.added });
    }*/

    else if (objFromFirst && objFromSecond && _.isEqual(objFromFirst, objFromSecond)) {
      result.push({ key, value: objFromFirst, type: nodeType.unchanged });
    }
    else if (!_.isUndefined(objFromFirst) && _.isUndefined(objFromSecond)) {
      result.push({ key, value: objFromFirst, type: nodeType.deleted });
    }
    else if (_.isUndefined(objFromFirst) && !_.isUndefined(objFromSecond)) {
      result.push({ key, value: objFromSecond, type: nodeType.added });
    }

    else if (!_.isUndefined(objFromFirst) && !_.isUndefined(objFromSecond) && !_.isEqual(objFromFirst, objFromSecond)) {
      console.log(88888888);
      console.log(objFromFirst);
      console.log(objFromSecond);
      result.push({ key, value: objFromSecond, oldValue: objFromFirst, type: nodeType.changed });
    }
  }
  console.log(result[0]);
  return result;
};

const buildTree = (json1, json2) => {
  //const nodeArray1 = stringify(json1);
  //const nodeArray2 = stringify(json2);
  const commonTreeResult = commonTree(json1, json2);
  return _.orderBy(commonTreeResult, ['key'], ['asc']);
};

export default buildTree;
