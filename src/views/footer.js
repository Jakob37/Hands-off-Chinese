import { styles } from "../../components/Stylesheet";
import { generatePollyAudio, retrieveEntriesFromS3, testGet, testPost } from "../apicalls";
import { playTestSound } from "../audio/util";

const React = require("react");
const { View, TouchableOpacity, Text } = require("react-native");


const Footer = (param) => {
    return (
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
                    param.englishText,
                    param.chineseText,
                    param.refreshS3List
                );
                param.setChineseText('');
                param.setEnglishText('');
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
    )
}

export default Footer;