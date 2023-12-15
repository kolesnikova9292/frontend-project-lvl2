import addStylishFormater from "./stylish.js";
import addPlainFormatter from "./plain.js";
import addJsonFormater from "./json.js";

const chainResult = (formatter = 'stylish',
                     result,
                     nextChain) => {

    if(formatter === 'stylish') {
        return result + nextChain;
    }

    if(formatter === 'plain') {
        return result + nextChain;
    }

    if(formatter === 'json') {
       // const qwe = `\"${nextChain.variable}\"`;
       // const qwe = `"${nextChain.variable}"`;
        //console.log(qwe)
        //console.log(nextChain.variable)
        /*result[ qwe ] = nextChain.value;
        console.log(result)
        return result;*/
       // console.log(result)
      //  return result + qwe + ":" + nextChain.value + ', ';
      //  result[qwe.replace('\'','1')] = nextChain.value;
      //  console.log(result)
       // return result;
      //
        //  return { ...result, qwe: nextChain.value }


        /*if(typeof nextChain.value === 'object') {
            return result + '"' + nextChain.variable + '"' + ': ' + nextChain.value + ', ';
        } else {
            return result + '"' + nextChain.variable + '"' + ': ' + '"' + nextChain.value + '"' + ', ';
        }*/

        return result + '"' + nextChain.variable + '"' + ': ' + nextChain.value + ', ';


    }
}

const addFormating = (formatter = 'stylish',
                      stylish = { replacer: ' ', spacesCount: 1, step: 1 },
                      variable,
                      valueOfVariable,
                      addedOrRemovedOrTheSame = ' ',
                      updated = '') => {

    if(formatter === 'stylish') {
        //console.log('variabe ' + variable)
        return addStylishFormater(stylish, variable, valueOfVariable, addedOrRemovedOrTheSame);
    }

    if(formatter === 'plain') {
        return addPlainFormatter(variable, valueOfVariable, addedOrRemovedOrTheSame, updated);
    }

    if(formatter === 'json') {
        return addJsonFormater(variable, valueOfVariable, addedOrRemovedOrTheSame);
    }
}

const startResult = (formatter = 'stylish') => {
    if(formatter === 'stylish') {
        return '{\n';
    }

    if(formatter === 'plain') {
        return '';
    }

    if(formatter === 'json') {
      //  return {};
        return '{'
    }
}

const endResult = (formatter = 'stylish',
                   result,
                   stylish = { replacer: ' ', spacesCount: 1, step: 1 }) => {
    if(formatter === 'stylish') {
        //return result + stylish.replacer.repeat((stylish.step-1) * stylish.spacesCount) + '}';
       // return result + stylish.replacer.repeat((stylish.step-1) * (stylish.spacesCount)) + '}';


      //  ${stylish.replacer.repeat((stylish.step-1) * (stylish.spacesCount + 2))}${stylish.replacer.repeat(stylish.step * stylish.spacesCount)} ${addedOrRemovedOrTheSame}
        return result + stylish.replacer.repeat(4 * stylish.step - 4) + '}';
    }

    if(formatter === 'plain') {
        return result;
    }

    if(formatter === 'json') {
        return result.slice(0, -2) + ' }';
    }
}

export default addFormating;
export { startResult as startResult, endResult as endResult, chainResult as chainResult };
