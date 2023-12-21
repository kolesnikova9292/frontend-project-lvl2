import addStylishFormater from './stylish.js';
import addPlainFormatter from './plain.js';
import addJsonFormater from './json.js';

const chainResult = (formatter = 'stylish', result = '', nextChain = '') => {
  if (formatter === 'stylish') {
    return result + nextChain;
  }

  if (formatter === 'plain') {
    return result + nextChain;
  }

  if (formatter === 'json') {
    return `${result}"${nextChain.variable}": ${nextChain.value}, `;
  }
  return null;
};

const addFormating = (
  formatter = 'stylish',
  stylish = { replacer: ' ', spacesCount: 1, step: 1 },
  variable = '',
  valueOfVariable = '',
  addedOrRemovedOrTheSame = ' ',
  updated = '',
) => {
  if (formatter === 'stylish') {
    return addStylishFormater(stylish, variable, valueOfVariable, addedOrRemovedOrTheSame);
  }

  if (formatter === 'plain') {
    return addPlainFormatter(variable, valueOfVariable, addedOrRemovedOrTheSame, updated);
  }

  if (formatter === 'json') {
    return addJsonFormater(variable, valueOfVariable, addedOrRemovedOrTheSame);
  }
  return null;
};

const startResult = (formatter = 'stylish') => {
  if (formatter === 'stylish') {
    return '{\n';
  }

  if (formatter === 'plain') {
    return '';
  }

  if (formatter === 'json') {
    return '{';
  }
};

const endResult = (formatter = 'stylish', result = '', stylish = { replacer: ' ', spacesCount: 1, step: 1 }) => {
  if (formatter === 'stylish') {
    return `${result}${stylish.replacer.repeat(4 * stylish.step - 4)}}`;
  }

  if (formatter === 'plain') {
    return result;
  }

  if (formatter === 'json') {
    return `${result.slice(0, -2)} }`;
  }
};

export default addFormating;
export { startResult, endResult, chainResult };
