import React, { useEffect } from "react";
import { Button, SafeAreaView, ScrollView, StatusBar, TextInput, View, Text } from "react-native";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { PlayDirectlyFromS3 } from "./components/aws/PlayDirectlyFromS3";
import { ListS3Content } from "./components/aws/ListS3Content";

import Amplify, { Storage } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import { Categories } from "./components/menues/categories";
import { styles } from "./components/Stylesheet";
import { TouchableOpacity } from "react-native";
import Sound from "react-native-sound";
Amplify.configure(awsconfig);
// Needed to run in production? (verify)
Amplify.register(Storage);

const getTimestamp = () => {
    return new Date().toISOString().slice(2).slice(0, 17).replace(/-|T|:/g, "")
}

// Continue testing: https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-a-custom-plugin
// Further configuration needed??

const testPost = () => {
    const id = 'testid';
    const filename = 'testfilename';
    const creationdate = new Date().getMilliseconds();

    const params = `{"id": "${id}", "filename": "${filename}", "creationdate": ${creationdate}}`;

    const apiUrl = 'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta';

    const apiTestXhr = new XMLHttpRequest();
    const isAsync = true;
    apiTestXhr.open('PUT', apiUrl, isAsync);
    apiTestXhr.setRequestHeader('Content-type', 'application/json');
    apiTestXhr.onreadystatechange = (e) => {
        // console.log(e);
        // @ts-ignore
        console.log(e.target.response);
        // console.log(Object.keys(e.target));
    }
    apiTestXhr.send(params);
}

const testGet = () => {
    const id = 'testid';
    const filename = 'testfilename';
    const creationdate = new Date().getMilliseconds();

    const params = `filename=testfilename`;
    // const params = `{"filename": "${filename}"}`;

    const apiUrl = `https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta`;

    const apiTestXhr = new XMLHttpRequest();
    const isAsync = true;
    apiTestXhr.open('GET', apiUrl+"?"+params, isAsync);
    apiTestXhr.setRequestHeader('Content-type', 'application/json');
    apiTestXhr.onreadystatechange = (e) => {
        // console.log(e);
        // console.log(e.target);
        // @ts-ignore
        console.log(e.target.response);
        // console.log(Object.keys(e.target));
    }
    apiTestXhr.send(null);
}

const generateAudio = (apiUrl, text, voice, prefix, onReadyCall=null) => {

    const params = `{"text": "${text}", "voice": "${voice}", "prefix": "${prefix}"}`;

    const pollyXhr = new XMLHttpRequest();
    const isAsync = true;
    pollyXhr.open('POST', apiUrl, isAsync);
    pollyXhr.setRequestHeader('Content-type', 'application/json');
    pollyXhr.onreadystatechange = function (e) {
        // @ts-ignore
        // console.log('response', e.target.response);
        if (onReadyCall != null) {
            onReadyCall();
        }
    }
    pollyXhr.send(params);
}

const generatePollyAudio = async (english, chinese, onReadyCall) => {

    const englishVoice = 'Emma';
    const chineseVoice = 'Zhiyu';

    generateAudio(
        'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly',
        chinese,
        chineseVoice,
        getTimestamp(),
        onReadyCall
    );

    generateAudio(
        'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly',
        english,
        englishVoice,
        getTimestamp(),
        onReadyCall
    );
}

const listBucket = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
}

const refreshClick = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
    console.log('refresh!');
}

/**
 * @returns {Promise<[string,string,string,string][]>}
 */
const retrieveEntriesFromS3 = async () => {

    console.log('Retrieving entries');

    const listResult = await Storage.list('');
    const s3Names = listResult.filter((result) => result.key != '').map((result) => result.key);

    /** @type {Map<string, {english:string, chinese:string, englishKey:string, chineseKey:string}>} */
    const baseToObj = new Map();

    // const splits = s3Names.map((name) => { return name.split('_') });
    for (const s3Name of s3Names) {
        const [base, languageString] = s3Name.split('_');
        const langObj = baseToObj.get(base);
        if (langObj == null) {
            baseToObj.set(base, {
                english: languageString,
                englishKey: s3Name,
                chinese: '',
                chineseKey: ''
            });
        } else {
            langObj.chinese = languageString;
            langObj.chineseKey = s3Name;
        }
    }

    const langArr = Array.from(baseToObj)
        .map(([_, obj]) => /** @type {[string,string,string,string]} */([
            obj.english,
            obj.englishKey,
            obj.chinese,
            obj.chineseKey
        ]));

    console.log(s3Names);

    return langArr;
}

const playTestSound = () => {
    const track = new Sound('testsound.309bc55b-b25e-4641-8d24-04639818e4f3.mp3', 'https://hands-off-chinese.s3.eu-north-1.amazonaws.com', (e) => {
        if (e) {
            console.log('error loading track:', e)
        } else {
            track.play()
        }
    })
}


const App = () => {

    const refreshS3List = () => {
        retrieveEntriesFromS3().then(returnedList => setList(returnedList))
    }

    useEffect(refreshS3List, []);

    const [list, setList] = React.useState([
        ['[English1]', 'englishkey', '[Chinese1]', 'chinesekey'],
        ['[English2]', 'englishkey', '[Chinese2]', 'chinesekey']
    ]);

    const [chineseText, setChineseText] = React.useState('');
    const [englishText, setEnglishText] = React.useState('');

    return (
        <View style={{ flex: 1 }}>

            <Header header="Hands-off Chinese"></Header>
            <ScrollView>
                <Categories list={list} endAction={refreshS3List} />
            </ScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: 'lightgray' }}>

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
                            value={chineseText}
                            onChangeText={(text) => setChineseText(text)}
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
                            value={englishText}
                            onChangeText={(text) => setEnglishText(text)}
                            placeholder="English test"
                        ></TextInput>
                    </View>
                </View>

                <View style={[
                    styles.footerCard,
                    { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
                ]}>
                    <TouchableOpacity onPress={() => {
                        playTestSound();
                    }}>
                        <Text style={{ fontSize: 16 }}>Play</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16 }}>Stop</Text>
                    <TouchableOpacity onPress={() => {
                        generatePollyAudio(
                            englishText,
                            chineseText,
                            refreshS3List
                        );
                        setChineseText('');
                        setEnglishText('');
                    }}>
                        <Text style={{ fontSize: 16 }}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        retrieveEntriesFromS3().then(returnedList => setList(returnedList));
                    }}>
                        <Text style={{ fontSize: 16 }}>Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={testPost}>
                        <Text style={{ fontSize: 16 }}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={testGet}>
                        <Text style={{ fontSize: 16 }}>Get</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)

    {/* <Menu></Menu> */ }
    {/* <AudioPlayerCard key="audioPlayer" /> */ }
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

    // );
}

export default App;
