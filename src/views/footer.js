import { useEffect } from "react";
import { AudioPlayer } from "../../components/AudioPlayer";
import { styles } from "../../components/Stylesheet";
import { generatePollyAudio, getCategories, retrieveEntriesFromS3, submitMetadata } from "../apicalls";
import { playTestSound } from "../audio/util";

const React = require("react");
const { View, TouchableOpacity, Text } = require("react-native");

const fontSize = 16;

const audioPlayer = new AudioPlayer();

const AudioFooter = (param) => {

    // audioPlayer.load(param.audioPathPairs)

    useEffect(() => {
        console.log('attempting loading')
        audioPlayer.load([["210822144607_I am eating apple", "210822144607_我在吃苹果"]])
    }, [])

    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <TouchableOpacity onPress={() => {
                // playTestSound();
                console.log('Play')

                audioPlayer.playRandom()
            }}>
                <Text style={{ fontSize }}>Play</Text>
            </TouchableOpacity>
            <Text style={{ fontSize }}>Stop</Text>
            <TouchableOpacity onPress={param.backToMenu}>
                <Text style={{ fontSize }}>Back</Text>
            </TouchableOpacity>
        </View>
    )
}

const CategoryFooter = (param) => {
    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <TouchableOpacity onPress={param.openAddEntryMenu}>
                <Text style={{ fontSize }}>Add new entry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={param.refreshCategories}>
                <Text style={{ fontSize }}>Refresh</Text>
            </TouchableOpacity>
        </View>
    )
}

const OpenAddEntryFooter = (param) => {
    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <TouchableOpacity onPress={param.closeAddEntryMenu}>
                <Text style={{ fontSize }}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={param.addNew}>
                <Text style={{ fontSize }}>Submit entry to AWS</Text>
            </TouchableOpacity>
        </View>
    )
}

const Footer = (param) => {
    console.log('isSelectedView', param.isSelectedView, 'addEntryMenuOpen', param.entryMenuOpen)
    return (
        <View>
            {
                param.isSelectedView ?
                    <AudioFooter
                        setChineseText={param.setChineseText}
                        setEnglishText={param.setEnglishText}
                        chineseText={param.chineseText}
                        englishText={param.englishText}
                        setList={param.setAudioList}
                        backToMenu={param.backToMenu}
                    /> :
                    !param.entryMenuOpen ?
                        <CategoryFooter 
                            openAddEntryMenu={param.openAddEntryMenu} 
                            refreshCategories={param.refreshCategories}
                        /> :
                        <OpenAddEntryFooter 
                            addNew={param.addNew} 
                            closeAddEntryMenu={param.closeAddEntryMenu}
                        />
            }

        </View>
    )
}

export default Footer;
