import Amplify, { Storage } from "aws-amplify";
import React, { useEffect } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import AudioCardList from "./src/views/audiocardlist";
import { Header } from "./components/Header";
import { Categories } from "./components/menues/categories";
import { retrieveEntriesFromS3 } from "./src/apicalls";
import awsconfig from "./src/aws-exports";
import Footer from "./src/views/footer";

Amplify.configure(awsconfig);
// Needed to run in production? (verify)
Amplify.register(Storage);

// Continue testing: https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-a-custom-plugin
// Further configuration needed??

const listBucket = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
}

const refreshClick = async () => {
    const listResult = await Storage.list('');
    console.log(listResult);
    console.log('refresh!');
}

const App = () => {

    const refreshS3List = () => {
        retrieveEntriesFromS3().then(returnedList => setAudioList(returnedList))
    }

    useEffect(refreshS3List, []);

    const [audioList, setAudioList] = React.useState([
        ['[English1]', 'englishkey', '[Chinese1]', 'chinesekey'],
        ['[English2]', 'englishkey', '[Chinese2]', 'chinesekey']
    ]);

    const [chineseText, setChineseText] = React.useState('');
    const [englishText, setEnglishText] = React.useState('');

    return (
        <View style={{ flex: 1 }}>

            <Header header="Hands-off Chinese"></Header>
            <ScrollView>
                <Categories list={audioList} endAction={refreshS3List} />
            </ScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: 'lightgray' }}>

                <AudioCardList 
                    setChineseText={setChineseText}
                    setEnglishText={setEnglishText}
                />

                <Footer
                    setChineseText={setChineseText} 
                    setEnglishText={setEnglishText} 
                    chineseText={chineseText} 
                    englishText={englishText}
                    setList={setAudioList}
                />


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
