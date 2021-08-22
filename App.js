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
import { styles } from "./components/Stylesheet";
import { TouchableOpacity } from "react-native";
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

const refreshClick = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
    console.log('refresh!');
}

/**
 * @returns {Promise<[string,string][]>}
 */
const retrieveEntriesFromS3 = async () => {
    const listResult = await Storage.list('');
    const s3Names = listResult.filter((result) => result.key != '').map((result) => result.key);

    /** @type {Map<string, {english:string, chinese:string}>} */
    const baseToObj = new Map();

    const splits = s3Names.map((name) => { return name.split('_') });
    for (const [base, languageString] of splits) {
        const langObj = baseToObj.get(base);
        if (langObj == null) {
            baseToObj.set(base, { english: languageString, chinese: '' });
        } else {
            console.assert(Object.keys(langObj) == ['english', 'chinese']);
            langObj.chinese = languageString;
        }
    }

    const langArr = Array.from(baseToObj)
        .map(([base, obj]) => /** @type {[string,string]} */([obj.english, obj.chinese]));

    console.log(s3Names);

    return langArr;
}

const App = () => {

    const [list, setList] = React.useState([['[English1]', '[Chinese1]'], ['[English2]', '[Chinese2]']]);

    return (
        <View style={{ flex: 1 }}>

            <Header header="Hands-off Chinese"></Header>
            <ScrollView>
                <Categories list={list} />
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
                        <TextInput style={{ borderWidth: 1, borderColor: 'gray', flex: 3 }}></TextInput>
                    </View>
                    <View style={{
                        paddingHorizontal: 16,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 16, flex: 1 }}>English</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: 'gray', flex: 3 }}></TextInput>
                    </View>
                </View>

                {/* <View style={{ paddingHorizontal: 16 }}>
                        <Text style={{fontSize: 20}}>Add audio</Text>
                    </View> */}

                <View style={[
                    styles.footerCard,
                    { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
                ]}>
                    <Text style={{ fontSize: 20 }}>Play</Text>
                    <Text style={{ fontSize: 20 }}>Stop</Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 20 }}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        retrieveEntriesFromS3().then(returnedList => setList(returnedList));
                    }}>
                        <Text style={{ fontSize: 20 }}>Refresh</Text>
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
