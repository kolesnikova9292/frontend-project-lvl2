const addJsonFormater = (variable, valueOfVariable, addedOrRemovedOrTheSame) =>{
    return { variable: (addedOrRemovedOrTheSame + variable).toString(), value: valueOfVariable };
}

export default addJsonFormater;
