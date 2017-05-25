pragma solidity ^0.4.10;

import './VoteFactory.sol';

contract Payout {
    VoteFactory public myVoteFactory;

    event PaidOutVoter(address voter, uint amount);

    function Payout(address VoteFactoryAddress) {
        myVoteFactory = VoteFactory(myVoteFactory);
    }

    mapping(uint => uint) payoutAmount; // payout per round
    mapping(address => mapping(uint => bool)) requestedPayout;

    function () payable {
        uint numPolls = myVoteFactory.numPolls();

        if (payoutAmount[numPolls] == 0)
            payoutAmount[numPolls] == this.balance;
            
        // if previous round is over:
        if (myVoteFactory.nextEndTime() < now) {
            // pay out to all, unless we have too many voters (very expensive call that might run into block gas limit limitations)
            uint maxNumVotersToPayDirectly = 20;
            if (myVoteFactory.numVoters(numPolls) < maxNumVotersToPayDirectly) {
                uint len = myVoteFactory.numVoters(numPolls);
                for (uint c = 0; c < len; c++) {
                    payOutVoterById(c);
                }
            } else {
                // if we have too many voters, just pay out to self
                payOutVoterByAddress(msg.sender);
            }
        }
    }

    function payOutVoterById(uint voterId) {
        uint numPolls = myVoteFactory.numPolls();

        // check for array out of bounds
        assert(voterId < myVoteFactory.numVoters(numPolls));

        address voter = myVoteFactory.voter(numPolls, voterId);
        payOutVoterByAddress(voter);
    }

    function payOutVoterByAddress(address voter) {
        uint numPolls = myVoteFactory.numPolls();
        assert(myVoteFactory.hasVoted(voter, numPolls));
        assert(!requestedPayout[voter][numPolls]);
        uint amount = payoutAmount[numPolls];
        if (voter.send(amount)) {
            requestedPayout[voter][numPolls] = true;
            PaidOutVoter(voter, amount);
        }
    }

    function getCurrentNumberOfVoters() constant returns (uint numVoters) {
        uint numPolls = myVoteFactory.numPolls();
        return myVoteFactory.numVoters(numPolls);
    }
}
