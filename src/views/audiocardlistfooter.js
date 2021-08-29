import { styles } from "../../components/Stylesheet";
import { generatePollyAudio, getAllFromDynamo, retrieveEntriesFromS3, testGet, testPost } from "../apicalls";
import { playTestSound } from "../audio/util";

const React = require("react");
const { View, TouchableOpacity, Text } = require("react-native");

const fontSize = 16;

const AddAudioMenu = (param) => {
    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <TouchableOpacity onPress={() => {
                playTestSound();
            }}>
                <Text style={{ fontSize }}>Play</Text>
            </TouchableOpacity>
            <Text style={{ fontSize }}>Stop</Text>
            <TouchableOpacity onPress={() => {
                generatePollyAudio(
                    param.englishText,
                    param.chineseText,
                    param.refreshS3List
                );
                param.setChineseText('');
                param.setEnglishText('');
            }}>
                <Text style={{ fontSize }}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                retrieveEntriesFromS3().then(returnedList => {
                    param.setAudioList(returnedList)
                });
            }}>
                <Text style={{ fontSize }}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={testPost}>
                <Text style={{ fontSize }}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={testGet}>
                <Text style={{ fontSize }}>Get</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={getAllFromDynamo}>
                <Text style={{ fontSize }}>All</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddAudioMenu;
