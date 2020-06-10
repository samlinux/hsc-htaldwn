/**
 * cli invoke set 
 */

'use strict';
let config = {
  channel: 'channel1',
  cc:'sacc',
  userName: 'user1-mars.morgen.net',
  ccpPath: 'marsConnection.yaml'
}

  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  const ccpPath = path.resolve(__dirname, config.ccpPath);

  let queryKey = 'msg3';
  let queryValue = 'test-'+ new Date().toISOString();

  async function init (){
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: config.userName, discovery: { enabled: true, asLocalhost: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(config.channel);

    // Get the contract from the network.
    const contract = network.getContract(config.cc);

    try {
      // Submit the specified transaction.
      await contract.submitTransaction('set', queryKey, queryValue);

      // Disconnect from the gateway.
      await gateway.disconnect();

      let result = {result:'Transaction has been successfully submitted. Key: '+queryKey};
      return result;
    }
    catch(error){
      let result = {result:'Failed to submit transaction: '+error};
      return result;
    }
  }
  
  init();

