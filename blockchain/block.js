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
}


module.exports = Block;