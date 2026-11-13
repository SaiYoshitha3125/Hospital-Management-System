import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginDemo } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login successful!');
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = (role: 'patient' | 'doctor') => {
        loginDemo(role);
        toast.success(`Welcome! Logged in as demo ${role}.`);
        navigate(from, { replace: true });
    };

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-muted/30 to-background px-4 py-10">
            <div className="w-full max-w-md space-y-5">
                <Card className="p-8 bg-card border border-border/50 shadow-xl rounded-3xl">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-soft mb-4">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground">Welcome Back</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Sign in to access your medical dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                                <Mail className="h-3.5 w-3.5 text-primary" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold">
                                <Lock className="h-3.5 w-3.5 text-primary" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold shadow-soft"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="text-center space-y-3 pt-1">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                            </p>
                        </div>
                    </form>
                </Card>

                {/* Demo Login Card */}
                <Card className="p-5 bg-card border border-border/50 shadow-card rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-bold text-foreground">Try Without Registration</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleDemoLogin('patient')}
                            className="rounded-xl h-10 text-sm font-semibold border-2 hover:border-primary hover:bg-primary/5"
                        >
                            👤 Patient Demo
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleDemoLogin('doctor')}
                            className="rounded-xl h-10 text-sm font-semibold border-2 hover:border-primary hover:bg-primary/5"
                        >
                            🩺 Doctor Demo
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                        Demo accounts let you explore all features instantly
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Login;
