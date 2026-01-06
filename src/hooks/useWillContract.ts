import { useState, useCallback } from 'react';
import { Contract, parseEther, formatEther, JsonRpcSigner } from 'ethers';
import { WILL_FACTORY_ABI, WILL_FACTORY_ADDRESS, CLAIMABLE_ETH_PAY_ABI } from '@/lib/contracts';

interface Transfer {
  amount: bigint;
  unlockTime: bigint;
  claimed: boolean;
}

export function useWillContract(signer: JsonRpcSigner | null, address: string | null) {
  const [willAddress, setWillAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [myTransfer, setMyTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFactoryContract = useCallback(() => {
    if (!signer) return null;
    return new Contract(WILL_FACTORY_ADDRESS, WILL_FACTORY_ABI, signer);
  }, [signer]);

  const getWillContract = useCallback((willAddr: string) => {
    if (!signer) return null;
    return new Contract(willAddr, CLAIMABLE_ETH_PAY_ABI, signer);
  }, [signer]);

  const fetchWillAddress = useCallback(async () => {
    if (!address || !signer) return;
    
    try {
      const factory = getFactoryContract();
      if (!factory) return;
      
      const will = await factory.getWill(address);
      if (will !== '0x0000000000000000000000000000000000000000') {
        setWillAddress(will);
      }
    } catch (err: any) {
      console.error('Error fetching will:', err);
    }
  }, [address, signer, getFactoryContract]);

  const createWill = useCallback(async () => {
    if (!signer) return;
    setLoading(true);
    setError(null);

    try {
      const factory = getFactoryContract();
      if (!factory) throw new Error('Factory not available');

      const tx = await factory.createWill();
      await tx.wait();
      await fetchWillAddress();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to create will');
    } finally {
      setLoading(false);
    }
  }, [signer, getFactoryContract, fetchWillAddress]);

  const fetchBalance = useCallback(async () => {
    if (!willAddress || !signer) return;

    try {
      const will = getWillContract(willAddress);
      if (!will) return;

      const bal = await will.getBalance();
      setBalance(formatEther(bal));
    } catch (err: any) {
      console.error('Error fetching balance:', err);
    }
  }, [willAddress, signer, getWillContract]);

  const fetchMyTransfer = useCallback(async (willAddr: string) => {
    if (!willAddr || !signer) return;

    try {
      const will = getWillContract(willAddr);
      if (!will) return;

      const transfer = await will.getMyTransfer();
      if (transfer.amount > 0n) {
        setMyTransfer({
          amount: transfer.amount,
          unlockTime: transfer.unlockTime,
          claimed: transfer.claimed,
        });
      } else {
        setMyTransfer({ amount: 0n, unlockTime: 0n, claimed: false });
      }
    } catch (err: any) {
      console.error('Error fetching transfer:', err);
      setError('Failed to check transfer. Is this a valid Will contract?');
    }
  }, [signer, getWillContract]);

  const scheduleClaim = useCallback(async (recipient: string, delayMinutes: number, amountEth: string) => {
    if (!willAddress || !signer) return;
    setLoading(true);
    setError(null);

    try {
      const will = getWillContract(willAddress);
      if (!will) throw new Error('Will contract not available');

      const tx = await will.scheduleClaim(recipient, delayMinutes, {
        value: parseEther(amountEth),
      });
      await tx.wait();
      await fetchBalance();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to schedule claim');
    } finally {
      setLoading(false);
    }
  }, [willAddress, signer, getWillContract, fetchBalance]);

  const cancelClaim = useCallback(async (recipient: string) => {
    if (!willAddress || !signer) return;
    setLoading(true);
    setError(null);

    try {
      const will = getWillContract(willAddress);
      if (!will) throw new Error('Will contract not available');

      const tx = await will.cancelClaim(recipient);
      await tx.wait();
      await fetchBalance();
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to cancel claim');
    } finally {
      setLoading(false);
    }
  }, [willAddress, signer, getWillContract, fetchBalance]);

  const claim = useCallback(async (willAddr: string) => {
    if (!signer) return;
    setLoading(true);
    setError(null);

    try {
      const will = getWillContract(willAddr);
      if (!will) throw new Error('Will contract not available');

      const tx = await will.claim();
      await tx.wait();
      await fetchMyTransfer(willAddr);
    } catch (err: any) {
      setError(err.reason || err.message || 'Failed to claim');
    } finally {
      setLoading(false);
    }
  }, [signer, getWillContract, fetchMyTransfer]);

  return {
    willAddress,
    balance,
    myTransfer,
    loading,
    error,
    createWill,
    fetchWillAddress,
    fetchBalance,
    fetchMyTransfer,
    scheduleClaim,
    cancelClaim,
    claim,
    setError,
  };
}
