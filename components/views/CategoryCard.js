import { styles } from "../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";

const CategoryCard = (params) => {
    return (
        <TouchableOpacity>
            <Text style={styles.card}>
                Title: {params.title}
            </Text>
        </TouchableOpacity>
    );
}

export { CategoryCard };
