const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const FileStorageModule = buildModule("FileStorage", (m: { contract: (arg0: string) => any; }) => {
  const fileStorage = m.contract("FileStorage");

  // You can add initial setup here if needed
  // For example, storing an initial file:
  // m.call(fileStorage, "storeFile", ["initialHash", "initialFile.txt", 1024, "initialPinAddress"]);

  return { fileStorage };
});

module.exports = FileStorageModule;
