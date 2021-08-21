import { styles } from "../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { CategoryCard } from "../views/CategoryCard";

const Categories = () => {

    return (
        <View>
            <View>
                <CategoryCard title='Card1' />
                <CategoryCard title='Card2' />
                <CategoryCard title='Card3' />
                <CategoryCard title='Card4' />
                <CategoryCard title='Card5' />
            </View>
            {/* <View>
                <Text style={styles.footerCard}>Add Category</Text>
            </View> */}
        </View>
    )

}

export { Categories };