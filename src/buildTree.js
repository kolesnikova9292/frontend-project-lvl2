import lodash from 'lodash';
import addFormating, { endResult, startResult, chainResult } from './formatters/index.js';

/*const buildBranch = (
  obj,
  formatter = 'stylish',
  step = 1,
) => {
  if (typeof obj === 'string' || typeof obj === 'boolean' || typeof obj === 'number') return obj;

  if (obj === null) return 'null';

  if (formatter === 'plain' && typeof obj === 'object') return '[complex value]';

  const newResult = Object.keys(obj || {}).reduce(
    (accumulator, currentValue) => {
      if (formatter === 'stylish' || formatter === 'json') {
        return chainResult(
          formatter,
          accumulator,
          addFormating(
            formatter,
            step,
            currentValue,
            buildBranch(obj[currentValue], formatter, step + 1),
          ),
        );
      }
      return accumulator;
    },
    startResult(formatter),
  );

  if (formatter === 'stylish' || formatter === 'json') {
    return endResult(formatter, newResult, step);
  }
  return null;
};*/
import _ from 'lodash';

const stringify = (value) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }
    const lines = Object
        .entries(currentValue)
        .map(([key, val]) =>{

          const nodeValue = iter(val, depth + 1);
          const resultValue = { key };

          if (!_.isObject(nodeValue)) {
            return { ...resultValue, value: nodeValue }
          }

          return { key: key, children: nodeValue }
          }
        );
    return [ ...lines ]
  };

  return iter(value, 1);
};

const commonTree = (nodeArray1, nodeArray2) => {


    const iter = (nodeArray1, nodeArray2, depth) => {
        // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
       /* if (!_.isObject(nodeArray1.value)) {
            return `${nodeArray1.value}`;
        }*/

      //  console.log(_.isArray(nodeArray1))
     //   console.log(nodeArray1)
     //   console.log(nodeArray2)

        if (!_.isArray(nodeArray1) && !_.isArray(nodeArray2) && !_.isObject(nodeArray1.value) && !_.isObject(nodeArray2.value)) {
         //   console.log('---------');
         //   console.log(nodeArray1.value)

            /*if(nodeArray1.children.length > 0 && nodeArray2.children.length > 0) {

            }*/

            if(nodeArray1.value && nodeArray1.value === nodeArray2.value) {
                return { value: nodeArray1.value, type: 'unchanged' }
            } else {
                return { value: nodeArray1.value, type: 'changed', oldValue: nodeArray1.value, newValue: nodeArray2.value }
            }
            //return `${nodeArray1.value}`;
        }

       // console.log(nodeArray1)
      //  console.log(nodeArray2)

        const lines = nodeArray1
            .reduce((accumulator, currentValue, index) =>{

               // console.log(currentValue)

                if(nodeArray2.map(x => x.key).indexOf(currentValue.key) > -1) {

                    if(currentValue.children?.length > 0) {
                        return [ ...accumulator, { key: currentValue.key, type: 'nested',
                            children:  iter(currentValue.children, nodeArray2.find(x => x.key === currentValue.key).children, depth + 1) } ];
                    }

                    //console.log('-------')
                    const index = nodeArray2.map(x => x.key).indexOf(currentValue.key);
                    //console.log(index)
                    const nodeValue = iter(currentValue, nodeArray2[index], depth + 1);
                    //console.log(nodeValue)
                    return [ ...accumulator, { key: currentValue.key, ...nodeValue } ]
                }

                  else if(nodeArray2.map(x => x.key).indexOf(currentValue.key) <= -1) {
                        //console.log('-------')
                        //const index = nodeArray2.map(x => x.key).indexOf(currentValue.key);
                        //console.log(index)
                        //const nodeValue = iter(currentValue, nodeArray2[index], depth + 1);
                        //console.log(nodeValue)
                        return [ ...accumulator, { key: currentValue.key, value: currentValue.value, type: 'deleted' } ]
                    }

                else {
                    return [ ...accumulator ];
                }
            }, []
            );
        return lines;
    };

    return iter(nodeArray1, nodeArray2, 1);


}

