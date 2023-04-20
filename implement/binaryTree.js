class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right = new TreeNode(3);
root.right.right = new TreeNode(6);

console.log(root);
console.log(levelOrder(root));
console.log(preorderTraversal(root));

// 根节点开始，并沿着树的每一层逐个访问节点。在遍历每一层时，我们按照从左到右的顺序访问节点。这意味着我们会先访问左子树，然后再访问右子树。
// BFS 算法使用队列来实现。我们将根节点入队，然后从队列中弹出第一个节点，并访问它的左右子节点，然后将这些子节点入队。我们一直重复这个过程，直到队列为空。
// 时间复杂度和空间复杂度都为 O(n)

function levelOrder(root) {
  if(!root) return [];

  const queue = [root];
  const result = [];
  while(queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for(let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);

      if (node.left) queue.push(node.left); 
      if (node.right) queue.push(node.right); 
    }
    result.push(currentLevel);
  }

  return result;
}

function preorderTraversal(root) {
  if(!root) return [];

  const result = [];
  const stack = [root];
  while(stack.length) {
    const node = stack.pop();
    result.push(node.value);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
}

