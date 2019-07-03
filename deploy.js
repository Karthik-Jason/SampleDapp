var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/fe4581d2650846769e514c8182c717f9'));
var address = '0x9fab67C057a15DA704A49384B0Be5572E5Ad1596';
var privateKey = 'FB795A8FC2035A2556DE75B51909DA6B89C9A5DCEADEED6CB1A00E6DB7BE66C3';

var solc = require('solc');
var fs = require('fs');
var contractSrc = fs.readFileSync('./Sample.sol').toString();
var contractCom = solc.compile(contractSrc);

var abi = JSON.parse(contractCom.contracts[':Sample'].interface);
var Sample = new web3.eth.Contract(abi);
var byteCode = contractCom.contracts[':Sample'].bytecode;
web3.eth.accounts.wallet.add('0x' + privateKey);
var deployContractTx = Sample.deploy({data : "0x" + byteCode,arguments:["Sample"]});


deployContractTx.estimateGas().then((estimateGas) => {
    console.log("estimategas",estimateGas);
    web3.eth.getGasPrice().then((gasPrice) => {
        console.log("gasPrice",gasPrice);
        web3.eth.getTransactionCount(address).then((nonce) => {
            console.log("nonce", nonce);
            //Deploy to the network
            deployContractTx.send({
                nonce : nonce,
                from : address,
                gas : estimateGas,
                gasPrice : gasPrice
            }).then(console.log);
        })
    })
})

//console.log(deployContractTx);

