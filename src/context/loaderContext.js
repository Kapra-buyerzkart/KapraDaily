import React, { createContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { Modal, View, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const LoaderContext = createContext();

export const LoaderContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = (show) => {
        // console.log('show', show)
        setLoading(show);
    };
    const value = {
        showLoader,
        loading,
    };

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
