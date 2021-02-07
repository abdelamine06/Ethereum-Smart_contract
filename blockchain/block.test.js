const Block = require('./block');
const { keccakHash } = require('./utils');

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
    describe('mineBlock()', () => {
        let lastBlock, minedBlock;

        beforeEach(() => {
            lastBlock = Block.genesis();
            minedBlock = Block.mineBlock({ lastBlock, beneficiary: 'beneficiary' })

        });
        it('mines a block', () => {
            expect(minedBlock).toBeInstanceOf(Block);
        });

        it('mines a block that meets the proof of work requirement', () => {
            const target = Block.calculateBlockTargetHash({ lastBlock });
            const { blockHeader } = minedBlock;
            const { nonce } = blockHeader;
            const truncatedBlockHeader = {...blockHeader };
            delete truncatedBlockHeader.nonce;
            const header = keccakHash(truncatedBlockHeader);
            const underTargetHash = keccakHash(header + nonce)

            expect(underTargetHash < target).toBe(true)
        });
    });


    describe('adjustDifficulty()', () => {
        it('keeps the difficulty above 0', () => {
            expect(Block.adjustDifficulty({
                lastBlock: { blockHeader: { difficulty: 0 } },
                timestamp: Date.now()
            })).toEqual(1)
        });
        it('increases the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                lastBlock: { blockHeader: { difficulty: 5, timestamp: 1000 } },
                timestamp: 3000
            })).toEqual(6)
        });

        it('decreases the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                lastBlock: { blockHeader: { difficulty: 5, timestamp: 1000 } },
                timestamp: 20000
            })).toEqual(4)
        });
    });
});