import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from './GlassCard';
import { formatEther } from 'ethers';
import { Gift, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface Transfer {
  amount: bigint;
  unlockTime: bigint;
  claimed: boolean;
}

interface ClaimSectionProps {
  myTransfer: Transfer | null;
  onClaim: (willAddress: string) => Promise<void>;
  onCheckTransfer: () => Promise<void>;
  loading: boolean;
  willAddress: string;
}

export function ClaimSection({ myTransfer, onClaim, onCheckTransfer, loading, willAddress }: ClaimSectionProps) {
  const [checkWillAddress, setCheckWillAddress] = useState(willAddress);

  const isClaimable = myTransfer && !myTransfer.claimed && 
    BigInt(Math.floor(Date.now() / 1000)) >= myTransfer.unlockTime;

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const getTimeRemaining = (unlockTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = Number(unlockTime) - now;
    if (diff <= 0) return 'Claimable now!';
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <GlassCard glow className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Gift className="w-5 h-5 text-primary" />
        Claim Your ETH
      </h3>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Will Contract Address</Label>
          <Input
            placeholder="0x..."
            value={checkWillAddress}
            onChange={(e) => setCheckWillAddress(e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>
        <Button variant="secondary" onClick={onCheckTransfer} className="w-full">
          Check My Transfer
        </Button>
      </div>

      {myTransfer && myTransfer.amount > 0n && (
        <div className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-2xl font-display font-bold text-primary glow-text">
              {formatEther(myTransfer.amount)} ETH
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Unlock Time
            </span>
            <span className="text-foreground">{formatTime(myTransfer.unlockTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={isClaimable ? 'text-primary' : 'text-muted-foreground'}>
              {myTransfer.claimed ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Claimed
                </span>
              ) : (
                getTimeRemaining(myTransfer.unlockTime)
              )}
            </span>
          </div>
          {isClaimable && !myTransfer.claimed && (
            <Button 
              onClick={() => onClaim(checkWillAddress)} 
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim ETH'
              )}
            </Button>
          )}
        </div>
      )}

      {myTransfer && myTransfer.amount === 0n && (
        <p className="text-muted-foreground text-center py-4">
          No pending transfers found for your address.
        </p>
      )}
    </GlassCard>
  );
}
