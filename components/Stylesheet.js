import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    linkContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    link: {
        flex: 2,
        fontSize: 18,
        fontWeight: "400",
        color: "black",
    },
    description: {
        flex: 3,
        paddingVertical: 16,
        fontWeight: "400",
        fontSize: 18,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
    },
});

export { styles };
