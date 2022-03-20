import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AudioPlayerContext } from '../../../store/contexts/contexts'
import {
    DbContext,
    PausedIdsContext,
    ShownIdsContext,
} from '../../../store/contexts/contexts'
import { AudioPlayer } from '../../audio/AudioPlayer'
import { AudioEntryPair } from '../../backend/audioentry'
import { styles } from '../../style/Stylesheet'
import ClickableIcon from '../../util/clickableicon'
Icon.loadFont()

// const audioPlayer = new AudioPlayer()

interface PlayerRowParam {
    label: string
    placeholder: string
    setUpdatedText: (text: string) => void
}

const fontSize = 16

// const PlayerRow = (param: PlayerRowParam) => {
//     const [counter, setCounter] = useState(0)
//     const [lastDuration, setLastDuration] = useState(0)

//     const [activeNbr, setActiveNbr] = useState(0)


//     const [delay, setDelay] = useState(audioPlayer.delay / 1000)

//     audioPlayer.addTimerHook((number) => {
//         setCounter(number)
//         setActiveNbr(audioPlayer.getNumberActiveClips())
//     })

//     audioPlayer.addDurationHook((duration) => {
//         setLastDuration(duration)
//     })

//     return (
//         <>
//             <View
//                 style={[
//                     styles.inputField,
//                     {
//                         display: 'flex',
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                     },
//                 ]}
//             >
//                 <Text>Test</Text>
//                 {/* <View
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'row',
//                         minWidth: '20%',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                     }}
//                 >
//                     <Text style={{ fontSize }}>{`${delay}s`}</Text>

//                     <TouchableOpacity
//                         onPress={() => {
//                             audioPlayer.incrementDelay()
//                             setDelay(audioPlayer.delay / 1000)
//                         }}
//                     >
//                         <Icon name="plus" size={20} color="black"></Icon>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={() => {
//                             audioPlayer.reduceDelay()
//                             setDelay(audioPlayer.delay / 1000)
//                         }}
//                     >
//                         <Icon name="minus" size={20} color="black"></Icon>
//                     </TouchableOpacity>
//                 </View>

//                 <Text style={{ fontSize }}>{`Time: ${counter}s`}</Text>
//                 <Text style={{ fontSize }}>{`Nbr active: ${activeNbr}`}</Text> */}
//             </View>
//         </>
//     )
// }

interface PlayerFooterParam {
    audioEntries: AudioEntryPair[]
    user: string
}
const PlayerFooter = (param: PlayerFooterParam) => {
    const { db } = useContext(DbContext)
    const { audioPlayer } = useContext(AudioPlayerContext)

    useEffect(() => {
        audioPlayer.load(param.user, param.audioEntries, db)
    }, [param.audioEntries])

    const [delay, setDelay] = useState(audioPlayer.delay / 1000)
    const [counter, setCounter] = useState(0)
    const [lastDuration, setLastDuration] = useState(0)
    const [activeNbr, setActiveNbr] = useState(0)

    audioPlayer.addTimerHook((number) => {
        setCounter(number)
        setActiveNbr(audioPlayer.getNumberActiveClips())
    })

    audioPlayer.addDurationHook((duration) => {
        setLastDuration(duration)
    })

    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)
    const { shownIds } = useContext(ShownIdsContext)

    return (
        <>
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
                    color="black"
                    clickCallback={() => {
                        // param.navigation.navigate('Audio player', {
                        //     audioEntries: param.audioEntries,
                        // })
                        audioPlayer.play()
                    }}
                ></ClickableIcon>
                <ClickableIcon
                    icon="plus"
                    size={30}
                    color="black"
                    clickCallback={() => {
                        audioPlayer.incrementDelay()
                    }}
                ></ClickableIcon>
                <ClickableIcon
                    icon="minus"
                    size={30}
                    color="black"
                    clickCallback={() => {
                        audioPlayer.reduceDelay()
                    }}
                ></ClickableIcon>
                <ClickableIcon
                    icon="pause"
                    size={30}
                    color="black"
                    clickCallback={() => {
                        // const finalPausedIds = Array.from(pausedIds)
                        // for (const currentId of shownIds) {
                        //     if (!pausedIds.includes(currentId)) {
                        //         finalPausedIds.push(currentId)
                        //     }
                        // }
                        // setPausedIds(finalPausedIds)
                        audioPlayer.stop()
                    }}
                ></ClickableIcon>
            </View>
        </>
    )
}

export default PlayerFooter
