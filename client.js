const { PrivateKey, Client} = require('@textile/hub');

const client = async () => {
    let identity = await PrivateKey.fromString(process.env.TEXTILE_BV_ID)
    let client = await Client.withKeyInfo({key: process.env.TEXTILE_HUB_KEY})
    await client.getToken(identity)  
    return client
}

module.exports = client;