import addStylishFormater, { stylishStyle } from './stylish.js';
import addPlainFormatter from './plain.js';
import addJsonFormater from './json.js';

const addFormating = (
  formatter = 'stylish',
  step = 1,
  variable = '',
  valueOfVariable = '',
  addedOrRemovedOrTheSame = ' ',
  updated = '',
) => {
  if (formatter === 'stylish') {
    return addStylishFormater(step, variable, valueOfVariable, addedOrRemovedOrTheSame);
  }

  if (formatter === 'plain') {
    return addPlainFormatter(variable, valueOfVariable, addedOrRemovedOrTheSame, updated);
  }

  if (formatter === 'json') {
    return addJsonFormater(variable, valueOfVariable, addedOrRemovedOrTheSame);
  }
  return null;
};

export default addFormating;
