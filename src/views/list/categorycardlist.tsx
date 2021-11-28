const React = require("react")
const { View } = require("react-native")
const { CategoryCard } = require("../card/categorycard")

interface Param {
    displayCategories: string[],
    categories: string[],
    selectAction: (category:string) => void
}

const CategoryCardList = (param: Param) => {
    return (
        <View>
            {param.displayCategories.map((displayCategory, i) => {
                return (
                    <CategoryCard
                        key={i}
                        category={displayCategory}
                        selectAction={() => { 
                            const category = param.categories[i];
                            param.selectAction(category) 
                        }}
                    />
                )
            })}
        </View>
    )
}

export default CategoryCardList
