const hre = require("hardhat");

async function main() {
  const FileStorageModule = require("../ignition/modules/FileStorage");

  const result = await hre.ignition.deploy(FileStorageModule);

  console.log("FileStorage deployed to:", result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });