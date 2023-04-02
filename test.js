class Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class Stack {
    constructor() {
        this.top = new Node(null, null);
        this.size = 0;
    }

    push(val) {
        let newNode = new Node(val, this.top);
        this.top = newNode;
        this.size++;
    }

    pop() {
        let oldNode = this.top;
        this.top = oldNode.next;
        this.size--;
    }

    print() {
        let current = this.top;
        while (current.next !== null) {
            console.log(current.value);
            current = current.next;
        }
    }
}

const stk = new Stack();
stk.push("Hello");

stk.print();