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

const CategoryCardList = (param) => {
    return (
        <View>
            <View>
                {
                    param.list.map((category, i) => {
                        return (
                            <CategoryCard key={i}
                                category={category}
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

export {
    CategoryCard,
    CategoryCardList
};
