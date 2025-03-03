const path = require('node:path');
const fs = require('node:fs');
const { ethers } = require('ethers');

const RPC_URLS = [
  'https://rpc.ankr.com/zksync_era',
  'https://mainnet.era.zksync.io',
];
const NODE_SALE_CONTRACTS = {
  TIER1:'0xc9110F53C042a61d1b0f95342e61d62714F8A2E6',
  TIER2:'0x11B2669a07A0D17555a7Ab54C0C37f5c8655A739',
  TIER3:'0x58078e429a99478304a25B2Ab03ABE79199bE618',
  TIER4:'0x2E89CAE8F6532687b015F4BA320F57c77920B451',
  TIER5:'0x396Ea0670e3112BC344791Ee7931a5A55E0bDBd1',
  TIER6:'0xB08772AA562ED5d06B34fb211c51EC92debF7b26',
  TIER7:'0x772eDA6C5aACC61771F9b5f9423D381D311a7018',
  TIER8:'0x4842547944832Fe833af677BFDB157dEf391e685',
  TIER9:'0x3F0d099120Bf804606835DEFa6dA1A5E784328D6',
  TIER10:'0xe0D06d430b0a44e6444f5f0736dC113afe5b636A',
  TIER11:'0xE501ADF8425E1Dd5099fA607dCc2B4c91C47B986',
  TIER12:'0x2FB5D834D274b9442DA957E98319C35938219a9E',
  TIER13:'0xa1109b5550bec4a1118bD232BacCd07dc914CF04',
  TIER14:'0x2e64E45faBF1f432d2B59ABd474Da738042B9393',
  TIER15:'0x11fBF3713B44AE6D8DBCA1920A40c82AdC685eb4',
  TIER16:'0x12f8cDEfd7146a089609Be76dCeb8cCeda45eC84',
  TIER17:'0x7497B778f8ACfe135D7710B223F72B82ECca8F20',
  TIER18:'0x27437670D359cb40088Cfa39111144ddD13E05c8',
  TIER19:'0xfE1AEb6f8ceFaF3cc6b331975B25C30a86b111ea',
  TIER20:'0xeF51418BcF608470cB02C3701E22d8885DBbFF5A',
  TIER21:'0x2C8e588EC69B15731970470c8C0Eb864D9Ffb414',
  TIER22:'0x857558578A8Dd302D56a1111835e7bAa245EA38e',
  TIER23:'0x2BDd83B8B189013173C59a15cd9a2fb4Fba9db40',
  TIER24:'0x569C7B5f46f33d7EABcf6347Db6e3338f924AF34',
  TIER25:'0x37AA2dD6aA1c611958879a072C78Db8C8150eb84',
  TIER26:'0x648afe9Dd30515329865ddF5277ae64EaE0576E4',
  TIER27:'0xa2751F76b031189007a573cEa8FdA0d9ddbEf894',
  TIER28:'0xb09fFbf62450608Ba304befDA6C8FA1eCF77F3f3',
  TIER29:'0xC94e199600f09CDcBEEe0AeeB0bBf55E31585149',
  TIER30:'0x7ec4D460a3E97fed71081ECAcd5591d1d3A1884C',
  TIER31:'0x96Da89f233a53b97976F73D7C519C44fefD08CD5',
  TIER32:'0x8CC671cEabb069a2F232CB6ECd4fFC7cd23E9c76',
  TIER33:'0xc501E4aa8fA91a8cdc696F513B05883f5347C69d',
  TIER34:'0xc1e161E12C537661E047d0BFA187EbfF5988A873',
  TIER35:'0x5Edf657342e5fD199Ff64Ff10C232F5D5f931d83',
  TIER36:'0x28aA5d6BE4A4861Bf8a49ae46ab8Ce31A89A03De',
  TIER37:'0xF5f80976ca38881ECe87b9c83Eb9273bd87AA688',
  TIER38:'0xced90a97B34a04dc49b0b4d58336c8c74F1971a3',
  TIER39:'0x518eCD09723EF4a71952aCD9281234294dE1488a',
  TIER40:'0x75d4E9988ed1a06FBB4b1A4D13217Fb87C82cB08',
};
const NODE_SALE_CONTRACT_ABI = JSON.parse('[{"inputs":[{"internalType":"uint256","name":"_salePrice","type":"uint256"},{"internalType":"address","name":"_funder","type":"address"},{"internalType":"contract ERC20","name":"_paymentToken","type":"address"},{"internalType":"contract ERC20","name":"_saleToken","type":"address"},{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_endTime","type":"uint256"},{"internalType":"uint256","name":"_maxTotalPayment","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"paymentTokenBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"saleTokenBalance","type":"uint256"}],"name":"Cash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyTokenRetrieve","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Fund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"OptInBuyback","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"Purchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"code","type":"string"}],"name":"PurchaseWithCode","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"casher","type":"address"}],"name":"SetCasher","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"claimTime","type":"uint256"},{"internalType":"uint8","name":"pct","type":"uint8"}],"indexed":true,"internalType":"struct IFVestable.Cliff[]","name":"cliffPeriod","type":"tuple[]"}],"name":"SetCliffVestingPeriod","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"funder","type":"address"}],"name":"SetFunder","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bool","name":"isPurchaseHalted","type":"bool"}],"name":"SetIsPurchaseHalted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"linearVestingEndTime","type":"uint256"}],"name":"SetLinearVestingEndTime","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_maxTotalPurchasable","type":"uint256"}],"name":"SetMaxTotalPurchasable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"minTotalPayment","type":"uint256"}],"name":"SetMinTotalPayment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"whitelistRootHash","type":"bytes32"}],"name":"SetWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"whitelistSetter","type":"address"}],"name":"SetWhitelistSetter","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint24","name":"withdrawDelay","type":"uint24"}],"name":"SetWithdrawDelay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"amountPerCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"cashPaymentToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"casher","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"checkWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"checkWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"claimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cliffPeriod","outputs":[{"internalType":"uint256","name":"claimTime","type":"uint256"},{"internalType":"uint8","name":"pct","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"codes","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"emergencyTokenRetrieve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"fund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"funder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCliffPeriod","outputs":[{"components":[{"internalType":"uint256","name":"claimTime","type":"uint256"},{"internalType":"uint8","name":"pct","type":"uint8"}],"internalType":"struct IFVestable.Cliff[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getCurrentClaimableToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"getMaxPayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"totalPurchased","type":"uint256"},{"internalType":"uint256","name":"claimable","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"getUnlockedToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hasCashed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"hasUsedCode","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasWithdrawn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"isIntegerPayment","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isIntegerSale","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPurchaseHalted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isVestedGiveaway","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"latestClaimTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"linearVestingEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxPromoCodePerUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTotalPayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTotalPurchasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minTotalPayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"paymentReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"paymentReceivedWithCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"paymentReceivedWithEachCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paymentToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"promoCodesPerUser","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicAllocation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"purchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"purchaserCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"saleAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"salePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleTokenPurchased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_casher","type":"address"}],"name":"setCasher","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"claimTimes","type":"uint256[]"},{"internalType":"uint8[]","name":"pct","type":"uint8[]"}],"name":"setCliffPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_funder","type":"address"}],"name":"setFunder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isIntegerSale","type":"bool"}],"name":"setIsIntegerSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isPurchaseHalted","type":"bool"}],"name":"setIsPurchaseHalted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vestingEndTime","type":"uint256"}],"name":"setLinearVestingEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTotalPurchasable","type":"uint256"}],"name":"setMaxTotalPurchasable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minTotalPayment","type":"uint256"}],"name":"setMinTotalPayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_publicAllocation","type":"uint256"}],"name":"setPublicAllocation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isVestedGiveaway","type":"bool"}],"name":"setVestedGiveaway","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_vestingEditableOverride","type":"bool"}],"name":"setVestingEditable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_whitelistRootHash","type":"bytes32"}],"name":"setWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_whitelistSetter","type":"address"}],"name":"setWhitelistSetter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint24","name":"_withdrawDelay","type":"uint24"}],"name":"setWithdrawDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPaymentReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalPurchased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"uniqueUsePerCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingEditableOverride","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistRootHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"name":"whitelistedPurchase","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"_allocation","type":"uint256"}],"name":"whitelistedPurchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"_allocation","type":"uint256"},{"internalType":"string","name":"code","type":"string"}],"name":"whitelistedPurchaseWithCode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawDelay","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"name":"withdrawGiveaway","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"withdrawGiveaway","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"uint256","name":"allocation","type":"uint256"}],"name":"withdrawGiveawayVested","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawerCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"}]');
const WETH_CONTRACT = '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91';
const WETH_CONTRACT_ABI = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bridgeBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bridgeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositTo","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"address","name":"_l2Gateway","type":"address"},{"internalType":"address","name":"_l1Address","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"l1Address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Gateway","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]');
const SALE_START_TIME = 1714467600000 - 3000;

