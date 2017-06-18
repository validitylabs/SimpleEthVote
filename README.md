# SimpleEthVote
This is a simple example of voting on the Ethereum blockchain via smart contracts. All contracts are [SWIS-contracts](https://medium.com/@validitylabs/swis-contracts-a-simpler-demonstrator-for-blackchains-and-smart-contracts-a11f2903687) that allow for all logic via plain transactions without payload data. That means all essential logic is implemented in the fallback functions to allow for state transitions as follows:
1. Initialize new poll by sending any transaction (0 or any value) to the VoteManager contract.
2. Vote for `yes` or `no` by sending any transaction (0 or any value) to the `yes` or `no` contract.
3. Paying into the Payout contract and later triggering payouts (or claiming a single payout in case of many participants) that correspond to a specific poll, happens by sending any transaction to the Payout contract.

## Setup
### Website
This page is hosted on github pages to show how minimal effort a quasi-serverless app can be. When opening that page a web3 object needs to be injected to the page to enable the page's javascript to interface the blockchain. That is exactly what the Chrome plugin MetaMask does. Install Metamask and re-load the page.

### Contracts
#### Start new poll
You can start a new poll by sending a transaction to the address of the VoteManager contract. This starts a new vote that runs for 10 minutes and has the title "Vote on tax reimbursements". The owner can also start a new poll that runs for a different duration and has a different title by calling the `startNewVote` function.

#### Vote yes or no
The VoteManager contract links two other contracts: the yes- and the no-contract. These two contracts are used to facilitate a vote. You can vote `yes` or `no` by simply sending a transaction to either of these two contracts. Note that right now these functions cost over 100k gas and are fairly pricy which might lead to issues with some wallets that do not specify sufficient gas. Any funds that are accidentally sent to the yes- or no-contract can be retrieved via the `payOut` function. This function can be called by anyone and simply serves as a way to retrieve otherwise lost funds. The default function of the yes- and no-contract is marked as `payable` to be compatible with current mobile wallets that often times do not permit 0 Wei transactions.