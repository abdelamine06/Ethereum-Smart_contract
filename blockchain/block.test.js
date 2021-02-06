const Block = require('./block')

describe('Block', () => {
    describe('calculateBlockTargetHash()', () => {
        it('calculate the max hash when the last block difficulty is 1', () => {
            expect(

                Block.calculateBlockTargetHash({ lastBlock: { blockHeader: { difficulty: 1 } } })

            ).toEqual('f'.repeat(64))
        });
        it('calculate a low hash value when the last block difficulty is high', () => {
            expect(

                Block.calculateBlockTargetHash({ lastBlock: { blockHeader: { difficulty: 500 } } }) < '1'

            ).toBe(true)
        });
    });
});