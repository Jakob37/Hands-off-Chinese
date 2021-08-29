const { styles } = require("../../../components/Stylesheet")
const React = require("react")
const { View, Text, TouchableOpacity } = require("react-native")

const openCategory = (category) => {
    console.log(`Opening category not implemented ${category}`);
}

const removeCategory = async (category) => {
    console.log(`Removing category not implemented ${category}`);
}

const CategoryCard = (param) => {
    return (
        <View style={
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

            <TouchableOpacity onPress={() => {
                removeCategory(param.category).then(param.endAction)
            }}>
                <View>
                    <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 24 }}>X</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}


export {
    CategoryCard,
};
