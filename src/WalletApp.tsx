// app/WalletApp.tsx
'use client';

import {
	DAppKitProvider,
	ConnectButton,
	useCurrentAccount,
	useDAppKit,
} from '@mysten/dapp-kit-react';
import { Transaction, coinWithBalance } from '@mysten/sui/transactions';
import { dAppKit } from './dapp-kit';

function WalletStatus() {
	const account = useCurrentAccount();
	const dAppKit = useDAppKit();

	if (!account) {
		return <p>Connect your wallet to get started</p>;
	}

	async function handleTransfer() {
		const tx = new Transaction();
		tx.transferObjects([coinWithBalance({ balance: 1_000_000 })], account.address);
		const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

		if (result.FailedTransaction) {
			throw new Error(`Transaction failed: ${result.FailedTransaction.status.error?.message}`);
		}

		alert(`Transaction: ${result.Transaction.digest}`);
	}

	return (
		<div>
			<p>Connected: {account.address}</p>
			<button onClick={handleTransfer}>Send Transaction</button>
		</div>
	);
}

export default function WalletApp() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<ConnectButton />
			<WalletStatus />
		</DAppKitProvider>
	);
}