import lodash from 'lodash';
import addFormating, { endResult, startResult, chainResult } from './formatters/index.js';

/*const buildBranch = (
  obj,
  formatter = 'stylish',
  step = 1,
) => {
  if (typeof obj === 'string' || typeof obj === 'boolean' || typeof obj === 'number') return obj;

  if (obj === null) return 'null';

  if (formatter === 'plain' && typeof obj === 'object') return '[complex value]';

  const newResult = Object.keys(obj || {}).reduce(
    (accumulator, currentValue) => {
      if (formatter === 'stylish' || formatter === 'json') {
        return chainResult(
          formatter,
          accumulator,
          addFormating(
            formatter,
            step,
            currentValue,
            buildBranch(obj[currentValue], formatter, step + 1),
          ),
        );
      }
      return accumulator;
    },
    startResult(formatter),
  );

  if (formatter === 'stylish' || formatter === 'json') {
    return endResult(formatter, newResult, step);
  }
  return null;
};*/
import _ from 'lodash';

const stringify = (value) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }
    const lines = Object
        .entries(currentValue)
        .map(([key, val]) =>{

          const nodeValue = iter(val, depth + 1);
          const resultValue = { key };

          if (!_.isObject(nodeValue)) {
            return { ...resultValue, value: nodeValue }
          }

          return { key: key, children: nodeValue }
          }
        );
    return [ ...lines ]
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
        //console.log(nodeArray1);
        //console.log(nodeArray2);
        if(nodeArray1.length === 0 && nodeArray2.length === 0) {
            return [];
        }
        //if (!_.isArray(nodeArray1) && !_.isArray(nodeArray2) && !_.isObject(nodeArray1.value) && !_.isObject(nodeArray2.value)) {
            /*if(nodeArray1.value && nodeArray1.value && nodeArray1.value === nodeArray2.value) {
                return { value: nodeArray1.value, type: 'unchanged' }
            }*/

            /*else {
                console.log(nodeArray1)
                let valOfFirst = '';
                if(nodeArray1.children && nodeArray1.children.length > 0) {
                    console.log(nodeArray1.children)
                    valOfFirst = nodeArray1.children;
                } else {
                    valOfFirst = nodeArray1.value;
                }
                return { type: 'changed', oldValue: valOfFirst, newValue: nodeArray2.value }
            }*/
        //}

        const keys = _.union(nodeArray1.map(x => x.key), nodeArray2.map(x => x.key));

        //console.log(54545454);
        //console.log(keys);
        //console.log(nodeArray1);
        //console.log(nodeArray2);

        const lines1 = keys.reduce((accumulator, currentValue) => {

            //console.log(222222);
            //console.log(currentValue);
            //console.log(hasObjectThisProp(nodeArray1, currentValue))

            if(hasObjectThisProp(nodeArray1, currentValue) && hasObjectThisProp(nodeArray2, currentValue)
                && _.isEqual(getElementByKey(nodeArray1, currentValue), getElementByKey(nodeArray2, currentValue))) {
                return [ ...accumulator, { ...getElementByKey(nodeArray1, currentValue), type: 'unchanged' } ]
            }

            if(hasObjectThisProp(nodeArray1, currentValue) && !hasObjectThisProp(nodeArray2, currentValue)) {
                //console.log(nodeArray1[currentValue]);
                //console.log(hasObjectThisProp(nodeArray1, currentValue));
                //console.log(getElementByKey(nodeArray1, currentValue));
                return [ ...accumulator, { ...getElementByKey(nodeArray1, currentValue), type: 'deleted' } ]
            }
            if(!hasObjectThisProp(nodeArray1, currentValue) && hasObjectThisProp(nodeArray2, currentValue)) {
                //console.log(nodeArray2[currentValue])
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
                            ['key'], ['asc']), type: 'nested' } ];
                }



                if(_.isNil(getElementByKey(nodeArray1, currentValue)['value']) && !_.isNil(getElementByKey(nodeArray2, currentValue)['value']) &&
                    !_.isNil(getElementByKey(nodeArray1, currentValue)['children']) && _.isNil(getElementByKey(nodeArray2, currentValue)['children'])) {

                    return [ ...accumulator, { ...getElementByKey(nodeArray1, currentValue),
                        children: _.orderBy(iter(getElementByKey(nodeArray1, currentValue)['children'], getElementByKey(nodeArray1, currentValue)['children'], depth + 1),
                            ['key'], ['asc']), type: 'deleted' }, { ...getElementByKey(nodeArray2, currentValue), type: 'added' } ]

                }
            }

            return [ ...accumulator ];

        }, []);

        //console.log(54545454);
        //console.log(lines1);
        return lines1;
    };

    return iter(nodeArray1, nodeArray2, 1);


}

