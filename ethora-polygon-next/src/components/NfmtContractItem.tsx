import { useEffect, useState, useContext } from "react"
import {ethers} from 'ethers'

import { Web3ProviderContext } from "@/context/Web3Provider";

import { config } from '@/constants/config'
import NfmtEthoraAbi from '@/constants/ABI/EthoraNfmt.json'

interface IContractItemProps {
  data: {
    contractAddress: string
    name: string
    symbol: string
    owner: string
    urls: string[],
    costs: string[],
    maxSupplies: string[]
  }
}

export default function NfmtContractItem(props: IContractItemProps) {
  const [startFreeMint, setStartFreeMint] = useState(false)
  const { connectWallet } = useContext(Web3ProviderContext)

  const [freeIndex, setFreeIndex] = useState<number>(-1)

  function showCostWithTokenId(costs: string[]) {
    return costs.map((el, index) => {
      return `tokenId ${index + 1} - ${el} wei`
    }).join(',')
  }

  async function mintForFree(index: number) {
    console.log('mint for free ', index)
    setStartFreeMint(true)
    try {
      const { web3ModalInstance, web3ModalProvider } = await connectWallet();

      console.log(web3ModalInstance.selectedAddress)

      if (web3ModalInstance.chainId !== config.networkIdHex) {
        alert("Please change your network to " + config.networkName);
        return;
      }

      const signer = web3ModalProvider.getSigner();
      const ethoraCoin = new ethers.Contract(
        props.data.contractAddress,
        NfmtEthoraAbi,
        signer
      );

      const transaction = await ethoraCoin.mint(index + 1, 1, web3ModalInstance.selectedAddress);
      const transactionReceipt = await transaction.wait();

      console.log(transactionReceipt)

    } catch (error) {
      console.log('error ', error)
    }
  }

  useEffect(() => {
    function checkForZeroCost(costs: string[]) {
      const index = costs.findIndex((el) => el == "0")
      return index
    }

    const index = checkForZeroCost(props.data.costs)

    setFreeIndex(index)
  }, [props.data])

  return (
    <div className="border p-10">
      <div className={`w-full h-[200px] overflow-hidden`}>
        <img src={props.data.urls[0]} alt="" />
      </div>
      <div>
        Token Name: {props.data.name}
      </div>
      <div>
        Token Symbol: {props.data.symbol}
      </div>
      <div>Costs: {showCostWithTokenId(props.data.costs)}</div>
      {
        (freeIndex > -1) && (
          <div className="flex mt-3 justify-center">
            <button onClick={() => mintForFree(freeIndex)} className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center">Mint for free</button>
          </div>
        )
      }
    </div>
  )
}