const commonTreeWithAdded = (nodeArraySecond, resultTree) => {


    //console.log(nodeArraySecond);
    //console.log(resultTree)


    const iter = (nodeArraySecond, resultTree, depth) => {

        //if (!_.isArray(nodeArraySecond) && !_.isArray(resultTree) && !_.isObject(nodeArraySecond.value) && !_.isObject(resultTree.value)) {
        if (!_.isArray(nodeArraySecond) && !_.isArray(resultTree)) {
            /*if(nodeArray1.value && nodeArray1.value === nodeArray2.value) {
                return { value: nodeArray1.value, type: 'unchanged' }
            } else {
                return { value: nodeArray1.value, type: 'changed', oldValue: nodeArray1.value, newValue: nodeArray2.value }
            }*/
            //return `${nodeArray1.value}`;
            console.log(4444);
            console.log(4444);
        }

        /*if (!_.isArray(nodeArraySecond) && !_.isArray(resultTree) && !_.isObject(nodeArraySecond.value) && !_.isObject(resultTree.value)) {

            if(nodeArraySecond.value && nodeArraySecond.value === resultTree.value) {
                return { value: nodeArraySecond.value, type: 'unchanged' }
            } else {
                return { value: nodeArraySecond.value, type: 'changed', oldValue: nodeArraySecond.value, newValue: resultTree.value }
            }
        }*/

      //  console.log(nodeArraySecond);
      //  console.log(resultTree)


        const lines = nodeArraySecond
            .reduce((accumulator, currentValue, index) =>{
                    if(resultTree.map(x => x.key).indexOf(currentValue.key) <= -1) {

                      //  console.log(8888888);
                     //   console.log(currentValue)
                      //  console.log(accumulator)

                       // console.log(accumulator)
                        return [ ...accumulator, { key: currentValue.key, type: 'added', value: currentValue.value } ];



                    } else if(resultTree.map(x => x.key).indexOf(currentValue.key) > -1) {

                        const element = resultTree.find(x => x.key === currentValue.key);

                       // console.log(element)

                        if(element.type === 'nested') {

                            const index = resultTree.map(x => x.key).indexOf(currentValue.key);

                            if(currentValue.children?.length > 0) {
                                return [ ...accumulator, { key: currentValue.key, type: 'nested',
                                    children:  iter(currentValue.children, resultTree.find(x => x.key === currentValue.key).children, depth + 1) } ];
                            }


                            //вот это под вопросом надо ли вообще
                           // const nodeValue = iter(currentValue, resultTree[index], depth + 1);
                         //   return [ ...accumulator, { key: currentValue.key, ...nodeValue } ]

                            //console.log(resultTree[index].children)
           //                 const nodeValue = iter(currentValue.children, resultTree[index].children, depth + 1);
                            //console.log(nodeValue)
                            //console.log(accumulator)
            //                return [ ...accumulator, ...nodeValue  ]
                           // console.log(accumulator)
                            //return [ ...accumulator, { key: currentValue.key, ...nodeValue } ]
                           // return [ ...accumulator, { key: currentValue.key, type: 'nested',
                           //     children:  iter(currentValue.children, nodeArray2.find(x => x.key === currentValue.key).children, depth + 1) } ];

                        } else {
                          //  console.log(element)
                          //  console.log(accumulator)
                            return [ ...accumulator, { ...element } ]
                        }


                        //console.log(77777777)
                        //console.log(element)

                    }
                    else {
                        return [ ...accumulator ];
                    }
                }, []
            );
        return lines;
    };

    return iter(nodeArraySecond, resultTree, 1);


}

const buildTree = (json1, json2) => {

    const nodeArray1 = stringify(json1);
    const nodeArray2 = stringify(json2);

    //console.log(nodeArray2[0].children)

    const commonTreeResult = commonTree(nodeArray1, nodeArray2);
    //console.log(commonTreeResult);
    //console.log(commonTreeResult[0].children);

    const commonTreeResultWithAdded = commonTreeWithAdded(nodeArray2, commonTreeResult);

    //console.log('------------------------');
   // console.log(nodeArray2);
   // console.log(commonTreeResult);

    //console.log(commonTreeResultWithAdded);
    //console.log(commonTreeResultWithAdded[0].children);

    return commonTreeResultWithAdded;


  //console.log(json1);
  //console.log(stringify(json1));
  //console.log(json2);
  //console.log(stringify(json2));



};

/*const buildTree = (json1, json2, formatter = 'stylish', result = startResult(formatter), step = 1) => {
  const touchedProps = [];

  const keysWithObjRef = Object.keys(json1).map((x) => ({ obj: 'json1', key: x }));

  const keysWithObj2Ref = Object.keys(json2).map((x) => ({ obj: 'json2', key: x }));

  const allKeys = lodash.sortBy([...keysWithObjRef, ...keysWithObj2Ref], (a) => a.key);

  const newResult = allKeys.reduce((accumulator, x) => {
    if (buildBranch(json1[x.key]) === buildBranch(json2[x.key])
      && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varValue = buildBranch(json1[x.key], formatter, step);
      const nextChain = addFormating(formatter, step, x.key, varValue);
      return chainResult(formatter, accumulator, nextChain);
    }

    if (json2[x.key] === undefined && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varVal = buildBranch(json1[x.key], formatter, step + 1);
      const nextCh = addFormating(formatter, step, x.key, varVal, '-');
      return chainResult(formatter, accumulator, nextCh);
    }

    if (json1[x.key] === undefined && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      const varVal = buildBranch(json2[x.key], formatter, step + 1);
      const nextCh = addFormating(formatter, step, x.key, varVal, '+');
      return chainResult(formatter, accumulator, nextCh);
    }

    if (buildBranch(json1[x.key]) !== buildBranch(json2[x.key])
      && json1[x.key] !== undefined && json2[x.key] !== undefined
      && touchedProps.indexOf(x.key) === -1) {
      touchedProps.push(x.key); // eslint-disable-line
      if (typeof json1[x.key] === 'object' && json1[x.key] !== null && typeof json2[x.key] === 'object' && json2[x.key] !== null) {
        const obj1 = json1[x.key];
        const obj2 = json2[x.key];
        const start = startResult(formatter);
        const varVal = buildTree(obj1, obj2, formatter, start, step + 1);
        const nextCh = addFormating(formatter, step, x.key, varVal);
        return chainResult(formatter, accumulator, nextCh);
      }

      const varVal = buildBranch(json1[x.key], formatter, step + 1);

      const nextCh = addFormating(formatter, step, x.key, varVal, '-', 'old');
      const firstPart = chainResult(formatter, accumulator, nextCh);

      const varVal2 = buildBranch(json2[x.key], formatter, step + 1);
      const nextCh2 = addFormating(formatter, step, x.key, varVal2, '+', 'new');

      return chainResult(formatter, firstPart, nextCh2);
    }

    return accumulator;
  }, result);

  return endResult(formatter, newResult, step);
};*/

export default buildTree;
