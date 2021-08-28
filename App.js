import Amplify, { Storage } from "aws-amplify";
import React, { useEffect } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { generatePollyAudio, retrieveEntriesFromS3 } from "./src/apicalls";
import Footer from "./src/views/footer";
import { Header } from "./components/Header";
import { Categories } from "./components/menues/categories";
import { styles } from "./components/Stylesheet";
import awsconfig from "./src/aws-exports";

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

                <Footer
                    setChineseText={setChineseText} 
                    setEnglishText={setEnglishText} 
                    chineseText={chineseText} 
                    englishText={englishText} 
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
