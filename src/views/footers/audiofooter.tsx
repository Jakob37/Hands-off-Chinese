import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux'
Icon.loadFont()
import { useSelector } from 'react-redux'
import { HocDb } from 'src/backend/database'
import { toggleEntriesPaused } from '../../../store/actions/audioentries'
import { AudioPlayer } from '../../audio/AudioPlayer'
import { AudioEntryPair } from '../../backend/audioentry'
import { styles } from '../../style/Stylesheet'
import { FooterButton } from './util'

const audioPlayer = new AudioPlayer()

interface AudioPlayerRowParam {
    label: string
    placeholder: string
    setUpdatedText: (text: string) => void
}

const fontSize = 16

const AudioPlayerRow = (param: AudioPlayerRowParam) => {
    const [counter, setCounter] = useState(0)
    const [lastDuration, setLastDuration] = useState(0)

    const [activeNbr, setActiveNbr] = useState(0)

    const [delay, setDelay] = useState(audioPlayer.delay / 1000)

    audioPlayer.addTimerHook((number) => {
        setCounter(number)
        setActiveNbr(audioPlayer.getNumberActiveClips())
    })

    audioPlayer.addDurationHook((duration) => {
        setLastDuration(duration)
    })

    return (
        <>
            <View
                style={[
                    styles.inputField,
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    },
                ]}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        minWidth: '20%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize }}>{`${delay}s`}</Text>

                    <TouchableOpacity
                        onPress={() => {
                            audioPlayer.incrementDelay()
                            setDelay(audioPlayer.delay / 1000)
                        }}
                    >
                        <Icon name="plus" size={20} color="black"></Icon>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            audioPlayer.reduceDelay()
                            setDelay(audioPlayer.delay / 1000)
                        }}
                    >
                        <Icon name="minus" size={20} color="black"></Icon>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize }}>{`Time: ${counter}s`}</Text>
                <Text style={{ fontSize }}>{`Nbr active: ${activeNbr}`}</Text>
            </View>
        </>
    )
}

interface AudioFooterParam {
    audioEntries: AudioEntryPair[]
    backToMenu: () => void
    db: HocDb
}
const AudioFooter = (param: AudioFooterParam) => {
    useEffect(() => {
        audioPlayer.load(param.audioEntries, param.db)
    }, [param.audioEntries])

    const currentlyShownIds = useSelector((state) => state.audioEntries.currentIds);

    const dispatch = useDispatch();
    const toggleEntriesPausedHandler = (ids: Set<string>) => {
        dispatch(toggleEntriesPaused(ids))
    }

    return (
        <>
            <AudioPlayerRow
                label="test"
                placeholder="test2"
                setUpdatedText={(text) => console.log(text)}
            />
            <View
                style={[
                    styles.footerCard,
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    },
                ]}
            >
                <FooterButton
                    onPress={() => {
                        console.log('Hello testing')
                    }}
                >
                    Test
                </FooterButton>
                <FooterButton
                    onPress={() => {
                        audioPlayer.play()
                    }}
                >
                    Play
                </FooterButton>
                <FooterButton
                    onPress={() => {
                        audioPlayer.playRandom()
                    }}
                >
                    Random
                </FooterButton>
                <FooterButton
                    onPress={() => {
                        audioPlayer.stop()
                    }}
                >
                    Stop
                </FooterButton>
                <FooterButton
                    onPress={() => {
                        console.log(
                            'Attempting (and failing) to pause all in current category'
                        )
                        console.log('Currently shown', currentlyShownIds)
                        toggleEntriesPausedHandler(currentlyShownIds)
                    }}
                >
                    Pause all
                </FooterButton>
                <FooterButton onPress={param.backToMenu}>Back</FooterButton>
            </View>
        </>
    )
}

export default AudioFooter
