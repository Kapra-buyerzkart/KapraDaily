import { StyleSheet } from 'react-native';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.halfTransparent
    },
    indicatorContainer: {
        padding: 20,
        backgroundColor: colour.white,
        borderRadius: 10,
        shadowColor: colour.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});