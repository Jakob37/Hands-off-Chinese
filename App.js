import React from "react";
import { Button, SafeAreaView, ScrollView, StatusBar, TextInput, View, Text } from "react-native";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { PlayDirectlyFromS3 } from "./components/aws/PlayDirectlyFromS3";
import { ListS3Content } from "./components/aws/ListS3Content";

import Amplify, { Storage } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import { Categories } from "./components/menues/categories";
Amplify.configure(awsconfig);

const getTimestamp = () => {
    return new Date().toISOString().slice(2).slice(0, 17).replace(/-|T|:/g, "")
}

// Continue testing: https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-a-custom-plugin
// Further configuration needed??

const generateAudio = (apiUrl, text, voice, prefix) => {

    const params = `{"text": "${text}", "voice": "${voice}", "prefix": "${prefix}"}`;

    const pollyXhr = new XMLHttpRequest();
    const async = true;
    pollyXhr.open('POST', apiUrl, async);
    pollyXhr.setRequestHeader('Content-type', 'application/json');
    pollyXhr.onreadystatechange = function (e) {
        // @ts-ignore
        console.log('response', e.target.response);
    }
    pollyXhr.send(params);
}

const testApi = async (english, chinese) => {

    const englishVoice = 'Emma';
    const chineseVoice = 'Zhiyu';

    generateAudio(
        'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly',
        chinese,
        chineseVoice,
        getTimestamp()
    );

    generateAudio(
        'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly',
        english,
        englishVoice,
        getTimestamp()
    );
}

const listBucket = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
}

const App = () => {

    const [chineseText, onChangeChineseText] = React.useState('我喜欢李璇');
    const [englishText, onChangeEnglishText] = React.useState('I like Xuan');

    return (
        <SafeAreaView>
            <StatusBar barStyle={"light-content"} />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={{display: 'flex'}}>
                <View style={{flex:5}}>
                    <Header header="Hands-off Chinese"></Header>
                </View>

                <View style={{flex: 5}}>
                    <Categories />
                </View>

                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 36}}>
                    <Text>Test</Text>
                </View>


                {/* <Menu></Menu> */}
                {/* <AudioPlayerCard key="audioPlayer" /> */}
                {/* <PlayDirectlyFromS3 />
                <ListS3Content /> */}

                {/* <TextInput
                    value={chineseText}
                    onChangeText={onChangeChineseText}
                    placeholder="Chinese text"
                />
                <TextInput
                    value={englishText}
                    onChangeText={onChangeEnglishText}
                    placeholder="English text"
                />
                <Button
                    onPress={() => { testApi(englishText, chineseText) }}
                    title="Test API"
                />

                <Button
                    onPress={listBucket}
                    title="List bucket"
                /> */}

            </ScrollView>
        </SafeAreaView>
    );
}

export default App;
