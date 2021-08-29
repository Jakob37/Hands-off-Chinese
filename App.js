import Amplify, { Storage } from "aws-amplify";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Header } from "./components/Header";
import { getAllFromDynamo, retrieveEntriesFromS3 } from "./src/apicalls";
import awsconfig from "./src/aws-exports";
import AddAudioMenu from "./src/views/addaudiomenu";
import AudioCardList from "./src/views/list/audiocardlist";
import CategoryCardList from "./src/views/list/categorycardlist";
import AudioCardListFooter from "./src/views/audiocardlistfooter";

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

    const refreshCategories = () => {
        getAllFromDynamo().then(returnedCategories => setCategoryList(returnedCategories));
    }

    const [audioList, setAudioList] = React.useState([
        ['[English1]', 'englishkey', '[Chinese1]', 'chinesekey'],
        ['[English2]', 'englishkey', '[Chinese2]', 'chinesekey']
    ]);

    const [chineseText, setChineseText] = React.useState('');
    const [englishText, setEnglishText] = React.useState('');

    const [categoryList, setCategoryList] = React.useState('');

    return (
        <View style={{ flex: 1 }}>

            <Header header="Hands-off Chinese"></Header>

            {/* <CategoryCardList /> */}

            <AudioCardList 
                audioList={audioList}
                refreshS3List={refreshS3List}
            />

            <AddAudioMenu
                setChineseText={setChineseText}
                setEnglishText={setEnglishText}
            />

            <AudioCardListFooter
                setChineseText={setChineseText}
                setEnglishText={setEnglishText}
                chineseText={chineseText}
                englishText={englishText}
                setList={setAudioList}
            />
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
