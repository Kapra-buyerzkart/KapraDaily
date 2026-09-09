import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getProfile } from '../api/services/userService';
import { getCachedProfile, setCachedProfile } from '../globals/storage';
import { logApi } from '../utils/apiLog';

interface UserContextType {
    profile: any | null;
    setProfile: (profile: any | null) => void;
    loadProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<any | null>(null);

    const loadProfile = async () => {
        try {
            const response = await getProfile();
            logApi('home/profile · response', response);
            if (response && response.success) {
                setProfile(response.data);
                await setCachedProfile(response.data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    useEffect(() => {
        const rehydrateSession = async () => {
            try {
                const cachedProfile = await getCachedProfile();
                if (cachedProfile) {
                    setProfile(cachedProfile);
                }
                await loadProfile();
            } catch (error) {
                console.error('Session rehydration error:', error);
            }
        };
        rehydrateSession();
    }, []);

    return (
        <UserContext.Provider value={{ profile, setProfile, loadProfile }}>
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
