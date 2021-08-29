const React = require("react")
const { View, Text, TextInput } = require("react-native")

const AddCategoryMenu = (param) => {
    return (
        <View style={{ borderTopWidth: 1, borderTopColor: 'lightgray' }}>
            <View style={{
                paddingHorizontal: 16,
                marginBottom: 8,
                marginTop: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={{ fontSize: 16, flex: 1 }}>Category</Text>
                <TextInput style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    flex: 3
                }}
                    value={param.chineseText}
                    onChangeText={(text) => param.setCategoryText(text)}
                    placeholder="[Category]"
                ></TextInput>
            </View>
        </View>
    )
}

export default AddCategoryMenu;
