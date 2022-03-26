import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { RootStackParamList } from 'src/screens/navigationutils'
import ClickableIcon from '../../util/clickableicon'
import {
    DbContext,
    PausedIdsContext,
    ShownIdsContext,
} from '../../../store/contexts/contexts'
import { AudioPlayer } from '../../audio/AudioPlayer'
import { AudioEntryPair } from '../../backend/audioentry'
import { styles } from '../../style/Stylesheet'
Icon.loadFont()

// const audioPlayer = new AudioPlayer()

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

    // const [delay, setDelay] = useState(audioPlayer.delay / 1000)

    // audioPlayer.addTimerHook((number) => {
    //     setCounter(number)
    //     setActiveNbr(audioPlayer.getNumberActiveClips())
    // })

    // audioPlayer.addDurationHook((duration) => {
    //     setLastDuration(duration)
    // })

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
                    {/* <Text style={{ fontSize }}>{`${delay}s`}</Text> */}

                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                </View>

                <Text style={{ fontSize }}>{`Time: ${counter}s`}</Text>
                <Text style={{ fontSize }}>{`Nbr active: ${activeNbr}`}</Text>
            </View>
        </>
    )
}

interface AudioFooterParam {
    audioEntries: AudioEntryPair[]
    user: string
    navigation: NativeStackNavigationProp<RootStackParamList, 'Audio entries'>
}
const AudioFooter = (param: AudioFooterParam) => {
    const { db } = useContext(DbContext)

    // useEffect(() => {
    //     audioPlayer.load(param.user, param.audioEntries, db)
    // }, [param.audioEntries])

    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)
    const { shownIds } = useContext(ShownIdsContext)

    return (
        <>
            {/* <AudioPlayerRow
                label="test"
                placeholder="test2"
                setUpdatedText={(text) => console.log(text)}
            /> */}
            <View
                style={[
                    styles.footerCard,
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    },
                ]}
            >
                <ClickableIcon
                    icon="play"
                    size={30}
                    iconColor="black"
                    clickCallback={() => {
                        param.navigation.navigate('Audio player', {
                            audioEntries: param.audioEntries,
                        })
                    }}
                ></ClickableIcon>
                <ClickableIcon
                    icon="pause"
                    size={30}
                    iconColor="black"
                    clickCallback={() => {
                        const finalPausedIds = Array.from(pausedIds)
                        for (const currentId of shownIds) {
                            if (!pausedIds.includes(currentId)) {
                                finalPausedIds.push(currentId)
                            }
                        }
                        setPausedIds(finalPausedIds)
                    }}
                ></ClickableIcon>
            </View>
        </>
    )
}

export default AudioFooter
