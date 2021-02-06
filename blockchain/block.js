const { GENESIS_DATA } = require('../config')
class Block {
    constructor({ blockHeader }) {
        this.blockHeader = blockHeader;
    }
    static mineBlock({ lastBlock }) {

    }

    static genesis() {
        return new Block(GENESIS_DATA)
    }
}

module.exports = Block;