import lodash from "lodash";


const parsing = (json1, json2, replacer = ' ', spacesCount = 1,  result = '{\n', step = 1) => {

    const arrayWithInsertedProps = []

    const keysWithObjRef = Object.keys(json1).map((x) => {
        const result = { obj: 'json1', key: x };
        return result;
    });

    const keysWithObj2Ref = Object.keys(json2).map((x) => {
        const result = { obj: 'json2', key: x };
        return result;
    });

    const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);
    //const allKeys = [...keysWithObjRef, ...keysWithObj2Ref];

    allKeys.forEach((x) => {

        if(stringifyLittle(json1[x.key]) === stringifyLittle(json2[x.key]) && arrayWithInsertedProps.indexOf(x.key) === -1) {
            arrayWithInsertedProps.push(x.key);
            result = result + replacer.repeat(step * spacesCount) + '  ' + x.key + ': ' + stringifyLittle(json1[x.key], replacer, spacesCount, step) + '\n';
        }

        if(!json2[x.key] && arrayWithInsertedProps.indexOf(x.key) == -1) {
            arrayWithInsertedProps.push(x.key);
            result = result + replacer.repeat((step) * spacesCount) + '- ' + x.key + ': ' + stringifyLittle(json1[x.key], replacer, spacesCount, step+3) + '\n';
        }

        if(!json1[x.key] && arrayWithInsertedProps.indexOf(x.key) == -1) {
            arrayWithInsertedProps.push(x.key);
            result = result + replacer.repeat(step * spacesCount) + '+ ' + x.key + ': ' + stringifyLittle(json2[x.key], replacer, spacesCount, step+3) + '\n';
        }

        if(stringifyLittle(json1[x.key]) !== stringifyLittle(json2[x.key]) && json1[x.key] && json2[x.key]  && arrayWithInsertedProps.indexOf(x.key) === -1) {
            arrayWithInsertedProps.push(x.key);
            if (typeof json1[x.key] === 'object' && json1[x.key] !== null) {
                result = result + replacer.repeat(step * spacesCount) + '  ' + x.key + ': ';
                result = result + parsing(json1[x.key], json2[x.key], replacer, spacesCount, '{\n', step+3) + '\n';
            } else {
                result = result + replacer.repeat((step) * spacesCount) + '+ ' + x.key + ': ';
                result = result + stringifyLittle(json1[x.key], replacer, spacesCount, step+1) + '\n';

                result = result + replacer.repeat((step) * spacesCount) + '- ' + x.key + ': ';
                result = result + stringifyLittle(json2[x.key], replacer, spacesCount, step+1) + '\n';
            }
        }
    });

    return result + replacer.repeat((step - 1) * spacesCount) + '}'
};

const stringifyLittle = (obj,
                         replacer = ' ',
                         spacesCount = 1,
                         step = 1,
                         firstSign = '',
                         result = firstSign + '{\n'
                         //result = firstSign + replacer.repeat((step - 1) * spacesCount) + '{\n'
) => {
    if (typeof obj === 'string' || typeof obj === 'boolean' || typeof obj === 'number') return obj.toString();

    if (obj === null) return obj;

    for (let variable in obj) {
        result = result + replacer.repeat(step * spacesCount) + variable + ': ';
        if(typeof obj[variable] === 'object' && obj[variable] !== null) {
            // result = result + '{\n';
            // step = step + 8;
        }
        result = result + stringifyLittle(obj[variable], replacer, spacesCount, step+1) + '\n';
    }
    return result + replacer.repeat((step - 1) * spacesCount) + '}'
}

export default parsing;