const commonTreeWithAdded = (nodeArraySecond, resultTree) => {

    const iter = (nodeArraySecond, resultTree, depth) => {
        const lines = nodeArraySecond
            .reduce((accumulator, currentValue) =>{
                    if(resultTree.map(x => x.key).indexOf(currentValue.key) <= -1) {
                        //console.log(currentValue)
                        if(currentValue.children && currentValue.children > 0) {
                            return [ ...accumulator, { key: currentValue.key, type: 'added', value: currentValue.children } ];
                        }
                        return [ ...accumulator, { key: currentValue.key, type: 'added', value: currentValue.value } ];
                    }
                    else if(resultTree.map(x => x.key).indexOf(currentValue.key) > -1) {
                        const element = resultTree.find(x => x.key === currentValue.key);
                        //console.log(element);
                        if (element.type === 'nested' && currentValue.type === 'nested') {
                            //console.log(currentValue);
                            if (currentValue.children && currentValue.children.length > 0) {
                                const newChildren = iter(currentValue.children, resultTree.find(x => x.key === currentValue.key).children, depth + 1);
                                var foundIndex = accumulator.findIndex(x => x.key == currentValue.key);
                                accumulator[foundIndex].children = [ ...newChildren ]
                                //console.log(newChildren)
                                return [ ...accumulator ];
                            }
                        } else {
                            return [ ...accumulator ];
                        }
                    }
                    else {
                        return [ ...accumulator ];
                    }
                }, resultTree
            );
        return lines;
    };

    return iter(nodeArraySecond, resultTree, 1);
}

const buildTree = (json1, json2) => {

    const nodeArray1 = stringify(json1);
    const nodeArray2 = stringify(json2);

    const commonTreeResult = commonTree(nodeArray1, nodeArray2);
    console.log(commonTreeResult)
    //console.log(commonTreeResult[1])
    /*const commonTreeResultWithAdded = commonTreeWithAdded(nodeArray2, commonTreeResult).sort(function (a, b) {
        if (a.key < b.key) {
            return -1;
        }
        if (a.key > b.key) {
            return 1;
        }
        return 0;
    });*/

    //console.log(commonTreeResult)

    return _.orderBy(commonTreeResult, ['key'], ['asc']);
};

/*const buildTree = (json1, json2, formatter = 'stylish', result = startResult(formatter), step = 1) => {
  const touchedProps = [];

  const keysWithObjRef = Object.keys(json1).map((x) => ({ obj: 'json1', key: x }));

  const keysWithObj2Ref = Object.keys(json2).map((x) => ({ obj: 'json2', key: x }));

  const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

  const newResult = allKeys.reduce((accumulator, x) => {
    if (buildBranch(json1[x.key]) === buildBranch(json2[x.key])
      && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varValue = buildBranch(json1[x.key], formatter, step);
      const nextChain = addFormating(formatter, step, x.key, varValue);
      return chainResult(formatter, accumulator, nextChain);
    }

    if (json2[x.key] === undefined && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varVal = buildBranch(json1[x.key], formatter, step + 1);
      const nextCh = addFormating(formatter, step, x.key, varVal, '-');
      return chainResult(formatter, accumulator, nextCh);
    }

    if (json1[x.key] === undefined && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varVal = buildBranch(json2[x.key], formatter, step + 1);
      const nextCh = addFormating(formatter, step, x.key, varVal, '+');
      return chainResult(formatter, accumulator, nextCh);
    }

    if (buildBranch(json1[x.key]) !== buildBranch(json2[x.key])
      && json1[x.key] !== undefined && json2[x.key] !== undefined
      && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      if (typeof json1[x.key] === 'object' && json1[x.key] !== null && typeof json2[x.key] === 'object' && json2[x.key] !== null) {
        const obj1 = json1[x.key];
        const obj2 = json2[x.key];
        const start = startResult(formatter);
        const varVal = buildTree(obj1, obj2, formatter, start, step + 1);
        const nextCh = addFormating(formatter, step, x.key, varVal);
        return chainResult(formatter, accumulator, nextCh);
      }

      const varVal = buildBranch(json1[x.key], formatter, step + 1);

      const nextCh = addFormating(formatter, step, x.key, varVal, '-', 'old');
      const firstPart = chainResult(formatter, accumulator, nextCh);

      const varVal2 = buildBranch(json2[x.key], formatter, step + 1);
      const nextCh2 = addFormating(formatter, step, x.key, varVal2, '+', 'new');

      return chainResult(formatter, firstPart, nextCh2);
    }

    return accumulator;
  }, result);

  return endResult(formatter, newResult, step);
};*/

export default buildTree;
