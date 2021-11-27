import { styles } from "../../style/Stylesheet";

const React = require("react")
const { View, Text, TouchableOpacity } = require("react-native")

const openCategory = (category) => {
    console.warn(`Opening category not implemented ${category}`);
}

const removeCategory = async (category) => {
    console.warn(`Removing category not implemented ${category}`);
}

const CategoryCard = (param) => {
    return (
        <View style = {
            [
                styles.card,
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }
            ]}>

            <View>
                <TouchableOpacity onPress={param.selectAction}>
                    <Text style={[styles.cardText, {fontSize: 30}]}>
                        {param.category}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export {
    CategoryCard,
};
