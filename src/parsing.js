import lodash from "lodash";

const parsing = (obj, obj2, replacer = ' ', spacesCount = 1,  result = '{\n', step = 0) => {

    if (typeof obj === 'string' || typeof obj === 'boolean' || typeof obj === 'number') {
        return obj.toString()
    }

    if (obj === null) {
        return obj
    }

    let currentStep = step++;

    for (let variable in obj) {
        result = result + replacer.repeat(step * spacesCount) + variable + ': ';

        if(typeof obj[variable] === 'object' && obj[variable] !== null) {
            result = result + '{\n';
            currentStep = currentStep + 1;
        }

        result = result + parsing(obj[variable], obj2[variable], replacer, spacesCount,  '' , currentStep) + '\n';
    }

    return result + replacer.repeat((step - 1)* spacesCount) + '}'
}

const parsing1 = (json1, json2) => {

    const keysWithObjRef = Object.keys(json1).map((x) => {
        const result = { obj: 'json1', key: x };
        return result;
    });

    console.log(keysWithObjRef)

    const keysWithObj2Ref = Object.keys(json2).map((x) => {
        const result = { obj: 'json2', key: x };
        return result;
    });

    console.log(keysWithObj2Ref)

    const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

    console.log(allKeys)

    const obj = {};

    allKeys.forEach((x) => {
        let currentSign = ' ';
        if (Object.prototype.hasOwnProperty.call(json1, x.key)
            && !Object.prototype.hasOwnProperty.call(json2, x.key)) {
            currentSign = '-';
        }
        if (!Object.prototype.hasOwnProperty.call(json1, x.key)
            && Object.prototype.hasOwnProperty.call(json2, x.key)) {
            currentSign = '+';
        }
        if (Object.prototype.hasOwnProperty.call(json1, x.key)
            && Object.prototype.hasOwnProperty.call(json2, x.key)
            && json1[x.key] !== json2[x.key]) {
            if (x.obj === 'json1') {
                currentSign = '-';
            } else {
                currentSign = '+';
            }
        }
        const field = `${currentSign} ${x.key}`;
        if (x.obj === 'json1') {
            obj[field] = json1[x.key];
        } else {
            obj[field] = json2[x.key];
        }
    });

    return obj;

};

export default parsing;
