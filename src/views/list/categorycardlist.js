const React = require("react")
const { View } = require("react-native")
const { CategoryCard } = require("../card/categorycard")

const CategoryCardList = (param) => {
    return (
        <View>
            {
                param.categories.map((category, i) => {
                    return (
                        <CategoryCard key={i}
                            category={category}
                            selectAction={param.selectAction}
                        />
                    )
                })
            }
        </View>
    )
}

export default CategoryCardList
