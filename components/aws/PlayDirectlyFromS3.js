import React, { Component } from "react";
import { Button } from "react-native";
import { default as Sound } from "react-native-sound";

class PlayDirectlyFromS3 extends Component {
    playTrack = () => {
        const track = new Sound('testsound.309bc55b-b25e-4641-8d24-04639818e4f3.mp3', 'https://hands-off-chinese.s3.eu-north-1.amazonaws.com', (e) => {
            if (e) {
                console.log('error loading track:', e)
            } else {
                track.play()
            }
        })
    }

    render() {
        return <Button title="Play hard-coded from S3" onPress={this.playTrack} />
    }
}

export { PlayDirectlyFromS3 };
