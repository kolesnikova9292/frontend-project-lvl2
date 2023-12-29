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
            {replacer, spacesCount, step},
            currentValue,
            stringifyLittle(obj[currentValue], formatter, replacer, spacesCount, step + 1),
          ),
        );
      }
      return accumulator;
    },
    startResult(formatter)
  );

  if (formatter === 'stylish' || formatter === 'json') {
    return endResult(formatter, newResult, { replacer, spacesCount, step });
  }
  return null;
};

const parsing = (json1, json2, formatter = 'stylish', replacer = ' ', spacesCount = 1, result = startResult(formatter), step = 1) => {
  let arrayWithInsertedProps = [];

  const keysWithObjRef = Object.keys(json1).map((x) => ({ obj: 'json1', key: x }));

  const keysWithObj2Ref = Object.keys(json2).map((x) => ({ obj: 'json2', key: x }));

  const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

  const newResult = allKeys.reduce((accumulator, x) => {
    if (stringifyLittle(json1[x.key]) === stringifyLittle(json2[x.key]) && arrayWithInsertedProps.indexOf(x.key) === -1) {
      arrayWithInsertedProps = [ ...arrayWithInsertedProps, x.key];
      return chainResult(formatter, accumulator, addFormating(
        formatter, { replacer, spacesCount, step }, x.key,
        stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step)));
    }

    if (json2[x.key] === undefined && arrayWithInsertedProps.indexOf(x.key) == -1) {
      arrayWithInsertedProps.push(x.key);
      return chainResult(
        formatter, accumulator,
        addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step + 1), '-'),
      );
    }

    if (json1[x.key] === undefined && arrayWithInsertedProps.indexOf(x.key) == -1) {
      arrayWithInsertedProps.push(x.key);
      return chainResult(
        formatter, accumulator,
        addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step + 1), '+'),
      );
    }

    if (stringifyLittle(json1[x.key]) !== stringifyLittle(json2[x.key]) && json1[x.key] !== undefined && json2[x.key] !== undefined && arrayWithInsertedProps.indexOf(x.key) === -1) {
      arrayWithInsertedProps.push(x.key);
      if (typeof json1[x.key] === 'object' && json1[x.key] !== null && typeof json2[x.key] === 'object' && json2[x.key] !== null) {
        return chainResult(
          formatter, accumulator,
          addFormating(
            formatter, { replacer, spacesCount, step }, x.key, parsing(json1[x.key], json2[x.key], formatter, replacer, spacesCount, startResult(formatter), step + 1),
          ),
        );
      } else {
        const firstPart = chainResult(
          formatter, accumulator,
          addFormating(
            formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step + 1), '-', 'old',
          ),
        );

        return chainResult(
          formatter, firstPart,
          addFormating(
            formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step + 1), '+', 'new',
          ),
        );
      }
    }

    return accumulator;
  }, result);

  return endResult(formatter, newResult, { replacer, spacesCount, step });
};

export default parsing;
