import { styles } from "../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { CategoryCard } from "../views/CategoryCard";

const Categories = () => {

    return (
        <View>
            <View>
                {
                    Array(20).fill().map((x, i) => { return <CategoryCard title={`Card ${i}`} /> })
                }
            </View>
        </View>
    )

}

export { Categories };