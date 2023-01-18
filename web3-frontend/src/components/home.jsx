import WalletBalance from "./walletBalance";
import { ethers } from "ethers";
import SwagDogs from "../artifacts/contracts/SwagDogs.sol/SwagDogs.json";
import { useState } from "react";
import { useEffect } from "react";
import data from "../consts.json";
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const provider = new ethers.providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
console.log(data);

// get the smart contract
const contract = new ethers.Contract(contractAddress, SwagDogs.abi, signer);
function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);
  const getCount = async () => {
    const count = await contract.count();
    console.log(count, "zezezeze");
    setTotalMinted(parseInt(count));
  };
  console.log(totalMinted + 1);
  return (
    <div>
      <WalletBalance />
      <h1>Swag Dogs NFT Collection</h1>
      {Array(totalMinted + 1)
        .fill(0)
        .map((_, index) => {
          return (
            <div key={index}>
              <NFTImage tokenId={index} />
            </div>
          );
        })}
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const metadataURI = data.entries[tokenId].cid;
  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);
  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };
  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });
    await result.wait();
    getMintedStatus();
  };

  async function getURI() {
    const uri = await contract.tokenURI(metadataURI);
  }
  return (
    <div>
      <img
        src={
          isMinted ? data.entries[tokenId].image : "src/assets/placeholder.png"
        }
      />
      <div>
        <h5>
          ID #{tokenId} #CID {metadataURI}
        </h5>
        {!isMinted ? (
          <button onClick={mintToken}>Mint</button>
        ) : (
          <button onClick={getURI}>Taken! Show URI</button>
        )}
      </div>
    </div>
  );
}

export default Home;
