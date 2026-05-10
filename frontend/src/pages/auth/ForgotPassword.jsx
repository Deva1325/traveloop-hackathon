import { Link } from 'react-router-dom';
import { Map, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Map className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">Traveloop</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="you@example.com" />
            </div>

            <Button type="submit" className="w-full mt-6">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
