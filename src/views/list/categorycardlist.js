const React = require("react")
const { View } = require("react-native")
const { CategoryCard } = require("../card/CategoryCard")

const CategoryCardList = (param) => {
    return (
        <View>
            <View>
                {
                    param.categories.map((category, i) => {
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

export default CategoryCardList
