import stringify from './stylish.js';
import plain from './plain.js';

const formatTree = (tree, formatter) => {
  switch (formatter) {
    case 'stylish':
      return stringify(tree, ' ', 4);
    case 'plain':
      return plain(tree);
    case 'json':
      return JSON.stringify(tree);
    default:
      return '';
  }
};

export default formatTree;
export { plain, stringify };
