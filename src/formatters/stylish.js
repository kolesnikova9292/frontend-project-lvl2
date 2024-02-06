export const stylishStyle = { replacer: ' ', spacesCount: 1 };

const addStylishFormater = (
  step = 1,
  variable = '',
  valueOfVariable = '',
  addedOrRemovedOrTheSame = '',
) => `${stylishStyle.replacer.repeat((step - 1) * (stylishStyle.spacesCount + 2))}`
  + `${stylishStyle.replacer.repeat(step * stylishStyle.spacesCount)} ${addedOrRemovedOrTheSame} `
  + `${variable ?? ''}${variable ? ': ' : ''}${valueOfVariable ?? ''}${variable ? '\n' : ''}`;
export default addStylishFormater;
