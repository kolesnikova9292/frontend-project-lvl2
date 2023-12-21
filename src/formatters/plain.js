const addPlainFormatter = (variable, valueOfVariable, addedOrRemovedOrTheSame, updated) => {
  if(updated === 'old') {
    return `Property \'${variable ?? ''}\' was updated. From ${typeof valueOfVariable === 'string' && valueOfVariable !== '[complex value]'&& valueOfVariable !== 'null'  ? `'${valueOfVariable}'` : valueOfVariable}`;
  }

  if(updated === 'new') {
    return ` to ${typeof valueOfVariable === 'string' && valueOfVariable !== '[complex value]' && valueOfVariable !== 'null'  ? `'${valueOfVariable}'` : valueOfVariable}\n`;
  }

  if(addedOrRemovedOrTheSame === '-') {
    return `Property \'${variable ?? ''}\' was removed\n`;
  }

  if(addedOrRemovedOrTheSame === '+') {
    return `Property \'${variable ?? ''}\' was added with value: ${typeof valueOfVariable === 'string' && valueOfVariable !== '[complex value]'&& valueOfVariable !== 'null'  ? `'${valueOfVariable}'` : valueOfVariable}\n`;
  }

  if(addedOrRemovedOrTheSame === ' ') {
    if(valueOfVariable.indexOf('Property') > -1) {
      const indexOfQuote = valueOfVariable.indexOf('\'');
      const regex = /Property \'/g;
      valueOfVariable = valueOfVariable.replace(regex, `Property \'${variable}.`);
      return valueOfVariable;
    }
    return '';
  }

  return `Property \'${variable ?? ''}' was added with value: ${valueOfVariable ?? ''}\n`;
};
export default addPlainFormatter;
