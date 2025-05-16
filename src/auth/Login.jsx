import React, { useContext, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Supabase } from '../../Supabase';
// import smartcity from '../assets/images/smartcity.jpg';
import smart2 from '../assets/images/smart2.png';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css';
import DetectionDataContext from '@/context/DetectionDataContext';
const Login = () => {
    const navigate = useNavigate();
    const { session, loading } = useAuth();
    const { state, dispatch } = useContext(DetectionDataContext);

    useEffect(() => {
        if (!loading && session) {
            function fetchUserProfile() {
                Supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .then(({ data, error }) => {
                        if (error) {
                            console.error(error);
                        } else {
                            dispatch({ type: 'SET_USER_PROFILE', payload: data });
                        }
                    });
            };
            fetchUserProfile();
            navigate('/');
        }
    }, [session, loading, navigate]);
    return (
        <>
            {
                loading ? (
                    <div className="flex items-center justify-center h-screen">
                        <Helix
                            className="w-16 h-16"
                            color="#4f46e5"
                            speed={1}
                            strokeWidth={2}
                        />
                    </div>
                ) : (
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

                            <Auth
                                supabaseClient={Supabase}
                                appearance={{
                                    theme: ThemeSupa,
                                    variables: {
                                        default: {
                                            colors: {
                                                brand: '#1B59F8',
                                                brandAccent: '#1B59F8',
                                            },
                                        },
                                    },
                                }}
                                providers={['google', 'github', 'facebook']}
                                socialLayout="horizontal"
                                showLinks={false}
                            />
                        </div>
                    </div>

                )
            }

        </>
    );
};

export default Login;
