import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./Stylesheet";


const AudioPlayerCard = () => {
    return (
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <View>
                <Text style={{flex:2, padding:10, margin:10}}>Content</Text>
            </View>
            <View>
                <Text style={{flex:2, padding:10, margin:10}}>Content 2</Text>
            </View>
        </View>
    );
};

{/* <View style={{ flex: 2, flexDirection: "row", backgroundColor: "orange", padding: '10' }}>
<TouchableOpacity>
    <Text>Play</Text>
</TouchableOpacity>
</View>
<View>
<TouchableOpacity style={{ flex: 2, backgroundColor: "red" }}>
    <Text>Stop</Text>
</TouchableOpacity>
</View> */}

export { AudioPlayerCard };
