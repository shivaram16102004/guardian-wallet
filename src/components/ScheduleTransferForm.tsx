import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from './GlassCard';
import { Send, Clock, User } from 'lucide-react';

interface ScheduleTransferFormProps {
  onSchedule: (recipient: string, delayMinutes: number, amount: string) => Promise<void>;
  loading: boolean;
}

export function ScheduleTransferForm({ onSchedule, loading }: ScheduleTransferFormProps) {
  const [recipient, setRecipient] = useState('');
  const [delay, setDelay] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !delay || !amount) return;
    await onSchedule(recipient, parseInt(delay), amount);
    setRecipient('');
    setDelay('');
    setAmount('');
  };

  return (
    <GlassCard className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Send className="w-5 h-5 text-primary" />
        Schedule ETH Transfer
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Recipient Address
          </Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-muted-foreground">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              min="0"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delay" className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Delay (minutes)
            </Label>
            <Input
              id="delay"
              type="number"
              min="1"
              placeholder="60"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading || !recipient || !delay || !amount} className="w-full">
          {loading ? 'Processing...' : 'Schedule Transfer'}
        </Button>
      </form>
    </GlassCard>
  );
}
