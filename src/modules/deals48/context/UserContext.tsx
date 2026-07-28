import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import User from '../database/models/User';
type User = any;

import * as NavigationService from '../api/NavigationService';
import {
    getCachedProfile,
    setCachedProfile,
    clearCachedProfile,
} from '../globals/storage';

import { getProfile } from '../api/services';
import { getAccessToken, clearTokens } from '../api/services/tokenService';

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
                setUser({ loggedIn: true }); // Set user as logged in
                await setCachedProfile(response.data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    useEffect(() => {
        const rehydrateSession = async () => {
            try {
                const token = await getAccessToken();
                if (token) {
                    // Try to load cached profile first for immediate UI
                    const cachedProfile = await getCachedProfile();
                    if (cachedProfile) {
                        const parsedProfile = JSON.parse(cachedProfile);
                        setProfile(parsedProfile);
                        setUser({ loggedIn: true });
                    }
                    // Then refresh from server
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
            // Deliberately not clearing pincodeAreaId: it belongs to the host
            // app and is shared across services, so signing out of 48hrs must
            // not wipe the user's delivery area everywhere else.
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
