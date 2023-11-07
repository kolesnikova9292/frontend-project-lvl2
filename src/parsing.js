import lodash from "lodash";

const parsing = (json1, json2) => {

    const keysWithObjRef = Object.keys(json1).map((x) => {
        const result = { obj: 'json1', key: x };
        return result;
    });

    const keysWithObj2Ref = Object.keys(json2).map((x) => {
        const result = { obj: 'json2', key: x };
        return result;
    });

    const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

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
                currentSign = '=';
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
