const styleConstants = {
    colors: {
        red: '#E27D60',
        blue: '#85CDCA',
        yellow: '#E8A87C',
        purple: '#C38D9E',
        green: '#41B3A3',
        white: '#FFFFFF',
        black: '#3A3B3C',
    },
    fontSizes: {
        cardLarge: 20,
        cardMedium: 16,
    },
    iconSizes: {
        medium: 20,
        large: 30,
    },
    iconPaddings: {
        medium: 20,
    },
    componentMargins: {
        small: 5,
        medium: 10,
        large: 20,
    },
}

const styleLibrary = {
    card: {
        marginVertical: styleConstants.componentMargins.small,
    },
}

export { styleConstants, styleConstants as sc, styleLibrary, styleLibrary as sl }
