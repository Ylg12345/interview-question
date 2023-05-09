
// a -> b -> c -> d ->f

// interface Node {
//   val: any;
//   next: Node | null;
// }

// 快慢指针

function centerNode(node) {
  let slow = node;
  let fast = node;

  while(fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

const nodeA = { val: 'a', next: null };
const nodeB = { val: 'b', next: null };
const nodeC = { val: 'c', next: null };
const nodeD = { val: 'd', next: null };
const nodeE = { val: 'e', next: null };
const nodeF = { val: 'f', next: null };

nodeA.next = nodeB;
nodeB.next = nodeC;
nodeC.next = nodeD;
nodeD.next = nodeE;
nodeE.next = nodeF;

console.log(centerNode(nodeA).val);