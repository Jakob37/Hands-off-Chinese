const React = require("react")
const { View, Text, TextInput } = require("react-native")

const AudioCardList = (param) => {
    return (
        <View>
        <View style={{
            paddingHorizontal: 16,
            marginBottom: 8,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Text style={{ fontSize: 16, flex: 1 }}>Chinese</Text>
            <TextInput style={{
                borderWidth: 1,
                borderColor: 'gray',
                flex: 3
            }}
                value={param.chineseText}
                onChangeText={(text) => param.setChineseText(text)}
                placeholder="Chinese text"
            ></TextInput>
        </View>
        <View style={{
            paddingHorizontal: 16,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Text style={{ fontSize: 16, flex: 1 }}>English</Text>
            <TextInput style={{
                borderWidth: 1,
                borderColor: 'gray',
                flex: 3
            }}
                value={param.englishText}
                onChangeText={(text) => param.setEnglishText(text)}
                placeholder="English test"
            ></TextInput>
        </View>
    </View>
    )
}

export default AudioCardList;
