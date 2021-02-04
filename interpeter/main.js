const STOP = 'STOP';
const ADD = 'ADD';
const PUSH = 'PUSH';
const SUB = 'SUB';
const MUL = 'MUL';
const DIV = 'DIV';

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
                        const a = this.state.stack.pop();
                        const b = this.state.stack.pop();

                        let result;
                        if (opCode === ADD) result = a + b
                        if (opCode === SUB) result = a - b
                        if (opCode === MUL) result = a * b
                        if (opCode === DIV) result = a / b

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