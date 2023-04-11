// 输出结果
// [
//   {
//       "id": 1,
//       "name": "部门1",
//       "pid": 0,
//       "children": [
//           {
//               "id": 2,
//               "name": "部门2",
//               "pid": 1,
//               "children": []
//           },
//           {
//               "id": 3,
//               "name": "部门3",
//               "pid": 1,
//               "children": [
//                   // 结果 ,,,
//               ]
//           }
//       ]
//   }
// ]

let arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
];

/**
 * 
 * @typedef {Object} Information 
 * @property {number} id
 * @property {string} name
 * @property {number} pid
 */

/**
 * 
 * @param {Array<Information>} array
 */

// 使用 Map
function arrToTree(array) {
  const tree = [];
  const map = new Map();

  for(const node of array) {
   map.set(node.id, { ...node, children: [] });
  }

  for(const node of array) {
    if(node.pid === 0) {
      tree.push(map.get(node.id));
    } else {
      map.get(node.pid).children.push(map.get(node.id));
    }
  }

  return tree;
}

console.log(arrToTree(arr))

// 使用递归

function getChildren(array, result, pid) {
  for(const item of array) {
    if(item.pid === pid) {
      const newItem = { ...item, children: [] };
      result.push(newItem);
      getChildren(array, newItem.children, item.id);
    }
  }
}

/**
 * 
 * @param {Array<Information>} array
 */

function arrToTree1(array) {
  const pid = 0;
  const result = [];

  getChildren(array, result, pid);
  return result;
}

console.log(arrToTree1(arr));
