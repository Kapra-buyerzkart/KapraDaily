import React, { createContext } from 'react';
import { StyleSheet, View } from 'react-native';
import LuxuryLoader from '../../components/LuxuryLoader';

export const LoaderContext = createContext<any>(null);

export const LoaderContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [loadingCount, setLoadingCount] = React.useState(0);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const showLoader = React.useCallback((show: boolean) => {
        setLoadingCount(prev => {
            const nextCount = show ? prev + 1 : Math.max(0, prev - 1);

            if (show && nextCount === 1) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setLoadingCount(0);
                }, 15000);
            }

            if (nextCount === 0 && timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            return nextCount;
        });
    }, []);

    const loading = loadingCount > 0;

    const value = React.useMemo(() => ({
        showLoader,
        loading,
    }), [showLoader, loading]);

    return (
        <View style={styles.root}>
            <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
            {loading && (
                <View style={styles.overlay} pointerEvents="auto">
                    <LuxuryLoader />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        elevation: 9999,
    },
});
