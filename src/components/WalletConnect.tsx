'use client';

import { ConnectButton } from '@mysten/dapp-kit';

export function WalletConnect() {
    return (
        <div className="rounded-lg overflow-hidden">
            <ConnectButton />
        </div>
    );
}
