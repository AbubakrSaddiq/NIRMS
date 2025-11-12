
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Role } from '../types';
import { ROLES } from '../services/mockApi';
import { AnchorIcon, Spinner } from './Icons';

type AuthView = 'login' | 'signup' | 'forgot';

const AuthPage: React.FC = () => {
    const [view, setView] = useState<AuthView>('login');
    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        try {
            const user = await login(email, password);
            if (user) {
                navigate('/dashboard');
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const role = formData.get('role') as Role;
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        try {
            const user = await signup(name, email, role);
            if (user) {
                navigate('/dashboard');
            } else {
                setError('Could not create account.');
            }
        } catch (err) {
            setError('An unexpected error occurred during signup.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        setTimeout(() => {
            setMessage('If an account exists for this email, a password reset link has been sent.');
            setLoading(false);
        }, 1500);
    };

    const renderForm = () => {
        switch (view) {
            case 'login':
                return (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
                            <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green sm:text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button type="button" onClick={() => setView('forgot')} className="font-medium text-nimasa-green hover:text-teal-400">Forgot your password?</button>
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nimasa-green hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-nimasa-blue focus:ring-teal-500 disabled:opacity-50">
                                {loading ? <Spinner className="w-5 h-5" /> : 'Sign in'}
                            </button>
                        </div>
                    </form>
                );
            case 'signup':
                return (
                     <form onSubmit={handleSignup} className="space-y-4">
                        <input name="name" type="text" placeholder="Full Name" required className="block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green" />
                        <input name="email" type="email" placeholder="Email Address" required className="block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green" />
                        <select name="role" required className="block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green">
                            <option value="">Select Role</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <input name="password" type="password" placeholder="Password (min 8 characters)" required className="block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green" />
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" required className="block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green" />
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nimasa-green hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-nimasa-blue focus:ring-teal-500 disabled:opacity-50">
                            {loading ? <Spinner className="w-5 h-5" /> : 'Create Account'}
                        </button>
                    </form>
                );
            case 'forgot':
                return (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <p className="text-gray-300 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                        <input name="email" type="email" placeholder="Email Address" required className="block w-full px-3 py-2 bg-nimasa-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green" />
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nimasa-green hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-nimasa-blue focus:ring-teal-500 disabled:opacity-50">
                            {loading ? <Spinner className="w-5 h-5" /> : 'Send Reset Link'}
                        </button>
                    </form>
                );
        }
    };

    const titleMap: Record<AuthView, string> = {
        login: "Sign in to your account",
        signup: "Create a new account",
        forgot: "Reset your password"
    };

    const switchTextMap: Record<AuthView, { text: string; link: string; view: AuthView }> = {
        login: { text: "Don't have an account?", link: "Sign up", view: 'signup' },
        signup: { text: "Already have an account?", link: "Sign in", view: 'login' },
        forgot: { text: "Remember your password?", link: "Sign in", view: 'login' }
    };

    return (
        <div className="min-h-screen bg-nimasa-blue flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/wave-grid.png')]">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <AnchorIcon className="mx-auto h-12 w-auto text-nimasa-green animate-pulse-subtle" />
                <h1 className="mt-6 text-3xl font-extrabold text-white">NIMASA Intelligent Report Management System</h1>
                <p className="mt-2 text-sm text-gray-300">‘From Reports to Intelligence — Powered by NIRMS.’</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-nimasa-dark/50 backdrop-blur-sm py-8 px-4 shadow-2xl shadow-black/30 sm:rounded-lg sm:px-10 border border-nimasa-green/20">
                    <h2 className="mb-6 text-center text-xl font-bold text-white">{titleMap[view]}</h2>
                    {error && <p className="mb-4 text-center text-sm text-red-400 bg-red-900/50 p-2 rounded-md">{error}</p>}
                    {message && <p className="mb-4 text-center text-sm text-green-300 bg-green-900/50 p-2 rounded-md">{message}</p>}
                    {renderForm()}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-nimasa-dark text-gray-400">Or</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-300">
                                {switchTextMap[view].text}{' '}
                                <button onClick={() => { setView(switchTextMap[view].view); setError(null); setMessage(null); }} className="font-medium text-nimasa-green hover:text-teal-400">
                                    {switchTextMap[view].link}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
