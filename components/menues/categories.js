import { styles } from "../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { CategoryCard } from "../views/CategoryCard";

const Categories = (param) => {

    return (
        <View>
            <View>
                {
                    param.list.map((x, i) => { return <CategoryCard title={x} key={i} /> })
                    // Array(20).fill().map((x, i) => { return <CategoryCard title={`Card ${i+1}`} key={i} /> })
                }
            </View>
        </View>
    )

}

export { Categories };