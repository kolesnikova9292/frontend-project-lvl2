import lodash from 'lodash';
import addFormating, { endResult, startResult, chainResult } from './formatters/index.js';

const stringifyLittle = (
  obj,
  formatter = 'stylish',
  replacer = ' ',
  spacesCount = 1,
  step = 1,
  result = startResult(formatter)
) => {
  if (typeof obj === 'string' || typeof obj === 'boolean' || typeof obj === 'number') return obj;

  if (obj === null) return 'null';

  if (formatter === 'plain' && typeof obj === 'object') return '[complex value]';

  for (const variable in obj) {
    if (formatter === 'stylish' || formatter === 'json') {
      result = chainResult(formatter, result,
        addFormating(formatter, { replacer, spacesCount, step }, variable, stringifyLittle(obj[variable], formatter, replacer, spacesCount, step + 1))
      );
    }
  }

  if (formatter === 'stylish' || formatter === 'json') {
    return endResult(formatter, result,{ replacer, spacesCount, step });
  }
  return null;
};

const parsing = (json1, json2, formatter = 'stylish', replacer = ' ', spacesCount = 1, result = startResult(formatter), step = 1) => {
  const arrayWithInsertedProps = [];

  const keysWithObjRef = Object.keys(json1).map((x) => {
    return { obj: 'json1', key: x };
  });

  const keysWithObj2Ref = Object.keys(json2).map((x) => {
    return { obj: 'json2', key: x };
  });

  const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

  allKeys.forEach((x) => {
    if (stringifyLittle(json1[x.key]) === stringifyLittle(json2[x.key]) && arrayWithInsertedProps.indexOf(x.key) === -1) {
      arrayWithInsertedProps.push(x.key);
      result = chainResult(
        formatter, result, addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step))
      );
    }

    if (json2[x.key] === undefined && arrayWithInsertedProps.indexOf(x.key) == -1) {
      arrayWithInsertedProps.push(x.key);
      result = chainResult(
        formatter, result,
        addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step + 1), '-'),
      );
    }

    if (json1[x.key] === undefined && arrayWithInsertedProps.indexOf(x.key) == -1) {
      arrayWithInsertedProps.push(x.key);
      result = chainResult(
        formatter, result,
        addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step + 1), '+'),
      );
    }

    if (stringifyLittle(json1[x.key]) !== stringifyLittle(json2[x.key]) && json1[x.key] !== undefined && json2[x.key] !== undefined && arrayWithInsertedProps.indexOf(x.key) === -1) {
      arrayWithInsertedProps.push(x.key);
      if (typeof json1[x.key] === 'object' && json1[x.key] !== null && typeof json2[x.key] === 'object' && json2[x.key] !== null) {
        result = chainResult(
          formatter, result,
          addFormating(
            formatter, { replacer, spacesCount, step }, x.key, parsing(json1[x.key], json2[x.key], formatter, replacer, spacesCount, startResult(formatter), step + 1),
          ),
        );
      } else {
        result = chainResult(
          formatter, result,
          addFormating(
            formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step + 1), '-', 'old',
          ),
        );

        result = chainResult(
          formatter, result,
          addFormating(
            formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step + 1), '+', 'new',
          ),
        );
      }
    }
  });

  return endResult(formatter, result, { replacer, spacesCount, step });
};

export default parsing;
