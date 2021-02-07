const { GENESIS_DATA, MINE_RATE } = require('../config')
const { keccakHash } = require('./utils/index')

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGTH), 16);
const MAX_NONCE_VALUE = 2 ** 64

class Block {

    constructor({ blockHeader }) {
        this.blockHeader = blockHeader;
    }

    static calculateBlockTargetHash({ lastBlock }) {
        const value = (MAX_HASH_VALUE / lastBlock.blockHeader.difficulty).toString(16);

        if (value.length > HASH_LENGTH) {
            return 'f'.repeat(HASH_LENGTH);
        }

        return '0'.repeat(HASH_LENGTH - value.length) + value;
    }

    static adjustDifficulty({ lastBlock, timestamp }) {
        const { difficulty } = lastBlock.blockHeader;

        if ((timestamp - lastBlock.blockHeader.timestamp) > MINE_RATE) {
            return difficulty - 1;
        }
        if (difficulty < 1) {
            return 1;
        }
        return difficulty + 1
    }

    static mineBlock({ lastBlock, beneficiary }) {
        const target = Block.calculateBlockTargetHash({ lastBlock });
        let timestamp, truncatedBlockHeader, header, nonce, underTargetHash;

        do {
            timestamp = Date.now();
            truncatedBlockHeader = {
                parentHash: keccakHash(lastBlock.blockHeader),
                beneficiary,
                difficulty: Block.adjustDifficulty({ lastBlock, timestamp }),
                number: lastBlock.blockHeader.number + 1,
                timestamp
            };
            header = keccakHash(truncatedBlockHeader);
            nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
            underTargetHash = keccakHash(header, nonce);
        } while (underTargetHash > target)


        return new this({
            blockHeader: {
                ...truncatedBlockHeader,
                nonce,

            }

        });



    }

    static genesis() {
        return new Block(GENESIS_DATA)
    }

    static validateBlock({ lastBlock, block }) {
        return new Promise((resolve, reject) => {
            if (keccakHash(block) === keccakHash(block.genesis())) {
                return resolve();
            }

            if (keccakHash(lastBlock.blockHeader) !== block.blockHeader.parentHash) {

                return reject(new Error("The parent hash must be a hash of the last blcok's headers"));
            }


            if (block.blockHeader.number !== lastBlock.blockHeader.number + 1) {

                return reject(new Error("The block must increment the number by 1"));
            }


            if (Math.abs(lastBlock.blockHeader.difficulty - block.blockHeader.difficulty) > 1) {

                return reject(new Error("The difficulty must only adjust by 1"));
            }

            const target = Block.calculateBlockTargetHash({ lastBlock });
            const { blockHeader } = block;
            const { nonce } = blockHeader;
            const truncatedBlockHeader = {...blockHeader };
            delete truncatedBlockHeader.nonce;
            const header = keccakHash(truncatedBlockHeader);
            const underTargetHash = keccakHash(header + nonce)

            if (underTargetHash > target) {
                return reject(new Error(" The block does not meet the proof of work requirement"))
            }

            return resolve()

        });
    }
}


module.exports = Block;