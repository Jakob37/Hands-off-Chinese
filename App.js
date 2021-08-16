import React from "react";
import { Button, SafeAreaView, ScrollView, StatusBar, TextInput } from "react-native";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { PlayDirectlyFromS3 } from "./components/aws/PlayDirectlyFromS3";
import { ListS3Content } from "./components/aws/ListS3Content";

const getTimestamp = () => {
    return new Date().toISOString().slice(2).slice(0,17).replace(/-|T|:/g, "")
}

const generateAudio = (apiUrl, text, voice, prefix) => {

    const params = `{"text":"${text}", "voice": "${voice}", "prefix": "${prefix}"}`;
  
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

    // const english = 'I like Xuan';
    // const chinese = '我喜欢李璇';
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
  

const App = () => {

    // constructor(props) {
    //     super(props);
    // }

    const [chineseText, onChangeChineseText] = React.useState('我喜欢李璇');
    const [englishText, onChangeEnglishText] = React.useState('I like Xuan');

    // render() {
    return (
        <SafeAreaView>
            <StatusBar barStyle={"light-content"} />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Header header="Hands-off Chinese"></Header>
                {/* <Menu></Menu> */}
                {/* <AudioPlayerCard key="audioPlayer" /> */}
                <PlayDirectlyFromS3 />
                <ListS3Content />

                <TextInput
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

            </ScrollView>
        </SafeAreaView>
    );
    // }
}

export default App;
