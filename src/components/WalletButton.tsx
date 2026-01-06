import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';

interface WalletButtonProps {
  address: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({ address, isConnecting, onConnect, onDisconnect }: WalletButtonProps) {
  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-medium text-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDisconnect} className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onConnect} disabled={isConnecting} className="gap-2">
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
