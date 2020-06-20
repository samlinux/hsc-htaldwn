/**
 * cli query 
 */

let config = {
    channel: 'channel1',
    cc:'sacc4',
    userName: 'user1-mars.morgen.net',
    ccpPath: '../marsConnection.yaml'
  }
  
  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  const ccpPath = path.resolve(__dirname, config.ccpPath);
  
  // get the key from the post request
  let myArgs = process.argv.slice(2);
  let queryKey = "msg";
  if(myArgs.length == 1){
    queryKey = myArgs[0];
  }
  
  async function init() {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../identityManagement/wallet');
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
      let result = await contract.evaluateTransaction('history',queryKey);
      
      // Disconnect from the gateway.
      await gateway.disconnect();
    
      // finale object
      let tmpResult = result.toString();
      let r = {
        key: queryKey,
        value: JSON.parse(tmpResult)
      }
      console.log(r);
    } catch(e){
      console.log(e)
    }
  }
  
  init();
  
  