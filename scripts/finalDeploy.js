const hre =  require("hardhat");

async function main() {
    const poll = await hre.ethers.getContractFactory("Poll");
    const pollContract = await poll.deploy();
    await pollContract.deployed();

    console.log("Poll deployed to:", pollContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});