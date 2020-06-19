/**
 * cli query - get all keys
 */

let config = {
  channel: 'channel1',
  cc:'sacc3',
  userName: 'user1-mars.morgen.net',
  ccpPath: '../marsConnection.yaml'
}

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, config.ccpPath);

async function init() {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), '../identityManagement/wallet');
  const wallet = new FileSystemWallet(walletPath);

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, { 
    wallet, 
    identity: config.userName, 
    discovery: { enabled: true, asLocalhost: false } });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(config.channel);

  // Get the contract from the network.
  const contract = network.getContract(config.cc);

  // Evaluate the specified transaction.
  try {
    let result = await contract.evaluateTransaction('all');
    
    // Disconnect from the gateway.
    await gateway.disconnect();
  
    console.log(result.toString());
  } catch(e){
    console.log(e)
  }
}

init();

