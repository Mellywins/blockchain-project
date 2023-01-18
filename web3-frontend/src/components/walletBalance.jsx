import { useState } from "react";
import { ethers } from "ethers";
function WalletBalance() {
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div className="card">
      <h5>Wallet Balance</h5>
      <button onClick={getBalance}>Get Balance</button>
      <p>Balance: {balance}</p>
    </div>
  );
}

export default WalletBalance;
