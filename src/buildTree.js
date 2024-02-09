import lodash from 'lodash';
import addFormating, { endResult, startResult, chainResult } from './formatters/index.js';

const buildBranch = (
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
};

const buildTree = (json1, json2, formatter = 'stylish', result = startResult(formatter), step = 1) => {
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
};

export default buildTree;
