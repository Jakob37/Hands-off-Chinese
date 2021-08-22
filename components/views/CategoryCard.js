import { styles } from "../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";

const CategoryCard = (params) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity>
                <Text style={styles.cardText}>
                    {params.chinese}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.cardText}>
                    {params.english}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export { CategoryCard };
