const Block = require('./block')
class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ block }) {
        this.chain.push(block)
    }
}

module.exports = Blockchain