'use client';
import React, { useState } from 'react';
import ReferButton from "../Refer";

function App() {
    const [showCreateDepositFields, setShowCreateDepositFields] = useState(false);
    const [showClaimDepositFields, setShowClaimDepositFields] = useState(false);
    const [showCancelDepositFields, setShowCancelDepositFields] = useState(false);
    const [showIsVerifiedFields, setShowIsVerifiedFields] = useState(false);
    const [showMintTokenFields, setShowMintTokenFields] = useState(false);

    const handleToggleCreateDepositFields = () => {
        setShowCreateDepositFields((prevShowFields) => !prevShowFields);
    };

    const handleToggleClaimDepositFields = () => {
        setShowClaimDepositFields((prevShowFields) => !prevShowFields);
    };

    const handleToggleCancelDepositFields = () => {
        setShowCancelDepositFields((prevShowFields) => !prevShowFields);
    };

    const handleToggleIsVerifiedFields = () => {
        setShowIsVerifiedFields((prevShowFields) => !prevShowFields);
    };

    const handleToggleMintTokenFields = () => {
        setShowMintTokenFields((prevShowFields) => !prevShowFields);
    };

    return (
        <div className="app-container">
                        <ReferButton/>
            <button
                onClick={handleToggleCreateDepositFields}
                className="toggle-button"
            >
                {showCreateDepositFields ? 'Hide Create Deposit Fields' : 'Create Deposit'}
            </button>

            {showCreateDepositFields && (
                <div className="fields-container">
                    {/* Create Deposit Fields */}
                    <div className="field">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Tokens:</label>
                        <input
                            type="text"
                            name="tokens"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Caller:</label>
                        <input
                            type="text"
                            name="caller"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Token Address:</label>
                        <input
                            type="text"
                            name="tokenAddress"
                            className="input-field"
                        />
                    </div>

                    <button className="submit-button">Submit</button>
                </div>
            )}

            <button
                onClick={handleToggleClaimDepositFields}
                className="toggle-button"
            >
                {showClaimDepositFields ? 'Hide Claim Deposit Fields' : 'Claim Deposit'}
            </button>

            {showClaimDepositFields && (
                <div className="fields-container">
                    {/* Claim Deposit Fields */}
                    <div className="field">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="claimPassword"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Receiver:</label>
                        <input
                            type="text"
                            name="receiver"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Token Address:</label>
                        <input
                            type="text"
                            name="claimTokenAddress"
                            className="input-field"
                        />
                    </div>

                    <button className="submit-button">Submit</button>
                </div>
            )}

            <button
                onClick={handleToggleCancelDepositFields}
                className="toggle-button"
            >
                {showCancelDepositFields ? 'Hide Cancel Deposit Fields' : 'Cancel Deposit'}
            </button>

            {showCancelDepositFields && (
                <div className="fields-container">
                    {/* Cancel Deposit Fields */}
                    <div className="field">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="cancelPassword"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Caller:</label>
                        <input
                            type="text"
                            name="cancelCaller"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Token Address:</label>
                        <input
                            type="text"
                            name="cancelTokenAddress"
                            className="input-field"
                        />
                    </div>

                    <button className="submit-button">Submit</button>
                </div>
            )}

            <button
                onClick={handleToggleIsVerifiedFields}
                className="toggle-button"
            >
                {showIsVerifiedFields ? 'Hide Is Verified Fields' : 'Is Verified'}
            </button>

            {showIsVerifiedFields && (
                <div className="fields-container">
                    {/* Is Verified Fields */}
                    <div className="field">
                        <label>Sender:</label>
                        <input
                            type="text"
                            name="sender"
                            className="input-field"
                        />
                    </div>

                    <button className="submit-button">Submit</button>
                </div>
            )}

            <button
                onClick={handleToggleMintTokenFields}
                className="toggle-button"
            >
                {showMintTokenFields ? 'Hide Mint Token Fields' : 'Mint Token'}
            </button>

            {showMintTokenFields && (
                <div className="fields-container">
                    {/* Mint Token Fields */}
                    <div className="field">
                        <label>Amount:</label>
                        <input
                            type="text"
                            name="mintAmount"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Caller:</label>
                        <input
                            type="text"
                            name="mintCaller"
                            className="input-field"
                        />
                    </div>

                    <div className="field">
                        <label>Token Address:</label>
                        <input
                            type="text"
                            name="mintTokenAddress"
                            className="input-field"
                        />
                    </div>

                    <button className="submit-button">Submit</button>
                </div>
            )}
        </div>
    );
}

export default App;
