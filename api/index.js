const express = require('express')
const Blockchain = require('../blockchain')
const Block = require('../blockchain/block')
const PubSUb = require('./pubsub')

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSUb({ blockchain });

app.get('/blockchain', (req, res, next) => {
    const { chain } = blockchain;

    res.json({ chain });
});

app.get('/blockchain/mine', (req, res, next) => {

    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
    const block = Block.mineBlock({ lastBlock })
        // block.blockHeader.parentHash = 'foo'

    blockchain.addBlock({ block })
        .then(() => {
            pubsub.broadcastBlock(block);
            res.json({ block })
        })
        .catch(error => next(error))
});

app.use((err, req, res, next) => {
    console.error('Internal server error :', err)
    res.status(500).json({ message: err.message })

})


const PORT = process.argv.includes('--peer') ? Math.floor(2000 + Math.random() * 1000) : 3001;
app.listen(PORT, () => console.log(`Listening at port : ${PORT}`));