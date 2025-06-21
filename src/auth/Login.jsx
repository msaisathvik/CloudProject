import React, { useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import smart2 from '../assets/images/smart2.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css';
import DetectionDataContext from '@/context/DetectionDataContext';

const Login = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { state, dispatch } = useContext(DetectionDataContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            // User is already logged in, navigate to dashboard
            navigate('/');
        }
    }, [user, loading, navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError('');

        try {
            let result;
            if (isSignUp) {
                result = await AuthService.signUp(email, password, displayName);
            } else {
                result = await AuthService.signIn(email, password);
            }

            if (result.error) {
                setAuthError(result.error);
            } else {
                // Success - user will be redirected by useEffect
                console.log('Authentication successful');
            }
        } catch (error) {
            setAuthError('An unexpected error occurred');
            console.error('Auth error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setAuthError('');
        
        try {
            const result = await AuthService.signInWithGoogle();
            
            if (result.error) {
                setAuthError(result.error);
            } else {
                // Success - user will be redirected by useEffect
                console.log('Google authentication successful');
            }
        } catch (error) {
            setAuthError('An unexpected error occurred during Google sign-in');
            console.error('Google auth error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Helix
                    className="w-16 h-16"
                    color="#4f46e5"
                    speed={1}
                    strokeWidth={2}
                />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center md:justify-end md:px-20 overflow-hidden">
            {/* Background Image */}
            <img
                src={smart2}
                alt="Smart City UET Peshawar"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10" />

            {/* Headline Content */}
            <div className="absolute z-20 left-6 md:left-16 top-20 md:top-32 max-w-xl text-[#f8f8f8de]">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                    Every Second Counts,Detect Threats <br /> Before They Become Disasters
                </h1>
                <p className="text-lg md:text-xl font-medium drop-shadow-md">
                    Act fast. Save lives. Minimize damage.
                </p>
            </div>

            {/* Auth Card */}
            <div className="relative z-30 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 m-4 md:ml-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome to Smart City
                </h2>

                <form onSubmit={handleAuth} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your name"
                                required={isSignUp}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {authError && (
                        <div className="text-red-600 text-sm text-center">
                            {authError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Helix size="20" color="white" speed={1} />
                        ) : (
                            isSignUp ? 'Sign Up' : 'Sign In'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Helix size="20" color="#374151" speed={1} />
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>

                {!isSignUp && (
                    <div className="mt-2 text-center">
                        <button
                            onClick={() => {
                                // Implement password reset
                                setAuthError('Password reset not implemented yet');
                            }}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