start();

function start() {
  const wallets = fs.readFileSync(path.resolve(__dirname, 'wallets.txt'), 'utf8').split(/\r?\n/);
  let walletsIsEmpty = true;

  for (let line of wallets) {
    line = line.trim();

    if (!line || line.startsWith('#')) continue;

    walletsIsEmpty = false;

    const [privateKey, tier, quantity] = line.split(';');

    prepareForMint(privateKey, tier, quantity)
      .catch((err) => {
        console.error('\x1b[31m' + err.message + '\x1b[0m');
      });
  }

  if (walletsIsEmpty) {
    console.error('\x1b[31mNo wallets\x1b[0m');
  }
}

async function prepareForMint(privateKey, tier, quantity) {
  const provider = new ethers.JsonRpcProvider(RPC_URLS[Math.floor(Math.random() * RPC_URLS.length)]);
  const wallet = new ethers.Wallet(privateKey, provider);

  const nodeSaleContractAddress = NODE_SALE_CONTRACTS[`TIER${tier}`];

  if (!nodeSaleContractAddress) {
    throw new Error(`[${wallet.address}] Invalid tier "${tier}"`);
  }

  const nodeSaleContract = new ethers.Contract(nodeSaleContractAddress, NODE_SALE_CONTRACT_ABI, wallet);
  const tierPrice = await nodeSaleContract.salePrice.staticCall();
  const allocation = 1000000000000000000n * BigInt(quantity);
  const wethCost = tierPrice * BigInt(quantity);

  const wethBalance = await getWethBalance(wallet);

  if (wethBalance < wethCost) {
    throw new Error(`[${wallet.address}] Insufficient WETH balance for ${quantity} x TIER${tier}`);
  }

  await approveWeth(wallet, wethCost, nodeSaleContractAddress);

  console.log(`[${wallet.address}] Ready and waiting for sale start...`);

  while (Date.now() < SALE_START_TIME) {
    await sleep(1000);
  }

  for (let attempts = 2; attempts >= 0; attempts--) {
    try {
      await mintNode(wallet, nodeSaleContract, wethCost, allocation);

      break;
    } catch (e) {
      if (attempts) {
        console.error('\x1b[31m' + e.message + '\x1b[0m');
        console.error(`\x1b[31m[${wallet.address}] Mint error. Try again in 1 sec \x1b[0m`);

        await sleep(1000);

        continue;
      }

      throw e;
    }
  }
}

