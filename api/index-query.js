/**
 * Hyperledger Fabric REST API
 * @rbole 
 */

'use strict';
module.exports = async function (req, config) {
  
  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  const ccpPath = path.resolve(__dirname, config.ccpPath);

  // get the key from the post request
  let queryKey = req.params.key;

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), config.walletPath);
  const wallet = new FileSystemWallet(walletPath);

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, { 
    wallet, 
    identity: config.userName, 
    discovery: { enabled: true, asLocalhost: true } });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(config.channel);

  // Get the contract from the network.
  const contract = network.getContract(config.cc);

  // Evaluate the specified transaction.
  try {
    let result = await contract.evaluateTransaction('query',queryKey);
    
    // Disconnect from the gateway.
    await gateway.disconnect();
  
    // finale object
    let r = {
      key:queryKey,
      value:result.toString()
    };
    return r;
  } catch(err){
    //console.log('Failed to evaluate transaction:', err)
    let r = {result:'Failed to evaluate transaction: '+err};
    return r; 
  }
}