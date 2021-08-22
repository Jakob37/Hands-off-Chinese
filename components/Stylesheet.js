import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    containerTight: {
        marginTop: 3,
        marginBottom: 3,
        paddingHorizontal: 24,
    },
    header: {
        fontSize: 34,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: "bold"
    },
    cardText: {
        fontSize: 20,
        marginTop: 2,
        marginBottom: 2,
    },
    card: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    footerCard: {
        paddingTop: 4,
        marginTop: 8,
        marginBottom: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
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
