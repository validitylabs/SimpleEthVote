/*
TODO:
- insert async
- insert jquery
- check if web3 available, popup error otherwise
- check if contract available, warning if not
- get latest state (poll number, num yes and no)
*/
//console.log(JSON.stringify(web3));
var web3;
if (web3 === undefined)
    alert('Could not find web3 Object. Make sure you are using the Chrome browser and have the MetaMask extension installed or try compatible options.');
else
    alert('OK');

var contractAddress = '0x';
var contractABI = {};
var contract = web3.contract(contractABI).at(contractAddress);

contract.nextEndTime((error, nextEndTime) => {

});

contract.numPolls((error, numPolls) => {

});

contract.yesCount(numPolls, (error, yesCount) => {

});

contract.noCount(numPolls, (error, noCount) => {

});
/*
check if poll is currently ongoing (compare game endtime to some time that we e.g. get via geth)
if poll is ongoing diplay timer
if no poll is ongoing diplay button to start new poll
if poll is ongoing, keep polling for new data every 2s:
  - update bars
  - update numbers yes/no
  - update voter list
- 
*/
