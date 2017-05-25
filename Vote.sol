pragma solidity ^0.4.10;

import './VoteFactory.sol';

contract Vote {
    VoteFactory public myVoteFactory;

    function Vote() {
        // constructor expects to be called by VoteFactory contract
        myVoteFactory = VoteFactory(msg.sender);
    }
    
    function () {
        // tx from admin should trigger new vote
        // tx in case the previous round is over for at least 10min should also trigger new vote
        myVoteFactory.vote(this == myVoteFactory.yesContract());
    }
}


