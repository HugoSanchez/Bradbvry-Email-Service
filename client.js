const { PrivateKey, ThreadID, Client} = require('@textile/hub');
const {getFunctionBody} = require('@textile/threads-client');



const client = async () => {
    let identity = await PrivateKey.fromString(process.env.TEXTILE_BV_ID)
    let client = await Client.withKeyInfo({key: process.env.TEXTILE_HUB_KEY})
    await client.getToken(identity)  


    /** 

    let writeValidator = getWriteValidator(identity.toString())

    let threadID = await client.newDB(undefined, 'Test-Global-Thread-BV')
    await client.newCollectionFromObject(threadID, configObject, {
            name: 'public-collections'})
    
    console.log('Global_ ', threadID.toString())

    

    let tId = process.env.GLOBAL_THREAD_ID
    let threadID = ThreadID.fromString(tId)

    let col1 = await client.find(threadID, 'public-collections', {})
    console.log('1: ', col1)

    await client.delete(threadID, 'public-collections', ["01ezaywqrcdzhpw0w1h6xj0zb6"])

    let col2 = await client.find(threadID, 'public-collections', {})
    console.log('2: ', col2)
    
    */
    return client

}

const replaceThisValidator = (writer) => {
    // In order to have a write permission set, 
    // we first need to create this function
    var arr = JSON.parse('replaceThis')
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === writer) return true
        else return false
    }    
}

const getWriteValidator = (identityString) => {
    // Return the write validator function that makes it such
    // that only the owner can read or right into a collection.
    let validatorsArray = JSON.stringify([identityString])
    let writeValidatorString = getFunctionBody(
        replaceThisValidator
    ).replace('replaceThis', validatorsArray)
    // Little hack to make it work.
    return new Function(writeValidatorString)
}

const configObject = {
    _id: '', 
    threadId: '',                        // The thread's ID string.                                   
    name: '',                            // Collection Name 
    description: '',                     // Collection Description
    type: '',                            // Collection type: [open || members-only || private]
    tokenAddress: '',                    // Token address if any
    symmetricKey: '',                    // Symetric AES key if any
    subscriptionType : '',               // [stake || free || invite-only || montly]
    timestamp: 0,                        // Creation day timestamp
    options: '',                         // Any additional info.
    memebers: [''],                      // Members array.  
    preview: '',                         // Boolean - wether or not there's preview entries
    previewEntries: [                    // Array of public entries to preview
        {
            _id: '', 
            name: '',                           // Entry name
            description: '',                    // Entry description
            type: 'file',                       // Entry type file/post
            entry: '',                          // Actual entry
            other: '',                          // Other info
            timestamp: 0,                       // Entry creation date
            contentURI: '',
            metadataURI: '',
            createdBy: ''
        }
    ],                  
    owner: {                             // Owner data.
        did: '',
        identity: '',
        ethAddress: '',
    }, 
    keyOwners: [
        {
            memberId: '',
            memberAddress: '',
            memberPubkey: '',
            collectionKey: ''
        }
    ]
}

module.exports = client;