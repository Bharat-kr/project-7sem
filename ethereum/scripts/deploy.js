const { ethers } = require("hardhat");
const fs = require("fs");

const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const HealthChain = await ethers.getContractFactory("HealthChain");
  const contract = await HealthChain.deploy();

  console.log("Contract deployed at:", contract.address);
};

main()
  .then(() => {
    fs.copyFile(
      "./artifacts/contracts/HealthChain.sol/HealthChain.json",
      "../client/src/utils/abi.json",
      (err) => {
        if (err) throw err;
        console.log("File was copied to destination");
      }
    );
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//0x89D353CF55aE591067aED11983906Ce0A6001CEd
