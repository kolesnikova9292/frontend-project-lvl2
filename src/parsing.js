import lodash from 'lodash';
import addFormating, { endResult, startResult, chainResult } from './formatters/index.js';

const stringifyLittle = (
  obj,
  formatter = 'stylish',
  replacer = ' ',
  spacesCount = 1,
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
            { replacer, spacesCount, step },
            currentValue,
            stringifyLittle(obj[currentValue], formatter, replacer, spacesCount, step + 1),
          ),
        );
      }
      return accumulator;
    },
    startResult(formatter),
  );

  if (formatter === 'stylish' || formatter === 'json') {
    return endResult(formatter, newResult, { replacer, spacesCount, step });
  }
  return null;
};

const parsing = (json1, json2, formatter = 'stylish', replacer = ' ', spacesCount = 1, result = startResult(formatter), step = 1) => {
  const touchedProps = [];

  const keysWithObjRef = Object.keys(json1).map((x) => ({ obj: 'json1', key: x }));

  const keysWithObj2Ref = Object.keys(json2).map((x) => ({ obj: 'json2', key: x }));

  const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

  const newResult = allKeys.reduce((accumulator, x) => {
    if (stringifyLittle(json1[x.key]) === stringifyLittle(json2[x.key])
      && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varValue = stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step);
      const nextChain = addFormating(formatter, { replacer, spacesCount, step }, x.key, varValue);
      return chainResult(formatter, accumulator, nextChain);
    }

    if (json2[x.key] === undefined && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varVal = stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step + 1);
      const nextCh = addFormating(formatter, { replacer, spacesCount, step }, x.key, varVal, '-');
      return chainResult(formatter, accumulator, nextCh);
    }

    if (json1[x.key] === undefined && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varVal = stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step + 1);
      const nextCh = addFormating(formatter, { replacer, spacesCount, step }, x.key, varVal, '+');
      return chainResult(formatter, accumulator, nextCh);
    }

    if (stringifyLittle(json1[x.key]) !== stringifyLittle(json2[x.key])
      && json1[x.key] !== undefined && json2[x.key] !== undefined
      && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      if (typeof json1[x.key] === 'object' && json1[x.key] !== null && typeof json2[x.key] === 'object' && json2[x.key] !== null) {
        const obj1 = json1[x.key];
        const obj2 = json2[x.key];
        const start = startResult(formatter);
        const varVal = parsing(obj1, obj2, formatter, replacer, spacesCount, start, step + 1);
        const nextCh = addFormating(formatter, { replacer, spacesCount, step }, x.key, varVal);
        return chainResult(formatter, accumulator, nextCh);
      }

      const varVal = stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step + 1);
      const stylish = { replacer, spacesCount, step };
      const nextCh = addFormating(formatter, stylish, x.key, varVal, '-', 'old');
      const firstPart = chainResult(formatter, accumulator, nextCh);

      const varVal2 = stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step + 1);
      const nextCh2 = addFormating(formatter, stylish, x.key, varVal2, '+', 'new');

      return chainResult(formatter, firstPart, nextCh2);
    }

    return accumulator;
  }, result);

  return endResult(formatter, newResult, { replacer, spacesCount, step });
};

export default parsing;
