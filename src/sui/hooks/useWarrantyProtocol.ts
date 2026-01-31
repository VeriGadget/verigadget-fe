import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MARKETPLACE_MODULE, MOCK_USDC_TYPE, MINT_CAP_ID } from '../config';

export function useWarrantyProtocol() {
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const createItem = async (name: string, description: string, imageUrl: string, price: number) => {
        if (!account) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MARKETPLACE_MODULE}::create_item`,
            arguments: [
                tx.pure.string(name),
                tx.pure.string(description),
                tx.pure.string(imageUrl),
                tx.pure.u64(price),
            ],
            typeArguments: [MOCK_USDC_TYPE],
        });

        return new Promise((resolve, reject) => {
             signAndExecuteTransaction(
                { transaction: tx as any },
                {
                    onSuccess: (result) => {
                        console.log('Item created:', result);
                        resolve(result);
                    },
                    onError: (error) => {
                        console.error('Error creating item:', error);
                        reject(error);
                    }
                }
            );
        });
    };

    const lockFunds = async (itemId: string, price: number, paymentCoinId: string, coinType: string = MOCK_USDC_TYPE) => {
        if (!account) return;
        const tx = new Transaction();
        
        // This assumes the user has a single coin object with enough balance or functionality to merge/split.
        // For MOCK_USDC, we typically expect the user to have a coin object.
        // In a real app, we might need to handle coin selection more robustly (e.g. merging coins).
        
        // Split exact amount from the provided payment coin
        const [payment] = tx.splitCoins(tx.object(paymentCoinId), [tx.pure.u64(price)]);

        tx.moveCall({
            target: `${PACKAGE_ID}::${MARKETPLACE_MODULE}::lock_funds`,
            arguments: [
                tx.object(itemId),
                payment,
            ],
            typeArguments: [coinType],
        });

        return new Promise((resolve, reject) => {
            signAndExecuteTransaction(
                { transaction: tx as any }, 
                {
                    onSuccess: (result) => {
                        console.log('Funds locked:', result);
                        resolve(result);
                    },
                     onError: (error) => {
                        console.error('Error locking funds:', error);
                        reject(error);
                    }
                }
            );
        });
    };

    const finalizeAndSplit = async (itemId: string, amountForSeller: number, coinType: string = MOCK_USDC_TYPE) => {
        if (!account) return;
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MARKETPLACE_MODULE}::finalize_and_split`,
            arguments: [
                tx.object(itemId),
                tx.pure.u64(amountForSeller),
            ],
            typeArguments: [coinType],
        });

        return new Promise((resolve, reject) => {
            signAndExecuteTransaction(
                { transaction: tx as any },
                {
                     onSuccess: (result) => {
                        console.log('Transaction finalized:', result);
                        resolve(result);
                    },
                     onError: (error) => {
                        console.error('Error finalizing:', error);
                        reject(error);
                    }
                }
            );
        });
    };
    
    // Add mint function for testing with Mock USDC
    // Mint MOCK USDC using the public Faucet
    const mintMockUsdc = async (amount: number) => {
         if (!account) return;
         const tx = new Transaction();
         tx.moveCall({
             target: `${PACKAGE_ID}::mock_usdc::faucet`,
             arguments: [
                 tx.object(MINT_CAP_ID),
                 tx.pure.u64(amount),
             ],
         });

         return new Promise((resolve, reject) => {
             signAndExecuteTransaction(
                 { transaction: tx as any },
                 {
                     onSuccess: (result) => resolve(result),
                     onError: (error) => reject(error),
                 }
             );
         });
    };

    return { createItem, lockFunds, finalizeAndSplit, mintMockUsdc };
}
