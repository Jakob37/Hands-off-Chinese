import Amplify, { Storage } from "aws-amplify";
import React, { useEffect } from "react";
import { ScrollView, View, Text, Button } from "react-native";

import { Header } from "./components/Header";
import { generatePollyAudio, getAllMeta, getCategories, makeNewAudioEntry, retrieveEntriesFromS3 } from "./src/apicalls";
import awsconfig from "./src/aws-exports";
import AddAudioMenu from "./src/views/addaudiomenu";
import ScrollableAudioCardList from "./src/views/list/scrollableaudiocardlist";
// import CategoryCardList from "./src/views/list/categorycardlist.js";
import Footer from "./src/views/footer";
import { CategoryCard } from "./src/views/card/categorycard";
import CategoryCardList from "./src/views/list/categorycardlist";
import AddCategoryMenu from "./src/views/addcategorymenu";

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

const listCategory = async () => {
    console.log('listing category clicked');

    const result = await getAllMeta();
    console.log(result);
}

const App = () => {

    const refreshS3List = () => {
        retrieveEntriesFromS3().then(returnedList => setAudioList(returnedList))
    }
    useEffect(refreshS3List, []);

    const refreshCategories = () => {
        getCategories().then(returnedCategories => setCategoryList(returnedCategories));
    }
    useEffect(refreshCategories, []);

    const [audioList, setAudioList] = React.useState([
        ['[English1]', 'englishkey', '[Chinese1]', 'chinesekey'],
        ['[English2]', 'englishkey', '[Chinese2]', 'chinesekey']
    ]);

    const [chineseText, setChineseText] = React.useState('');
    const [englishText, setEnglishText] = React.useState('');
    const [categoryText, setCategoryText] = React.useState('');

    const [categoryList, setCategoryList] = React.useState(['Category1', 'Category2', 'Category3']);

    const [addEntryMenuOpen, setAddEntryMenuOpen] = React.useState(false);

    const [isSelectedView, setIsSelectedView] = React.useState(false);

    return (
        <View style={{ flex: 1 }}>

            <Header header="Hands-off Chinese"></Header>

            {
                !isSelectedView ?
                    <ScrollView>
                        <CategoryCardList
                            categories={categoryList}
                            selectAction={() => {listCategory()}}
                            refresh={refreshCategories}
                        />
                    </ScrollView> :
                    <ScrollableAudioCardList
                        audioList={audioList}
                        refreshS3List={refreshS3List}
                    />
            }

            {
                addEntryMenuOpen ?
                    <AddAudioMenu 
                        setChineseText={setChineseText}
                        setEnglishText={setEnglishText}
                        setCategoryText={setCategoryText}
                    /> : null
            }

            {/* {
                !isSelectedView ?
                    <AddCategoryMenu
                        setCategoryText={setCategoryText}
                    /> :
                    <AddAudioMenu
                        setChineseText={setChineseText}
                        setEnglishText={setEnglishText}
                    />
            } */}

            {/* <Button onPress={() => {
                setIsSelectedView(!isSelectedView)
            }}
                title="Swap view"
            >
            </Button> */}


            <Footer
                setChineseText={setChineseText}
                setEnglishText={setEnglishText}
                chineseText={chineseText}
                englishText={englishText}
                setList={setAudioList}
                isSelectedView={isSelectedView}
                entryMenuOpen={addEntryMenuOpen}
                backToMenu={() => {setIsSelectedView(false)}}
                openAddEntryMenu={() => {
                    setAddEntryMenuOpen(true);
                    // makeNewAudioEntry(
                    //     englishText,
                    //     chineseText,
                    //     categoryText,
                    //     () => { console.log("Completed logic coming here!")},
                    // )
                }}
                closeAddEntryMenu={() => {
                    setAddEntryMenuOpen(false);
                }}
                refreshCategories={refreshCategories}
            />
        </View>)

    // FIXME: Can parts of these be used?
    {/* <Menu></Menu> */ }
    {/* <AudioPlayerCard key="audioPlayer" /> */ }
}

export default App;
