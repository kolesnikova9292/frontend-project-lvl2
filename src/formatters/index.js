import addStylishFormater from "./stylish.js";
import addPlainFormatter from "./plain.js";

const addFormating = (formatter = 'stylish',
                      stylish = { replacer: ' ', spacesCount: 1, step: 1 },
                      variable,
                      valueOfVariable,
                      addedOrRemovedOrTheSame = ' ',
                      updated = '') => {

    if(formatter === 'stylish') {
        return addStylishFormater(stylish, variable, valueOfVariable, addedOrRemovedOrTheSame);
    }

    if(formatter === 'plain') {
        return addPlainFormatter(variable, valueOfVariable, addedOrRemovedOrTheSame, updated);
    }
}

const startResult = (formatter = 'stylish') => {
    if(formatter === 'stylish') {
        return '{\n';
    }

    if(formatter === 'plain') {
        return '';
    }
}

const endResult = (formatter = 'stylish',
                   stylish = { replacer: ' ', spacesCount: 1, step: 1 }) => {
    if(formatter === 'stylish') {
        return stylish.replacer.repeat(stylish.step * stylish.spacesCount) + '}';
    }

    if(formatter === 'plain') {
        return '';
    }
}

export default addFormating;
export { startResult as startResult, endResult as endResult };
