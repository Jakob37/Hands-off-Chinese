import { styles } from "../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { CategoryCard } from "../views/CategoryCard";

const Categories = (param) => {

    return (
        <View>
            <View>
                {
                    param.list.map((x, i) => {
                        return (
                            <CategoryCard key={i}
                                english={x[0]}
                                englishKey={x[1]}
                                chinese={x[2]}
                                chineseKey={x[3]}
                                endAction={param.endAction}
                            />
                        );
                    })
                    // Array(20).fill().map((x, i) => { return <CategoryCard title={`Card ${i+1}`} key={i} /> })
                }
            </View>
        </View>
    )

}

export { Categories };