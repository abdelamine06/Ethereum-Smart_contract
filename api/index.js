const express = require('express')
const Blockchain = require('../blockchain')
const Block = require('../blockchain/block')
const PubSUb = require('./pubsub')
const request = require('request')


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

const peer = process.argv.includes('--peer')
const PORT = peer ? Math.floor(2000 + Math.random() * 1000) : 3002;

if (peer) {
    // request
    request('http://localhost:3002/blockchain', (error, response, body) => {
        const { chain } = JSON.parse(body);
        blockchain.replaceChain({ chain })
            .then(() => console.log("Synchronized blockchain with the root node"))
            .catch(error => console.error("Synchronized error: ", error.message))
    });
}
app.listen(PORT, () => console.log(`Listening at port : ${PORT}`));