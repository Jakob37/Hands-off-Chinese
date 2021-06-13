import { default as Sound } from "react-native-sound";
import React, { Component } from "react";
import { View, Text, Button } from "react-native";

// Sound.setCategory("PlayAndRecord");

// Cognito_HandsOffChineseUnauth_Role

// // Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'eu-north-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'eu-north-1:e0345c02-ad0c-400b-ad11-e9547fde04f9',
// });

// const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
// console.timeLog(CognitoIdentityClient);

class TestCard extends Component {
    playTrack = () => {
        // const track = new Sound('e1_chinese.mp3', Sound.MAIN_BUNDLE, (e) => {
        const track = new Sound('testsound.309bc55b-b25e-4641-8d24-04639818e4f3.mp3', 'https://hands-off-chinese.s3.eu-north-1.amazonaws.com', (e) => {
            if (e) {
                console.log('error loading track:', e)
            } else {
                track.play()
            }
        })
    }

    render() {
        return <Button title="play me" onPress={this.playTrack} />
    }
}

export { TestCard };
