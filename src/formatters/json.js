const addJsonFormater = (variable, valueOfVariable, addedOrRemovedOrTheSame) =>{
   /* console.log(valueOfVariable)
    console.log(typeof valueOfVariable)
    if(typeof valueOfVariable === 'object') {
        return { variable: addedOrRemovedOrTheSame + variable, value: valueOfVariable };
    } else {
        return { variable: addedOrRemovedOrTheSame + variable, value: '"' + valueOfVariable + '"' };
    }*/

   // console.log(valueOfVariable)

    if(valueOfVariable.toString().substring(0,1) === '{') {
        return { variable: addedOrRemovedOrTheSame + variable, value: valueOfVariable };
    } else {
        return { variable: addedOrRemovedOrTheSame + variable, value: '"' + valueOfVariable + '"' };
    }

}

export default addJsonFormater;
