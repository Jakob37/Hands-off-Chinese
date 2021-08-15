import React, { Component } from "react";
import { View, Text } from "react-native";

const listEntries = ['Entry 1', 'Entry 2', 'Entry 3'];

class ListS3Content extends Component {

    render() {
        return (
            <View>
                {listEntries.map((entry) => <Text key={entry}>{entry}</Text> )}
            </View>
        );
    }
}

export { ListS3Content };
