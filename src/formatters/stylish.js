const addStylishFormater = (stylish = { replacer: ' ', spacesCount: 1, step: 1 }, variable, valueOfVariable, addedOrRemovedOrTheSame) =>{

    return `${stylish.replacer.repeat(stylish.step * stylish.spacesCount)}${addedOrRemovedOrTheSame} ${variable ?? ''}${variable ? ': ' : ''}${valueOfVariable ?? ''}${variable ? '\n' : ''}`;

}
export default addStylishFormater;