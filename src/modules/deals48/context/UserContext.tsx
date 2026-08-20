import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
type User = any;

import * as NavigationService from '../api/NavigationService';
import {
    getCachedProfile,
    setCachedProfile,
    clearCachedProfile,
} from '../globals/storage';

import { getProfile } from '../api/services';
import { getAccessToken, clearTokens } from '../api/services/tokenService';
import { ensureDeals48Session } from '../api/session';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    profile: any | null;
    setProfile: (profile: any | null) => void;
    loadProfile: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);

    const loadProfile = async () => {
        try {
            const response = await getProfile();
            if (response && response.success) {
                setProfile(response.data);
                setUser({ loggedIn: true });
                await setCachedProfile(response.data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    useEffect(() => {
        const rehydrateSession = async () => {
            try {
                await ensureDeals48Session();
                const token = await getAccessToken();
                if (token) {
                    const cachedProfile = await getCachedProfile();
                    if (cachedProfile) {
                        const parsedProfile = JSON.parse(cachedProfile);
                        setProfile(parsedProfile);
                        setUser({ loggedIn: true });
                    }
                    await loadProfile();
                }
            } catch (error) {
                console.error('Session rehydration error:', error);
            }
        };
        rehydrateSession();
    }, []);

    const logout = async () => {
        try {
            await clearTokens();
            await clearCachedProfile();
            setUser(null);
            setProfile(null);
            NavigationService.reset(NavigationService.AUTH_FALLBACK_ROUTE);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, profile, setProfile, loadProfile, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
