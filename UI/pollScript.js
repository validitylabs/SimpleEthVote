/*
TODO:
- insert async
- insert jquery
- check if web3 available, popup error otherwise
- check if contract available, warning if not
- get latest state (poll number, num yes and no)
*/

//console.log(JSON.stringify(web3));
var yesCount = 0;
var noCount = 0;
var contract = {};
var numPolls = 0;
var blockchainExplorerBaseUrl = 'https://ropsten.etherscan.io/address/';

// address of the VoteFactory contract
//var contractAddress = '0x0B6F6E073A08AB8Fd458527C47eD83982FF26851'; // main net - same version???
var contractAddress = '0xf8744e4675a9a8aCa068876564cB58F1C9E77aDf'; // Ropsten test net

$(window).on('load', function() {
    if (web3 === undefined)
        alert('Could not find web3 Object. Make sure you are using the Chrome browser and have the MetaMask extension installed or try compatible options.');

    var contractABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"voteDescription","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"yesCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"duration","type":"uint256"},{"name":"description","type":"string"}],"name":"newVote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"isYes","type":"bool"},{"name":"voteSender","type":"address"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numPolls","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"numVoters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"noContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"noCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"payOut","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"yesContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"voter","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"nextEndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"transferredOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"initiator","type":"address"},{"indexed":false,"name":"duration","type":"uint256"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"voteId","type":"uint256"}],"name":"startedNewVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"voter","type":"address"},{"indexed":false,"name":"isYes","type":"bool"}],"name":"voted","type":"event"}];

    // main net corresponding ABI:
    //var contractABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"voteDescription","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"yesCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"duration","type":"uint256"},{"name":"description","type":"string"}],"name":"newVote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"isYes","type":"bool"},{"name":"voteSender","type":"address"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numPolls","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"numVoters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"noContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"noCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"payOut","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"yesContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"voter","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"nextEndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"transferredOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"initiator","type":"address"},{"indexed":false,"name":"duration","type":"uint256"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"voteId","type":"uint256"}],"name":"startedNewVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"voter","type":"address"},{"indexed":false,"name":"isYes","type":"bool"}],"name":"voted","type":"event"}];
    contract = web3.eth.contract(contractABI).at(contractAddress);

    numPolls = 0;
    var nextEndTime = 0;
    contract.numPolls((error, val) => {
        numPolls = val.toNumber();
    
        contract.nextEndTime((error, val) => {
            nextEndTime = val.toNumber();
            console.log('error: ' + error);
            console.log(nextEndTime + ' (end time)');
            var t1;
            var t2;
            var now = Math.floor(Date.now() / 1000);
            console.log(now + ' (now)');
            if (nextEndTime > now) {
                getContractData();
                t1 = setInterval(() => {
                    getContractData();
                }, 3000);


                // Update the count down every 1 second
                t2 = setInterval(function() {

                    // Get todays date and time
                    var now = Math.floor(Date.now() / 1000);

                    // Find the distance between now an the count down date
                    var distance = nextEndTime - now;
                    console.log(distance + ' (distance)');

                    // Time calculations for days, hours, minutes and seconds
                    var minutes = Math.floor((distance % (60 * 60)) / (60));
                    var seconds = Math.floor((distance % (60)));

                    // Display the result in the element with id="demo"
                    $('#description').text(minutes + ":" + seconds);
                    if(distance <= 0) {
                        $('#description').text('Voting period is over!');
                        clearInterval(t1);
                        clearInterval(t2);
                    }
                }, 1000);
            }

        });
    });

    contract.numPolls((error, numPolls) => {
        if (error) {
            console.log('error getting number of polls: ' + error);
            return;
        }
        contract.voteDescription(parseInt(numPolls), (error, voteDescription) => {
            if (error) {
                console.log('error getting vote description: ' + error);
                return;
            }
            $('#description').text('Poll number ' + numPolls + ': ' + voteDescription);
        });
    })

    contract.yesContract((error, address) => {
        if (error) {
            console.log('error getting yes contract: ' + error);
            return;
        }
        console.log('yes contract: ' + address);
        $('#yesQrContainer').qrcode(address);
        $('#yesText').html('address: <a href=\'' + blockchainExplorerBaseUrl + address + '\'>' + address + '</a>');
    });

    contract.noContract((error, address) => {
        if (error) {
            console.log('error getting no contract: ' + error);
            return;
        }
        console.log('no contract: ' + address);
        $('#noQrContainer').qrcode(address);
        $('#noText').html('address: <a href=\'' + blockchainExplorerBaseUrl + address + '\'>' + address + '</a>');
    });

    $('#voteFactoryAddress').click(function() {
        $('#voteFactoryAddress').toggle(750);
    });

    $('#voteFactoryAddress').html('address: <a href=\'' + blockchainExplorerBaseUrl + contractAddress + '\'>' + contractAddress + '</a>');

    $('#voteFactoryAddress').qrcode(contractAddress);
});

function getContractData() {
    contract.yesCount(numPolls, (error, val) => {
        yesCount = val.toNumber();
        console.log('error: ' + error + ', yesCount: ' + yesCount);
        contract.noCount(numPolls, (error, val) => {
            noCount = val.toNumber();
            console.log('error: ' + error + ', noCount: ' + noCount);
            adjustUI();
        });
    });
}

function adjustUI() {
   if (yesCount != 0 || noCount != 0) {
        var max = Math.max(yesCount, noCount);
        var maxHeight = 200;
        var newYesHeight = maxHeight * yesCount / max;
        var newNoHeight = maxHeight * noCount / max;
        console.log('new heights - yes: ' + newYesHeight + ', no: ' + newNoHeight);
        $('#yesBar').animate({
            height: newYesHeight + 'px'
        }, 1000)
        $('#noBar').animate({
            height: newNoHeight + 'px'
        }, 1000)
        setTimeout(() => {
            $('#noText').text('NO (' + noCount + ' votes)');
            $('#yesText').text('YES (' + yesCount + ' votes)');
        }, 1000);
   }
}
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
