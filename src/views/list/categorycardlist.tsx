const React = require("react")
const { View } = require("react-native")
const { CategoryCard } = require("../card/categorycard")

interface Param {
    currentCategories: string[],
    categories: string[],
    selectCategoryAction: (category:string) => void
}

const CategoryCardList = (param: Param) => {
    return (
        <View>
            {param.currentCategories.map((displayCategory, i) => {
                return (
                    <CategoryCard
                        key={i}
                        category={displayCategory}
                        selectAction={() => { 
                            const category = param.categories[i];
                            param.selectCategoryAction(category) 
                        }}
                    />
                )
            })}
        </View>
    )
}

export default CategoryCardList
