import _ from 'lodash';

export const nodeType = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested',
};

const stringify = (value) => {
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
};

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
    }

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
  //const commonTreeResult = commonTree(nodeArray1, nodeArray2);
  const commonTreeResult = commonTree(json1, json2);
  return _.orderBy(commonTreeResult, ['key'], ['asc']);
};

export default buildTree;
