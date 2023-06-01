window.addEventListener('load', async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      startApp();
    } catch (error) {
      console.error('User denied account access...');
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    window.web3 = new Web3(web3.currentProvider);
    startApp();
  }
  // Fallback to localhost; use dev console port by default...
  else {
    console.log('No web3? You should consider trying MetaMask!');
  }
});

const paymentContractAddress = '0x132A70d55035190eeaE1Fa7B891419D3a67b7EAA';
const paymentAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'execPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'priceFeedContractAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PaymentScheduled',
    type: 'event',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'schedulePayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllPayments',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'userAddreess',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'amount',
            type: 'int256',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'priceTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isPaid',
            type: 'bool',
          },
        ],
        internalType: 'struct Payment.PaymentRequest[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'getPaymentDone',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'userAddreess',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'amount',
            type: 'int256',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'priceTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isPaid',
            type: 'bool',
          },
        ],
        internalType: 'struct Payment.PaymentRequest',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'paymentKeys',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const priceFeedContractAddress = '0xC707844c11323417664aE1e0F7B7A74Df7d2ff1f';
const priceFeedContractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'price',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'decimals',
        type: 'uint8',
      },
    ],
    name: 'PriceUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: '_ethPrice',
        type: 'int256',
      },
      {
        internalType: 'uint8',
        name: 'decimals',
        type: 'uint8',
      },
    ],
    name: 'updatePrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEthPrice',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'price',
            type: 'int256',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct PriceFeed.PriceSnapshot',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPriceChainlink',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'price',
            type: 'int256',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct PriceFeed.OnChainPrice',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPriceWitnet',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'price',
            type: 'int256',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct PriceFeed.OnChainPrice',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'priceSnapshots',
    outputs: [
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'int256',
        name: 'price',
        type: 'int256',
      },
      {
        internalType: 'uint8',
        name: 'decimals',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'snapshotCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'snapshotLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
let paymentContract;
let priceFeedContract;

function startApp() {
  paymentContract = new web3.eth.Contract(paymentAbi, paymentContractAddress);
  priceFeedContract = new web3.eth.Contract(priceFeedContractABI, priceFeedContractAddress);

  setInterval(getAllPayments, 1000);
  setInterval(getEthPrice, 1000);``
}

async function getEthPrice() {
  const accounts = await web3.eth.getAccounts();
  priceFeedContract.methods
    .getEthPrice()
    .call({ from: accounts[0] })
    .then(function (result) {

      const date = new Date(result.timestamp * 1000);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      const formattedDate = date.toLocaleString('ko-KR', options);
      document.getElementById('ethPrice').innerHTML = `<${formattedDate}>    ${result.price * 10**-8} $`;
    });
}

async function getAllPayments() {
  const accounts = await web3.eth.getAccounts();
  paymentContract.methods
    .getAllPayments()
    .call({ from: accounts[0] })
    .then(function (result) {
      updateTable(result);
    });
}
function sendHttpRequest() {

  fetch('http://a230d0168ed1e4fa88c4cc57e75876dd-9075274.ap-northeast-2.elb.amazonaws.com/user-bot')
    .then(function (response) {
      return response.text();
     })
    .then(function (data) {
    })

}


function updateTable(payments) {
  let table = document.getElementById('paymentsTable');
  // Clear table except for header
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  // Populate table
  for (let payment of payments) {
    let row = table.insertRow();
    let userAddressCell = row.insertCell(0);
    let timestampCell = row.insertCell(1);
    let amountCell = row.insertCell(2);
    let decimalsCell = row.insertCell(3);
    let priceTimestampCell = row.insertCell(4);

    let isPaidCell = row.insertCell(5);

    userAddressCell.innerHTML = payment.userAddreess;
    timestampCell.innerHTML = new Date(
      payment.timestamp * 1000,
    ).toLocaleString();
    amountCell.innerHTML = payment.amount / 10 ** payment.decimals;
    decimalsCell.innerHTML = payment.decimals;
    if (payment.priceTimestamp === '0') {
      priceTimestampCell.innerHTML = 'not yet pay';
    } else {
      priceTimestampCell.innerHTML = new Date(
        payment.priceTimestamp * 1000,
      ).toLocaleString();
    }

    isPaidCell.innerHTML = payment.isPaid ? 'Yes' : 'No';
  }
}
