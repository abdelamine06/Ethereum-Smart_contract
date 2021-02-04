const STOP = 'STOP';
const ADD = 'ADD';
const PUSH = 'PUSH';
const SUB = 'SUB';
const MUL = 'MUL';
const DIV = 'DIV';
const LT = 'LT';
const GT = 'GT';
const EQ = 'EQ';
const AND = 'AND';
const OR = 'OR';


class Interpreter {
    constructor() {

        this.state = {
            programCounter: 0,
            stack: [],
            code: []
        };
    }
    runCode(code) {
        this.state.code = code;
        while (this.state.programCounter < this.state.code.length) {
            const opCode = this.state.code[this.state.programCounter];
            try {
                switch (opCode) {
                    case STOP:
                        throw new Error("Execution is complete");
                    case PUSH:
                        this.state.programCounter++;
                        const value = this.state.code[this.state.programCounter];
                        this.state.stack.push(value);
                        break;
                    case ADD:
                    case SUB:
                    case MUL:
                    case DIV:
                    case LT:
                    case GT:
                    case EQ:
                    case AND:
                    case OR:
                        const a = this.state.stack.pop();
                        const b = this.state.stack.pop();

                        let result;
                        if (opCode === ADD) result = a + b;
                        if (opCode === SUB) result = a - b;
                        if (opCode === MUL) result = a * b;
                        if (opCode === DIV) result = a / b;
                        if (opCode === LT) result = a < b ? 1 : 0;
                        if (opCode === GT) result = a > b ? 1 : 0;
                        if (opCode === EQ) result = a === b ? 1 : 0;
                        if (opCode === AND) result = a && b;
                        if (opCode === OR) result = a || b;

                        this.state.stack.push(result);
                        break;
                    default:
                        break;

                }

            } catch (error) {
                return this.state.stack[this.state.stack.length - 1];
            }
            this.state.programCounter++;

        }
    }
}
let code = [PUSH, 2, PUSH, 3, ADD, STOP];
let result = new Interpreter().runCode(code)
console.log('Result of 2 ADD 3 :', result);

code = [PUSH, 2, PUSH, 3, SUB, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 3 SUB 2 :', result);

code = [PUSH, 2, PUSH, 3, MUL, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 2 MUL 3 :', result);

code = [PUSH, 2, PUSH, 3, DIV, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 3 DIV 2 :', result);

code = [PUSH, 2, PUSH, 3, LT, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 3 Less then 2 :', result);

code = [PUSH, 2, PUSH, 3, GT, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 3 Greater then 2 :', result);

code = [PUSH, 2, PUSH, 2, EQ, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 2 === 2 :', result);

code = [PUSH, 1, PUSH, 0, AND, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 0 AND 1 :', result);

code = [PUSH, 1, PUSH, 0, OR, STOP];
result = new Interpreter().runCode(code)
console.log('Result of 0 OR 1 :', result);