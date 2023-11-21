const addPlainFormatter = (variable, valueOfVariable, addedOrRemovedOrTheSame, updated) =>{

    if(updated === 'old') {
        return `Property \'${variable ?? ''}\' was updated. From \'${valueOfVariable ?? ''}\'`;
    }

    if(updated === 'new') {
        return ` to \'${valueOfVariable ?? ''}\'\n`;
    }

    if(addedOrRemovedOrTheSame === '-') {
        return `Property \'${variable ?? ''}\' was removed\n`;
    }

    if(addedOrRemovedOrTheSame === '+') {
        return `Property \'${variable ?? ''}\' was added with value \'${valueOfVariable ?? ''}\'\n`;
    }

    if(addedOrRemovedOrTheSame === ' ') {
        return ''
    }

    return `Property \'${variable ?? ''}' was added with value \'${valueOfVariable ?? ''}\'\n`;

}
export default addPlainFormatter;
