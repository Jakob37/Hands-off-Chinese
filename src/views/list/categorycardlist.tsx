import React from 'react'
import { View } from 'react-native'
import { HocDb } from '../../backend/database'
import { CategoryCard } from '../card/categorycard'

interface Param {
    currentCategories: string[]
    categories: string[]
    selectCategoryAction: (category: string) => void
    db: HocDb
}

const CategoryCardList = (param: Param) => {
    return (
        <View>
            {param.currentCategories.map((displayCategory, i) => {
                return (
                    <CategoryCard
                        key={i}
                        displayCategory={
                            displayCategory +
                            ' (' +
                            param.db.getAudioEntries(displayCategory).length +
                            ')'
                        }
                        selectAction={() => {
                            const category = param.categories[i]
                            param.selectCategoryAction(category)
                        }}
                    />
                )
            })}
        </View>
    )
}

export default CategoryCardList
