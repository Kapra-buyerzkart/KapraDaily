import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import CustomAlert from '../components/Alert';

interface AlertButton {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface AlertConfig {
    title: string;
    message: string;
    buttons?: AlertButton[];
}

interface AlertContextType {
    showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({ title: '', message: '' });

    const showAlert = useCallback((title: string, message?: string, buttons?: AlertButton[]) => {
        setAlertConfig({
            title,
            message: message || '',
            buttons: buttons || [{ text: 'OK', onPress: () => closeAlert() }]
        });
        setIsVisible(true);
    }, []);

    const closeAlert = useCallback(() => {
        setIsVisible(false);
    }, []);

    const displayButtons = alertConfig.buttons?.length
        ? alertConfig.buttons
        : [{ text: 'OK', onPress: closeAlert }];

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <CustomAlert
                isVisible={isVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={displayButtons}
                onClose={closeAlert}
            />
        </AlertContext.Provider>
    );
};

export const useCustomAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useCustomAlert must be used within an AlertProvider');
    }
    return context;
};
