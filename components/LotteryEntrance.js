import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const dispatch = useNotification();

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUi() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumOfPlayers()).toString();
        const recentWinnerFromCall = (await getRecentWinner()).toString();
        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = {
        async function(tx) {
            await tx.wait(1);
            handleNewNotification();
            updateUi();
        },
    };

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        });
    };

    return (
        <div className="p-5">
            Enter the Ethereum Goerli Test Net Lottery:
            {raffleAddress ? (
                <>
                    <div className="p-5">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ml-auto"
                            onClick={async function () {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                });
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Enter Raffle"
                            )}
                        </button>
                    </div>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number of Players: {numPlayers}</div>
                    <div>Recent Winnter: {recentWinner}</div>
                    <div className="p-5 font-light">
                        This is just a test application to test smart contract functionality for the
                        Ethereum Test Net. ALL CRYPTO is TEST CRYPTO AND HAS NO VALUE.
                    </div>
                </>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
}
