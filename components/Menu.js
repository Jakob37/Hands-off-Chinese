import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AudioCard } from "./AudioCard";
import { audioLibraries } from "./Database";

// const audioLibraries;

const audioLibraryNames = Array.from(audioLibraries.keys());

const audioPaths = audioLibraries.get("exam_revision_3").audioPaths;

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currAudioPaths: audioPaths
        }
    }

    /**
     * @param {string} source 
     */
    renderCards(source) {
        const newAudioPaths = audioLibraries.get(source).audioPaths;
        this.setState({currAudioPaths: newAudioPaths});
    }

    render() {
        return (
            <View style={{paddingBottom: 20}}>
                {audioLibraryNames.map((name) => (
                    <TouchableOpacity onPress={() => this.renderCards(name)}>
                        <Text style={{paddingLeft: 24, fontWeight: "bold", fontSize:20}}>{name}</Text>
                    </TouchableOpacity>
                ))}
                {this.state.currAudioPaths.map((paths) => (
                    <AudioCard
                        label={paths.label}
                        english={paths.english}
                        chinese={paths.chinese}
                        key={paths.label}
                    ></AudioCard>
                ))}
            </View>
        );
    }
}

export { Menu };
