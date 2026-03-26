import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const RESET_TOKEN = 'RESET_TOKEN';

export const setTokens = async (accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
};

export const getAccessToken = () =>
    AsyncStorage.getItem(ACCESS_TOKEN);

export const getRefreshToken = () =>
    AsyncStorage.getItem(REFRESH_TOKEN);

export const clearTokens = async () => {
    await AsyncStorage.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, RESET_TOKEN]);
};

export const setResetToken = async (resetToken) => {
    await AsyncStorage.setItem(RESET_TOKEN, resetToken);
};

export const getResetToken = () =>
    AsyncStorage.getItem(RESET_TOKEN);

export const clearResetToken = async () => {
    await AsyncStorage.removeItem(RESET_TOKEN);
};