async function mintNode(wallet, nodeSaleContract, amount, allocation) {
  const rawTx = await nodeSaleContract.whitelistedPurchaseWithCode.populateTransaction(
    amount,
    [],
    allocation,
    Buffer.from('6f647576616e6368696b', 'hex').toString(),
    {
      gasLimit: 3_000_000,
    },
  );
  const populatedTx = await wallet.populateTransaction(rawTx);

  if (populatedTx.gasPrice) {
    populatedTx.gasPrice = ethers.parseUnits('1', 'gwei');
  }
  if (populatedTx.maxFeePerGas) {
    populatedTx.maxFeePerGas = ethers.parseUnits('6.1', 'gwei');
  }
  if (populatedTx.maxPriorityFeePerGas) {
    populatedTx.maxPriorityFeePerGas = ethers.parseUnits('6.5', 'gwei');
  }

  const signedTx = await wallet.signTransaction(populatedTx);

  for (let attempts = 1; attempts >= 0; attempts--) {
    try {
      const transaction = await wallet.provider.broadcastTransaction(signedTx);

      await transaction.wait(1, 300_000);

      console.log(`\x1b[32m[${wallet.address}] Node minted successfully\x1b[0m`);

      break;
    } catch (e) {
      if (attempts) {
        console.error('\x1b[31m' + e.message + '\x1b[0m');
        console.error(`\x1b[31m[${wallet.address}] Mint error. Try again in 1 sec \x1b[0m`);

        await sleep(1000);

        continue;
      }

      throw e;
    }
  }
}

async function approveWeth(wallet, amount, spender) {
  const allowance = await getWethAllowance(wallet, spender);

  if (amount <= allowance) return;

  const contract = new ethers.Contract(WETH_CONTRACT, WETH_CONTRACT_ABI, wallet);
  const transaction = await contract.approve(spender, amount);

  await transaction.wait(1, 300_000);

  console.log(`[${wallet.address}] WETH approved`);
}

function getWethAllowance(wallet, spender) {
  const contract = new ethers.Contract(WETH_CONTRACT, WETH_CONTRACT_ABI, wallet);

  return contract.allowance.staticCall(wallet.address, spender);
}

function getWethBalance(wallet) {
  const contract = new ethers.Contract(WETH_CONTRACT, WETH_CONTRACT_ABI, wallet);

  return contract.balanceOf.staticCall(wallet.address);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
