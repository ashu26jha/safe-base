'use client';
import { useEffect, useState } from "react";
import { SafeAuthPack, SafeAuthInitOptions, AuthKitSignInData } from "@safe-global/auth-kit";
import Safe, { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import { ethers, BrowserProvider, Eip1193Provider } from "ethers";
import { GelatoRelayPack } from '@safe-global/relay-kit'
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
// import RPC from "./ethersRPC"; // for using ethers.js
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'

function App() {
  const [safeAuth, setSafeAuth] = useState<SafeAuthPack>();
  const [userInfo, setUserInfo] = useState<any>();
  const [provider, setProvider] = useState<Eip1193Provider | null>(null);
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const safeAuthInitOptions: SafeAuthInitOptions = {
          showWidgetButton: false,
          chainConfig: {
            blockExplorerUrl: "https://goerli.etherscan.io",
            chainId: "0x5",
            displayName: "Ethereum Goerli",
            rpcTarget: "https://rpc.ankr.com/eth_goerli",
            ticker: "ETH",
            tickerName: "Ethereum",
          },
        };

        const safeAuthPack = new SafeAuthPack();
        await safeAuthPack.init(safeAuthInitOptions);

        setSafeAuth(safeAuthPack);
        if (safeAuthPack.isAuthenticated) {
          const signInInfo = await safeAuthPack?.signIn();
          setSafeAuthSignInResponse(signInInfo);
          setProvider(safeAuthPack.getProvider() as Eip1193Provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!safeAuth) {
      uiConsole("safeAuth not initialized yet");
      return;
    }
    const signInInfo = await safeAuth.signIn();
    console.log("SIGN IN RESPONSE: ", signInInfo);

    const userInfo = await safeAuth.getUserInfo();
    console.log("USER INFO: ", userInfo);

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(safeAuth.getProvider() as Eip1193Provider);
  };

  const logout = async () => {
    if (!safeAuth) {
      uiConsole("safeAuth not initialized yet");
      return;
    }
    await safeAuth.signOut();
    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  const createSafe = async () => {
    // Currently, createSafe is not supported by SafeAuthKit.
    const provider = new BrowserProvider(safeAuth?.getProvider() as Eip1193Provider);
    const signer = await provider.getSigner();
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    } as any);

    console.log(safeAuthSignInResponse);

    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safe: Safe = await safeFactory.deploySafe({
      safeAccountConfig: { threshold: 1, owners: [safeAuthSignInResponse?.eoa as string] },
    });
    console.log("SAFE Created!", await safe.getAddress());
    uiConsole("SAFE Created!", await safe.getAddress());
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const signAndExecuteSafeTx = async () => {
    const safeAddress = safeAuthSignInResponse?.safes?.[0] || "0x";

    // Wrap Web3Auth provider with ethers
    const provider = new BrowserProvider(safeAuth?.getProvider() as Eip1193Provider);
    const signer = await provider.getSigner();
    const destinationAddress = '0xa5C44F8c2245B83C9f5a38adf20c1beA48743614'
    const withdrawAmount = ethers.parseUnits('0', 'ether').toString()
    const options: MetaTransactionOptions = {
      isSponsored: true
    }
    // Create a transactions array with one transaction object
    const transactions: MetaTransactionData[] = [{
      to: destinationAddress,
      data: '0x',
      value: withdrawAmount
    }]
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const protocolKit = await Safe.create({
      safeAddress,
      ethAdapter,
    });
    console.log(protocolKit)
    const relayKit = new GelatoRelayPack({ apiKey: '', protocolKit })
    const safeTransaction = await relayKit.createRelayedTransaction({
      transactions,
      options
    })
    console.log('RELAY', relayKit);

    console.log('SAFE TRANS', safeTransaction);
    const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction)
    console.log('SIGNED', signedSafeTransaction);
    const response = await relayKit.executeRelayTransaction(signedSafeTransaction, options)

    console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)
    // // Create transaction
    // let tx = await protocolKit.createTransaction({
    //   transactions: [
    //     {
    //       to: ethers.getAddress(safeAuthSignInResponse?.eoa || "0x"),
    //       data: "0x",
    //       value: ethers.parseUnits("0.0001", "ether").toString(),
    //     },
    //   ],
    // });

    // // Sign transaction
    // tx = await protocolKit.signTransaction(tx);

    // // Execute transaction
    // const txResult = await protocolKit.executeTransaction(tx);
    // uiConsole("Safe Transaction Result", txResult);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        {!safeAuthSignInResponse?.safes?.length ? (
          <>
            <div>
              <button onClick={createSafe} className="card">
                Create Safe
              </button>
            </div>
            <div>
              <button onClick={logout} className="card">
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <button onClick={getChainId} className="card">
                Get Chain ID
              </button>
            </div>
            <div>
              <button onClick={getAccounts} className="card">
                Get Accounts
              </button>
            </div>
            <div>
              <button onClick={getBalance} className="card">
                Get Balance
              </button>
            </div>
            <div>
              <button onClick={signMessage} className="card">
                Sign Message
              </button>
            </div>
            <div>
              <button onClick={sendTransaction} className="card">
                Send Transaction
              </button>
            </div>
            <div>
              <button onClick={signAndExecuteSafeTx} className="card">
                Sign & Ex Safe Txn
              </button>
            </div>
            <div>
              <button onClick={logout} className="card">
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        &{" "}
        <a target="_blank" href="https://docs.safe.global/safe-core-aa-sdk/auth-kit/reference" rel="noreferrer">
          Safe Auth Kit
        </a>{" "}
        Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <div className="grid">{provider ? userInfo?.name ? <p>Welcome {userInfo?.name}!</p> : null : null} </div>
      <div className="grid">
        {provider ? (
          safeAuthSignInResponse?.eoa ? (
            <p>
              Your EOA:{" "}
              <a href={`https://goerli.etherscan.io/address/${safeAuthSignInResponse?.eoa}`} target="_blank" rel="noreferrer">
                {safeAuthSignInResponse?.eoa}
              </a>
            </p>
          ) : null
        ) : null}{" "}
      </div>
      <div className="grid">
        {provider ? (
          safeAuthSignInResponse?.safes?.length ? (
            <>
              <p>Your Safe Accounts</p>
              {safeAuthSignInResponse?.safes?.map((safe: any, index: any) => (
                <p key={index}>
                  Safe[{index}]:{" "}
                  <a href={`https://goerli.etherscan.io/address/${safe}`} target="_blank" rel="noreferrer">
                    {safe}
                  </a>
                </p>
              ))}
            </>
          ) : (
            <>
              <p>No Available Safes, Please create one by clicking the above button. </p>
              <p> Note: You should have some goerli ETH in your account.</p>
              <p>Please be patient, it takes time to create the SAFE!, depending upon network congestion.</p>
            </>
          )
        ) : null}
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/account-abstraction/web3auth-safe-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
