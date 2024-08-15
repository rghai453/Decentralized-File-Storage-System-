pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string fileName; 
        uint256 fileSize; 
        address owner; 
        string pinAddress; 
    }

    mapping(string => File) public files;
    mapping(address => string[]) public userFiles;

    event FileStored(string fileHash, string fileName, uint256 fileSize, string pinAddress, address owner); 

    function storeFile(string memory fileHash, string memory fileName, uint256 fileSize, string memory pinAddress) public {
        files[fileHash] = File(fileName, fileSize, msg.sender, pinAddress); 
        userFiles[msg.sender].push(fileHash);
        emit FileStored(fileHash, fileName, fileSize, pinAddress, msg.sender); 

    }

    function getFile(string memory fileHash) public view returns (string memory, uint256, address, string memory) {
        File memory file = files[fileHash]; 
        return (file.fileName, file.fileSize, file.owner, file.pinAddress);
    }
}