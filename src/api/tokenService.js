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

// const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicGhvbmUiOiI4MTM3OTU2NTc0IiwianRpIjoiZjM3MDY0YzctNDhkNy00YjdiLTlhOTEtNDY0ZWQ1NWU0M2I0IiwiZXhwIjoxNzkyNTA3MjcwLCJpc3MiOiJLYXByYURhaWx5QVBJIiwiYXVkIjoiS2FwcmFEYWlseUFQSVVzZXJzIn0.QqTMt5BOQvCl0x2iRXi24AveGKlhlEP47m2J6eA1Okk';

export const getAccessToken = async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return token;
};

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
