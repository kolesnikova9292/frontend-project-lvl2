const addJsonFormater = (variable, valueOfVariable, addedOrRemovedOrTheSame) => {
  if (valueOfVariable.toString().substring(0, 1) === '{') {
    return { variable: addedOrRemovedOrTheSame + variable, value: valueOfVariable };
  }
  return { variable: addedOrRemovedOrTheSame + variable, value: `"${valueOfVariable}"` };
};

export default addJsonFormater;
