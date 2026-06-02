import React, { createContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { Modal, View, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const LoaderContext = createContext();

export const LoaderContextProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = React.useState(0);
    const timeoutRef = React.useRef(null);

    const showLoader = React.useCallback((show) => {
        setLoadingCount(prev => {
            const nextCount = show ? prev + 1 : Math.max(0, prev - 1);
`);

            // Safety: If count goes from 0 to 1, start a global timeout
            if (show && nextCount === 1) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setLoadingCount(0);
                }, 15000); // 15s absolute timeout for any operation
            }

            // If count goes to 0, clear timeout
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
        <>
            <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
            {loading && (
                <Modal transparent visible={loading}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,.7)',
                            //marginBottom: windowHeight * (8 / 100),
                        }}>
                        <LottieView
                            source={require('../assets/Lottie/CartLoader1.json')}
                            style={{
                                height: windowWidth * (40 / 100),
                                width: windowWidth * (40 / 100),
                            }}
                            autoPlay
                            loop
                        />
                        {/* <View style={{backgroundColor:colours.primaryWhite, borderRadius:5, padding:10, elevation:5}}>
                <ActivityIndicator size="large" color={colours.primaryColor} />
              </View> */}
                    </View>
                </Modal>
            )}
        </>
    );
};
