import React from 'react'
import { View } from 'react-native'
import { HocDb } from '../../backend/database'
import { BasicCard } from '../card/basiccard'

interface Param {
    currentCategories: string[]
    categories: string[]
    selectCategoryAction: (category: string) => void
    db: HocDb
}

const CategoryCardList = (param: Param) => {
    return (
        <View style={{marginVertical: 0, paddingVertical: 0}}>
            {param.currentCategories.map((displayCategory, i) => {
                return (
                    <BasicCard
                        key={i}
                        text={`${displayCategory}  (${
                            param.db.getAudioEntries(displayCategory).length
                        })`}
                        action={() => {
                            const category = param.categories[i]
                            param.selectCategoryAction(category)
                        }}
                    ></BasicCard>
                )
            })}
        </View>
    )
}

export default CategoryCardList
