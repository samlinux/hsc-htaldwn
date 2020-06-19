/**
 * cli invoke set 
 */

'use strict';
let config = {
  channel: 'channel1',
  cc:'sacc3',
  userName: 'user1-mars.morgen.net',
  ccpPath: '../marsConnection.yaml'
}

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const { exit } = require('process');
const ccpPath = path.resolve(__dirname, config.ccpPath);

let myArgs = process.argv.slice(2);
let queryKey = '', queryValue = '';

if(myArgs.length == 2){
  queryKey = myArgs[0];
  queryValue = myArgs[1];
} else{
  console.log("too few parameters ");
  exit(1);
} 

async function init (){
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), '../identityManagement/wallet/');
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
    console.log(result);
  }
  catch(error){
    let result = {result:'Failed to submit transaction: '+error};
    console.log(result);
  }
}

init();

