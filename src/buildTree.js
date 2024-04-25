import _ from 'lodash';

export const nodeType = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested',
};

const commonTree = (nodeArrayFirst, nodeArraySecond) => {
  const keys = _.sortBy(_.union(_.keys(nodeArrayFirst), _.keys(nodeArraySecond)));
  return keys.map((key) => {
    const objFromFirst = nodeArrayFirst[key];
    const objFromSecond = nodeArraySecond[key];

    if (_.isPlainObject(objFromFirst) && _.isPlainObject(objFromSecond)) {
      return {
        key,
        children: commonTree(objFromFirst, objFromSecond),
        type: nodeType.nested,
      };
    }
    if (objFromFirst && objFromSecond && _.isEqual(objFromFirst, objFromSecond)) {
      return { key, value: objFromFirst, type: nodeType.unchanged };
    }
    if (!_.isUndefined(objFromFirst) && _.isUndefined(objFromSecond)) {
      return { key, value: objFromFirst, type: nodeType.deleted };
    }
    if (_.isUndefined(objFromFirst) && !_.isUndefined(objFromSecond)) {
      return { key, value: objFromSecond, type: nodeType.added };
    }
    if (
      !_.isUndefined(objFromFirst)
      && !_.isUndefined(objFromSecond)
      && !_.isEqual(objFromFirst, objFromSecond)
    ) {
      return {
        key, value: objFromSecond, oldValue: objFromFirst, type: nodeType.changed,
      };
    }
    return null;
  });
};

const buildTree = (json1, json2) => {
  const commonTreeResult = commonTree(json1, json2);
  return _.orderBy(commonTreeResult, ['key'], ['asc']);
};

export default buildTree;
