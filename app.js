const Web3 = require("web3");
const EthereumTx = require("@ethereumjs/tx").Transaction;
const Common = require("@ethereumjs/common").default;
const { Chain, CustomChain, Hardfork } = require("@ethereumjs/common");

let web3 = null;
let fareContract = null;
let rideContract = null;
let common = null;
let c = null;
const fareContractABI = require("./contracts/Fare.json");
const rideContractAddress = "0x15dE3658Ed2e79CF0Fe26f44108392C869D4Df34";
const fareContractAddress = "0x55Bb152CFb9413f3AfD7a64459A40080729156A1";
const rideContractABI = require("./contracts/Ride.json");
const initializeWeb3Ropsten = async () => {
  try {
    const web3Provider = new Web3.providers.HttpProvider(
      "https://ropsten.infura.io/v3/3ce13c38765f4bb8abee8e56184e12f5"
    );

    web3 = new Web3(web3Provider);
    let block = await web3.eth.getBlockNumber();
    console.log(block);
    c = new Common({ chain: Chain.Ropsten }, []);
    // common = Common.custom(Chain.Ropsten, {
    //   baseChain: 5,
    // });
  } catch (error) {}
};

const initializeWeb3 = async () => {
  try {
    //"https://polygon-mumbai.infura.io/v3/3ce13c38765f4bb8abee8e56184e12f5"
    //"https://rpc-mumbai.maticvigil.com"
    const NODE_URL =
      "https://polygon-mumbai.infura.io/v3/3ce13c38765f4bb8abee8e56184e12f5";
    const web3Provider = new Web3.providers.HttpProvider(NODE_URL);
    // web3 = new Web3('https://rpc-mumbai.matic.today');
    web3 = new Web3(web3Provider);
    // web3.eth.defaultAcount = "0xFB62886F274aDBa10797B1B67810A47F8Ecb632A";
    // console.log(web3.eth);
    // await web3.currentProvider.enable();
    let block = await web3.eth.getBlockNumber();
    console.log(block);
    c = new Common({ chain: Chain.Goerli }, []);
    common = Common.custom(CustomChain.PolygonMumbai, {
      baseChain: 5,
    });
    // console.log({ common });
  } catch (error) {
    console.log(error);
    throw new BlockchainError();
  }
};

const initializeContracts = async () => {
  try {
    //const json = JSON.parse(fareContract);
    fareContract = new web3.eth.Contract(fareContractABI, fareContractAddress);
    rideContract = new web3.eth.Contract(rideContractABI, rideContractAddress);

    const balance = await web3.eth.getBalance(rideContractAddress);
    console.log({ balance });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addNewUser = async () => {
  try {
    const newUser = await web3.eth.accounts.create();
    const details = await web3.eth.accounts.wallet.add({
      privateKey: newUser.privateKey,
      address: newUser.address,
    });
    console.log(newUser);
  } catch (error) {
    throw error;
  }
};

const callFunction = async () => {
  try {
    // {
    //   "key": "0x928cA224036be702A70fCce106fa57862F825912",
    //   "value": "0xa56a30710319f142252b8fecfa036733aac415fbdc6b6e14fa44dfea837e6e1f"
    // }
    let userKeypair = {
      address: "0x3A91A79e11CA724A7ec7ca85E121C1a8Ab820493",
      privateKey:
        "0xa56a30710319f142252b8fecfa036733aac415fbdc6b6e14fa44dfea837e6e1f",
    };

    const txCount = await getTxCount(userKeypair.address);
    // To estimate Gas
    const estimateGasPrice = await rideContract.methods
      .requestRide(10000, 20, "BLR", "medium", 200, [
        "0x17b0AD33868FBEd9bd8a305371bfF48E5060f7dF",
      ])
      .estimateGas({ from: userKeypair.address });

    console.log({
      estimateGasPrice: web3.utils.toWei(`${estimateGasPrice}`, "gwei"),
      sendGas: web3.utils.toWei("10", "gwei"),
    });

    // const data = await encodeData(rideContract, "requestRide", [
    //   10000,
    //   20,
    //   "blr",
    //   "medium",
    //   200,
    //   ["0xA47ca80294EDDbe0CbA8c5B3Ce76205C8180ed07"],
    // ]);

    //    const tx = await getTx(txCount, data, userKeypair, estimateGas);

    // const txHash = await web3.eth.sendSignedTransaction(tx);
    // console.log({ txHash });
    // console.log({ logs: txHash.logs });

    // const receipt = await web3.eth.getTransactionReceipt(
    //   txHash.transactionHash
    // );
    // console.log({ receipt });

    // console.log({ logs: receipt.logs });

    const decodedData = await web3.eth.abi.decodeParameters(
      [
        {
          indexed: false,
          internalType: "uint256",
          name: "ride_id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "cgst",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sgst",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "rider_referrer_amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "driver_referrer_amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "driver_earnings",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "base_fare_without_tax",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "premium_fare_without_tax",
          type: "uint256",
        },
      ],
      "0x00000000000000000000000000000000000000000000000000000000000000390000000000000000000000000000000000000000000000000000000000000c0e0000000000000000000000000000000000000000000000000000000000000c0e000000000000000000000000000000000000000000000000000000000000024a000000000000000000000000000000000000000000000000000000000000024a000000000000000000000000000000000000000000000000000000000001c5820000000000000000000000000000000000000000000000000000000000017dbd0000000000000000000000000000000000000000000000000000000000004c59"
    );

    console.log({ decodedData });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTxCount = async (account) => {
  try {
    const txCount = await web3.eth.getTransactionCount(account);
    return txCount;
  } catch (error) {
    throw error;
  }
};

const encodeData = async (contractInstance, method, data) => {
  try {
    const encodedData = await contractInstance.methods[method](
      ...data
    ).encodeABI();
    return encodedData;
  } catch (error) {
    throw error;
  }
};

const getTx = async (txCount, data, userKeypair) => {
  try {
    const txObject = {
      chainId: 5,
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
      from: userKeypair.address,
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      to: rideContractAddress,
      data: data,
    };

    let tx = new EthereumTx(txObject, { common });

    const pvtBuffer = Buffer.from(userKeypair.privateKey, "hex");
    tx = tx.sign(pvtBuffer);

    const serializedTx = tx.serialize();
    const raw = "0x" + serializedTx.toString("hex");

    return raw;
  } catch (error) {
    throw error;
  }
};
(async () => {
  await initializeWeb3();
  // await initializeContracts();
  // // await callFunction();
  // await addNewUser();

  // await initializeWeb3Ropsten();
})();
