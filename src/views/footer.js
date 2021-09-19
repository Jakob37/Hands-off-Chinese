import { useEffect } from "react";
import { AudioPlayer } from "../../components/AudioPlayer";
import { styles } from "../../components/Stylesheet";
import { generatePollyAudio, getCategories, retrieveEntriesFromS3, submitMetadata } from "../apicalls";
import { playTestSound } from "../audio/util";

const React = require("react");
const { View, TouchableOpacity, Text } = require("react-native");

const fontSize = 16;

const audioPlayer = new AudioPlayer();

/**
 * @param {Object} param 
 * @property {[string,string][]} param.pathPairs 
 * @property {() => void} param.backToMenu
 * @returns 
 */
const AudioFooter = (param) => {

    // audioPlayer.load(param.audioPathPairs)

    useEffect(() => {
        console.log('Reloading audioplayer')
        // console.log('attempting loading', param.pathPairs)
        audioPlayer.load(param.pathPairs)
        // audioPlayer.load([["210822144607_I am eating apple", "210822144607_我在吃苹果"]])
    }, [param.pathPairs])

    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <TouchableOpacity onPress={() => {
                // playTestSound();
                // console.log('Play')

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

/**
 * @param {Object} param 
 * @property {[string,string][]} param.pathPairs
 * @property {() => void} param.backToMenu
 * @property {() => void} param.openAddEntryMenu
 * @property {() => void} param.refreshCategories
 * @property {() => void} param.closeAddEntryMenu
 * @property {boolean} param.isSelectedView
 * @property {boolean} param.entryMenuOpen
 * @returns {React.ReactElement}
 */
const Footer = (param) => {
    // console.log('isSelectedView', param.isSelectedView, 'addEntryMenuOpen', param.entryMenuOpen)

    // console.log('current param', param)

    return (
        <View>
            {
                param.isSelectedView ?
                    <AudioFooter
                        backToMenu={param.backToMenu}
                        pathPairs={param.pathPairs}
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
