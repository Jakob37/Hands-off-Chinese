import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { AudioPlayer, playSound, testLoad } from "./AudioPlayer";
import { audioLibraries } from "./Database";
import { styles } from "./Stylesheet";

async function startPlaying() {
    if (audioPlayer != null) {
        audioPlayer.play();
    } else {
        console.log('No audio player loaded!');
    }
}

let audioPlayer = null;

function load() {
    console.log('Loading paths');
    const audioPaths = audioLibraries.get('exam_revision_3').pathPairs;
    audioPlayer = new AudioPlayer(/** @type {[string,string][]} */ (audioPaths));
}

function stopPlaying() {
    console.log('Stop playing');
    audioPlayer.stop();
}

// const increment = 1000;
// let delay = 3000;


const DisplayNumber = ({ number }) => {
    return (
        <View>
            <Text>{number}</Text>
        </View>
    )
} 

load();

class AudioPlayerCard extends React.Component {

    // state = {
    //     increment: 1000,
    //     delay: 3000
    // }

    constructor(props) {
        super(props);

        this.state = {
            increment: 1000,
            delay: 3000
        }
    }

    incrementDelay(diff) {
        const newDelay = this.state.delay + diff;
        console.log('new delay', newDelay);
        this.setState({delay: newDelay});
        // this.state.delay += diff;
        if (newDelay < 0) {
            // this.state.delay = 0;
            this.setState({delay: 0});
        }
        console.log('Changing delay to:', newDelay);
        audioPlayer.setDelay(this.state.delay);
    }
    
    render() {
        return (
            <View>
                <View style={[{flexDirection:'row', alignItems:'center'}, styles.container]}>
                    <TouchableOpacity onPress={load}>
                        <Text style={{flex:2, marginRight:10}}>Load</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={startPlaying}>
                        <Text style={{flex:2, marginRight:10}}>Play</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={stopPlaying}>
                        <Text style={{flex:2}}>Stop</Text>
                    </TouchableOpacity>
                </View>
                <View style={[{flexDirection:'row', alignItems:'center'}, styles.container]}>
                    <TouchableOpacity onPress={() => { this.incrementDelay(this.state.increment)}}>
                        <Text style={{marginRight:10}}>Increase delay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.incrementDelay(-this.state.increment)}}>
                        <Text style={{marginRight:10}}>Reduce delay</Text>
                    </TouchableOpacity>
                    <View>
                        <Text>Delay: {this.state.delay}</Text>
                    </View>
                </View>
            </View>
        );
    }
};

export { AudioPlayerCard };
