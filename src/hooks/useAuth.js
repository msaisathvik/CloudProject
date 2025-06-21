// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { AuthService } from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Get current user
        const currentUser = AuthService.getCurrentUser();
        if (mounted) {
            setUser(currentUser);
            setLoading(false);
        }

        // Listen to auth state changes
        const unsubscribe = AuthService.onAuthStateChange((user) => {
            if (mounted) {
                setUser(user);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    return { user, session: user, loading };
};
