const Interpreter = require('./main');
const { expect } = require('@jest/globals');
const {
    STOP,
    ADD,
    PUSH,
    SUB,
    MUL,
    DIV,
    LT,
    GT,
    EQ,
    AND,
    OR,
    JUMP,
    JUMPI
} = Interpreter.OPCODE_MAP;


describe('Interpreter', () => {
    describe('runCode', () => {
        describe('and the code includes ADD', () => {
            it('adds two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, ADD, STOP])
                ).toEqual(5);
            });
        });

        describe('and the code includes SUB', () => {
            it('subtracts one value from another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, SUB, STOP])
                ).toEqual(1);
            });
        });

        describe('and the code includes MUL', () => {
            it('product tow values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, MUL, STOP])
                ).toEqual(6);
            });
        });

        describe('and the code includes DIV', () => {
            it('Dived value form another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, DIV, STOP])
                ).toEqual(1.5);
            });
        });

        describe('and the code includes LT', () => {
            it('Checks if one value is less than another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, LT, STOP])
                ).toEqual(0);
            });
        });

        describe('and the code includes GT', () => {
            it('Checks if one value is Grater than another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, GT, STOP])
                ).toEqual(1);
            });
        });

        describe('and the code includes EQ', () => {
            it('Checks if one value is EQUAL than another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, EQ, STOP])
                ).toEqual(0);
            });
        });

        describe('and the code includes AND', () => {
            it('ANDS tow conditions', () => {
                expect(
                    new Interpreter().runCode([PUSH, 1, PUSH, 0, AND, STOP])
                ).toEqual(0);
            });
        });

        describe('and the code includes OR', () => {
            it('ORS tow conditions', () => {
                expect(
                    new Interpreter().runCode([PUSH, 1, PUSH, 0, OR, STOP])
                ).toEqual(1);
            });
        });

        describe('and the code includes JUMP', () => {
            it('JUMP TO the destination', () => {
                expect(
                    new Interpreter().runCode(

                        [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'JUMP successful', STOP]

                    )
                ).toEqual('JUMP successful');
            });
        });


        describe('and the code includes JUMPI', () => {
            it('JUMPI TO the destination', () => {
                expect(
                    new Interpreter().runCode(

                        [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'JUMPI successful', STOP]

                    )
                ).toEqual('JUMPI successful');
            });
        });


        describe('and the code includes an invalid JUMP destination', () => {
            it('throws an error', () => {

                expect(
                    () => new Interpreter().runCode(

                        [PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, 'JUMP successful', STOP]

                    )

                ).toThrow('Invalid destination: 99');

            });
        });

        describe('and the code includes an invalid PUSH destination', () => {
            it('throws an error', () => {

                expect(
                    () => new Interpreter().runCode(

                        [PUSH, 0, PUSH]

                    )

                ).toThrow("The 'PUSH' instruction cannot be last");

            });
        });

        describe('and the code includes an invalid INFINITE LOOP destination', () => {
            it('throws an error', () => {

                expect(
                    () => new Interpreter().runCode(

                        [PUSH, 0, JUMP, STOP]

                    )

                ).toThrow("Check for an infinit loop Execution limit of 1000 exceeded");

            });
        });


    });
});