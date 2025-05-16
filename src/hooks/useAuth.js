// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { Supabase } from '../../Supabase';

export const useAuth = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        Supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                setSession(session);
                setLoading(false);
            }
        });

        const { data: listener } = Supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) setSession(session);
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);


    return { session, loading };
};
