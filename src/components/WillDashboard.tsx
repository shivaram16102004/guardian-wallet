import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from './GlassCard';
import { ScheduleTransferForm } from './ScheduleTransferForm';
import { ClaimSection } from './ClaimSection';
import { useWillContract } from '@/hooks/useWillContract';
import { JsonRpcSigner } from 'ethers';
import { FileText, Wallet, Copy, Check, Loader2, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WillDashboardProps {
  signer: JsonRpcSigner | null;
  address: string | null;
}

export function WillDashboard({ signer, address }: WillDashboardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [cancelRecipient, setCancelRecipient] = useState('');
  
  const {
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
  } = useWillContract(signer, address);

  useEffect(() => {
    if (signer && address) {
      fetchWillAddress();
    }
  }, [signer, address, fetchWillAddress]);

  useEffect(() => {
    if (willAddress) {
      fetchBalance();
    }
  }, [willAddress, fetchBalance]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      setError(null);
    }
  }, [error, toast, setError]);

  const copyAddress = () => {
    if (willAddress) {
      navigator.clipboard.writeText(willAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Will contract address copied to clipboard',
      });
    }
  };

  const handleCancelClaim = async () => {
    if (!cancelRecipient) return;
    await cancelClaim(cancelRecipient);
    setCancelRecipient('');
    toast({
      title: 'Success',
      description: 'Transfer cancelled successfully',
    });
  };

  if (!willAddress) {
    return (
      <div className="max-w-md mx-auto">
        <GlassCard glow className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Create Your Will Contract
          </h2>
          <p className="text-muted-foreground mb-6">
            Deploy your personal smart contract to schedule time-locked ETH transfers to beneficiaries.
          </p>
          <Button onClick={createWill} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deploying...
              </>
            ) : (
              'Create Will Contract'
            )}
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Will Info Header */}
      <GlassCard className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-1">Your Will Contract</h2>
            <div className="flex items-center gap-2">
              <code className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">
                {willAddress.slice(0, 10)}...{willAddress.slice(-8)}
              </code>
              <Button variant="ghost" size="icon" onClick={copyAddress} className="h-8 w-8">
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Contract Balance</p>
              <p className="text-2xl font-display font-bold text-primary glow-text">{balance} ETH</p>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchBalance}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Main Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <ScheduleTransferForm onSchedule={scheduleClaim} loading={loading} />
        
        <ClaimSection
          myTransfer={myTransfer}
          onClaim={claim}
          onCheckTransfer={fetchMyTransfer}
          loading={loading}
          willAddress={willAddress}
        />
      </div>

      {/* Cancel Transfer */}
      <GlassCard className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-destructive" />
          Cancel Scheduled Transfer
        </h3>
        <div className="flex gap-4">
          <Input
            placeholder="Recipient address to cancel"
            value={cancelRecipient}
            onChange={(e) => setCancelRecipient(e.target.value)}
            className="flex-1 bg-secondary/50 border-border/50"
          />
          <Button 
            variant="destructive" 
            onClick={handleCancelClaim}
            disabled={loading || !cancelRecipient}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
