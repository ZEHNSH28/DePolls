import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const PollList = ({ state }) => {
  const [ListNum, setListNum] = useState();
  const [List, setList] = useState([]);
  const contract = state.contract;

  useEffect(() => {
    let list;
    const listItems = async () => {
      list = await contract.latestCreatedPoll();

      for (let i = 1; i <= ethers.BigNumber.from(list._hex).toNumber(); i++) {
        let poll = await contract.getPollsWithOptions(i);

        setList((current) => [...current, poll]);
      }
     
    };
    contract && listItems();
  }, [contract]);

  return <div> {List.map((listItem,index)=> {
    return <h1>{listItem[index]}</h1>
  })} </div>;
};

export default PollList;
