const stylishStyle = { replacer: ' ', spacesCount: 1 };

const addStylishFormater = (
  stylish = { spacesCount: 1, step: 1 },
  variable = '',
  valueOfVariable = '',
  addedOrRemovedOrTheSame = '',
) => `${stylishStyle.replacer.repeat((stylish.step - 1) * (stylish.spacesCount + 2))}`
  + `${stylishStyle.replacer.repeat(stylish.step * stylish.spacesCount)} ${addedOrRemovedOrTheSame} `
  + `${variable ?? ''}${variable ? ': ' : ''}${valueOfVariable ?? ''}${variable ? '\n' : ''}`;
export { addStylishFormater as default, stylishStyle as stylishStyle };
