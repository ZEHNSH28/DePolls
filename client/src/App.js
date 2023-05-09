import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./artifacts/contracts/Poll.sol/Poll.json";
import CreatePoll from "./components/createpoll/CreatePoll";
import PollList from "./components/pollList/PollList";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xc060064e9295c73d1c26697fD9f2D30347055760";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setState({
            provider,
            signer,
            contract,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  return (
    <>
      <nav>
        <Navbar state={state}></Navbar>
      </nav>
      <CreatePoll state={state}></CreatePoll>
      <PollList state={state}></PollList>
    </>
  );
}

export default App;
