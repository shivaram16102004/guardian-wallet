import { WalletButton } from '@/components/WalletButton';
import { WillDashboard } from '@/components/WillDashboard';
import { GlassCard } from '@/components/GlassCard';
import { useWallet } from '@/hooks/useWallet';
import { Shield, Zap, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { address, signer, isConnecting, connect, disconnect, error, isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-border">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">ETHWill</span>
          </div>
          <WalletButton
            address={address}
            isConnecting={isConnecting}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-center">
            {error}
          </div>
        )}

        {!isConnected ? (
          /* Hero Section */
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              Secure Time-Locked ETH Transfers
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Your Digital
              <span className="text-primary glow-text block mt-2">Estate Manager</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Schedule ETH transfers with customizable time locks. Perfect for inheritance, vesting schedules, or delayed payments.
            </p>
            
            <Button onClick={connect} size="lg" className="gap-2 text-lg px-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-20">
              {[
                { icon: Shield, title: 'Secure', desc: 'Your own smart contract, fully owned by you' },
                { icon: Clock, title: 'Time-Locked', desc: 'Set custom unlock delays for each transfer' },
                { icon: Zap, title: 'Instant Claims', desc: 'Recipients claim directly on-chain' },
              ].map((feature, i) => (
                <GlassCard 
                  key={feature.title} 
                  className="text-center animate-fade-in hover:scale-105 transition-transform"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          <WillDashboard signer={signer} address={address} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Built with ❤️ on Ethereum • Deploy your contracts and update the factory address
        </div>
      </footer>
    </div>
  );
};

export default Index;
