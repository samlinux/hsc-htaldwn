'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');

// A wallet stores a collection of identities
const wallet = new FileSystemWallet('./wallet');

let user = 'user1-mars.morgen.net'
let pkFileName = 'c6a64031dbabfbcce395acef8f041844b76a184ab0219b075064c43412645b83_sk';

async function main() {
  // Main try/catch block
  try {
    // Identity to credentials to be stored in the wallet
    const certPath = '../../ca-mars.morgen.net/users/'+user+'/msp/signcerts/cert.pem';
    const cert = fs.readFileSync(certPath).toString();
    
    const keyPath = '../../ca-mars.morgen.net/users/'+user+'/msp/keystore/'+pkFileName;
    const key = fs.readFileSync(keyPath).toString();

    // Load credentials into wallet
    const identityLabel = user;
    const identity = X509WalletMixin.createIdentity('marsMSP', cert, key);

    await wallet.import(identityLabel, identity);

  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
}

main().then(() => {
  console.log(`User ${user} successfully adding to wallet.`);
}).catch((e) => {
  console.log(e);
});