import { styles } from "../../style/Stylesheet";

const React = require("react")
const { View, Text, TouchableOpacity } = require("react-native")

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
