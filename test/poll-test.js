const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Poll-Test", function () {
  let accounts, poll;
  let deployer, voter1, voter2, voter3, voter4, voter5;
  let count;
  beforeEach(async function () {
    count = 0;
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    voter1 = accounts[1];
    voter2 = accounts[2];
    voter3 = accounts[3];
    voter4 = accounts[4];
    voter5 = accounts[5];

    const Poll = await ethers.getContractFactory("Poll");
    poll = await Poll.deploy();
    await poll.deployed();
  });

  it("Should create a poll", async function () {
    count++;
    const pollName = "Test Poll";
    const description = "Test Description";
    const options = ["Option 1", "Option 2", "Option 3"];
    const result = await poll.createPoll(pollName, description, options);
    await expect(result)
      .to.emit(poll, "PollCreated")
      .withArgs(count, pollName, description, options);
  });

  describe("Poll Functionality and reversions", function () {
    beforeEach(async function () {
      count++;
      const pollName = "Test Poll";
      const description = "Test Description";
      const options = ["Option 1", "Option 2", "Option 3"];
      const result = await poll.createPoll(pollName, description, options);
      await expect(result)
        .to.emit(poll, "PollCreated")
        .withArgs(count, pollName, description, options);
    });

    it("should delete poll", async function () {
      const tx = await poll.deletePoll(1);
      await expect(tx).to.emit(poll, "PollDeleted").withArgs(1,deployer.address);
      await expect(poll.connect(voter1).deletePoll(1)).to.be.revertedWith("Only owner can modify");

      const poll1 = await poll.Polls(1);

      expect(poll1.hasDisabled).to.equal(true);
      
    });

    it("Should vote and test reversions", async function () {
      await expect(poll.connect(voter1).castVote(1, 0)).to.be.revertedWith(
        "Option ID invalid"
      );
      await expect(poll.connect(voter1).castVote(1, 4)).to.be.revertedWith(
        "Option ID invalid"
      );
      await expect(poll.connect(voter1).castVote(2, 2)).to.be.revertedWith(
        "Invalid Poll ID"
      );

      const vote = await poll.connect(voter1).castVote(1, 1);
      await expect(vote)
        .to.emit(poll, "VoteCast")
        .withArgs(1, voter1.address, 1);
      await expect(poll.connect(voter1).castVote(1, 1)).to.be.revertedWith(
        "The user has already voted"
      );
    });

    it("modify the poll", async function () {
      const pollName = "Test Poll Modified";
      const description = "Test Description Modified";
      const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
      const result = await poll.modifyPoll(1, pollName, description, options);
      await expect(result)
        .to.emit(poll, "PollModified")
        .withArgs(1);

      await expect(poll.connect(voter1).modifyPoll(1, pollName, description, options)).to.be.revertedWith("Only owner can modify");
    });

    it("test voting by multiple voters and get the result of poll",async  function(){
      await poll.connect(voter1).castVote(1,1);
      await poll.connect(voter2).castVote(1,3);
      await poll.connect(voter3).castVote(1,3);
      await poll.connect(voter4).castVote(1,3);
      await poll.connect(voter5).castVote(1,2);
      const result = await poll.getPollResult(1);
      console.log(result);
      console.log(await poll.Polls(1));
    
    });
  });
});
