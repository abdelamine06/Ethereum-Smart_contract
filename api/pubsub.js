const PubNub = require('pubnub')
const credential = {
    publishKey: 'pub-c-5c4095c2-53ed-416b-98bf-8c4fd8fa875f',
    subscribeKey: 'sub-c-37b61598-6c1a-11eb-8dab-f61112b09b07',
    secretKey: 'sec-c-ZjI2ZmQ5NWItNzE3My00ODk1LWExN2QtZDQxZmM2ZTk0Mzk3'
}

const CHANNEL_MAP = {
    TEST: 'TEST',
    BLOCK: 'BLOCK'
}

class PubSub {
    constructor({ blockchain }) {
        this.pubnub = new PubNub(credential)
        this.subscribeToChannels();
        this.blockchain = blockchain;
        this.listen()
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: Object.values(CHANNEL_MAP),
        });
    }
    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    listen() {
        this.pubnub.addListener({
            message: messageObject => {
                const { channel, message } = messageObject;
                const paresedMessage = JSON.parse(message);

                console.log('Message received. Channel :', channel);

                switch (channel) {
                    case CHANNEL_MAP.BLOCK:
                        console.log('block message', message);
                        this.blockchain.addBlock({ block: paresedMessage })
                            .then(() => console.log('New Block accepted'))
                            .catch(error => console.error('New Block rejected: ', error.message))
                        break;
                    default:
                        return;
                }
            }
        });
    }

    broadcastBlock(block) {
        this.publish({
            channel: CHANNEL_MAP.BLOCK,
            message: JSON.stringify(block)
        });
    }
}

module.exports = PubSub