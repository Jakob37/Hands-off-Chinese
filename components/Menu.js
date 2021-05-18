import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { audioLibraries } from "./Database";

// const audioLibraries;

const audioLibraryNames = Array.from(audioLibraries.keys());

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{paddingBottom: 20}}>
                {audioLibraryNames.map((name) => (
                    <TouchableOpacity>
                        <Text style={{paddingLeft: 24, fontWeight: "bold", fontSize:20}}>{name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}

export { Menu };