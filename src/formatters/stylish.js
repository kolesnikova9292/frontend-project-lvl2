const stylishStyle = { replacer: ' ', spacesCount: 1 };

const addStylishFormater = (
  stylish = { step: 1 },
  variable = '',
  valueOfVariable = '',
  addedOrRemovedOrTheSame = '',
) => `${stylishStyle.replacer.repeat((stylish.step - 1) * (stylishStyle.spacesCount + 2))}`
  + `${stylishStyle.replacer.repeat(stylish.step * stylishStyle.spacesCount)} ${addedOrRemovedOrTheSame} `
  + `${variable ?? ''}${variable ? ': ' : ''}${valueOfVariable ?? ''}${variable ? '\n' : ''}`;
export { addStylishFormater as default, stylishStyle as stylishStyle };
