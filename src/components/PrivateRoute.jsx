// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css'

const PrivateRoute = ({ children }) => {
    const { session, loading } = useAuth();

    if (loading) return
    <div className="flex items-center justify-center h-screen">
        <Helix
            className="w-16 h-16"
            color="#4f46e5"
            speed={1}
            strokeWidth={2}
        />
    </div>;

    return session ? children : <Navigate to="/login" />;
};


export default PrivateRoute;
