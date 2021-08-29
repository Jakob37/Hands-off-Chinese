const { styles } = require("../../../components/Stylesheet")
const React = require("react")
const { View, Text } = require("react-native")

const CategoryCard = (param) => {
    return (
        <View style={styles.card}>
            <Text>Category card ({param.category})</Text>
        </View>
    )
}


export {
    CategoryCard,
};
