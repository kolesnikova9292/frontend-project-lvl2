import addStylishFormater, {stylishStyle} from './stylish.js';
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
  stylish = { step: 1 },
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
  return null;
};

const endResult = (formatter = 'stylish', result = '', stylish = { step: 1 }) => {
  if (formatter === 'stylish') {
    return `${result}${stylishStyle.replacer.repeat(4 * stylish.step - 4)}}`;
  }

  if (formatter === 'plain') {
    return result;
  }

  if (formatter === 'json') {
    return `${result.slice(0, -2)} }`;
  }
  return null;
};

export default addFormating;
export { startResult, endResult, chainResult };
