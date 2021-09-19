import { useEffect } from "react";
import { AudioPlayer } from "../../components/AudioPlayer";
import { styles } from "../../components/Stylesheet";
import { generatePollyAudio, getCategories, retrieveEntriesFromS3, submitMetadata } from "../apicalls";
import { playTestSound } from "../audio/util";

const React = require("react");
const { View, TouchableOpacity, Text } = require("react-native");

const fontSize = 16;

const audioPlayer = new AudioPlayer();

const FooterButton = (param) => {
    return <TouchableOpacity onPress={param.onPress}>
        <Text style={{ fontSize }}>{param.children}</Text>
    </TouchableOpacity>
}

/**
 * @param {Object} param 
 * @property {[string,string][]} param.pathPairs 
 * @property {() => void} param.backToMenu
 * @returns 
 */
const AudioFooter = (param) => {

    useEffect(() => {
        console.log('Reloading audioplayer')
        audioPlayer.load(param.pathPairs)
    }, [param.pathPairs])

    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <FooterButton onPress={() => { audioPlayer.play() }}>Play</FooterButton>
            <FooterButton onPress={() => { audioPlayer.playRandom() }}>Random</FooterButton>
            <FooterButton onPress={() => { audioPlayer.stop() }}>Stop</FooterButton>
            <FooterButton onPress={param.backToMenu}>Back</FooterButton>
        </View>
    )
}

const CategoryFooter = (param) => {
    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <FooterButton onPress={param.openAddEntryMenu}>Add new entry</FooterButton>
            <FooterButton onPress={param.refreshCategories}>Refresh</FooterButton>
        </View>
    )
}

const OpenAddEntryFooter = (param) => {
    return (
        <View style={[
            styles.footerCard,
            { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
        ]}>
            <FooterButton onPress={param.closeAddEntryMenu}>Close</FooterButton>
            <FooterButton onPress={param.addNew}>Submit entry to AWS</FooterButton>
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
