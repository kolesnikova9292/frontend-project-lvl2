import lodash from "lodash";
import addFormating, {endResult, startResult} from "./formatters/index.js";


const parsing = (json1, json2, formatter = 'stylish', replacer = ' ', spacesCount = 1,  result = startResult(formatter), step = 1) => {

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

    allKeys.forEach((x) => {

        if(stringifyLittle(json1[x.key]) === stringifyLittle(json2[x.key]) && arrayWithInsertedProps.indexOf(x.key) === -1) {
            arrayWithInsertedProps.push(x.key);
            result = result + addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step));
        }

        if(!json2[x.key] && arrayWithInsertedProps.indexOf(x.key) == -1) {
            arrayWithInsertedProps.push(x.key);
            result = result + addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter,replacer, spacesCount, step+3), '-');
        }

        if(!json1[x.key] && arrayWithInsertedProps.indexOf(x.key) == -1) {
            arrayWithInsertedProps.push(x.key);
            result = result + addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step+3), '+');
        }

        if(stringifyLittle(json1[x.key]) !== stringifyLittle(json2[x.key]) && json1[x.key] && json2[x.key]  && arrayWithInsertedProps.indexOf(x.key) === -1) {
            arrayWithInsertedProps.push(x.key);
            if (typeof json1[x.key] === 'object' && json1[x.key] !== null) {
                result = result + addFormating(formatter, { replacer, spacesCount, step }, x.key, parsing(json1[x.key], json2[x.key], formatter, replacer, spacesCount, '{\n', step+3));
            } else {
                result = result + addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json1[x.key], formatter, replacer, spacesCount, step+1), '+', 'old');

                result = result + addFormating(formatter, { replacer, spacesCount, step }, x.key, stringifyLittle(json2[x.key], formatter, replacer, spacesCount, step+1), '-', 'new');
            }
        }
    });

    return result + endResult( formatter, { replacer: replacer, spacesCount: spacesCount, step: step - 1 } )
};

const stringifyLittle = (obj,
                         formatter = 'stylish',
                         replacer = ' ',
                         spacesCount = 1,
                         step = 1,
                         result = startResult(formatter)
) => {
    if (typeof obj === 'string' || typeof obj === 'boolean' || typeof obj === 'number') return obj.toString();

    if (obj === null) return obj;

    for (let variable in obj) {
        if(formatter === 'stylish') {
            result = result + addFormating(formatter, { replacer, spacesCount, step }, variable, stringifyLittle(obj[variable], formatter, replacer, spacesCount, step+1));
        }
    }

    if(formatter === 'stylish') {
        return result + endResult( formatter, { replacer: replacer, spacesCount: spacesCount, step: step + 1 } );
    } else
        return null;
}

export default parsing;
