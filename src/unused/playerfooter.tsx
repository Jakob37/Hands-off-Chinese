// import React, { useContext, useEffect, useState } from 'react'
// import { View } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import {
//     AudioPlayerContext, DbContext,
//     PausedIdsContext,
//     ShownIdsContext
// } from '../../store/contexts/contexts'
// import { AudioEntryPair } from '../backend/audioentry'
// import { styles } from '../style/Stylesheet'
// import ClickableIcon from '../uicomponents/clickableicon'
// Icon.loadFont()

// interface PlayerRowParam {
//     label: string
//     placeholder: string
//     setUpdatedText: (text: string) => void
// }

// const fontSize = 16

// interface PlayerFooterParam {
//     audioEntries: AudioEntryPair[]
//     user: string
// }
// const PlayerFooter = (param: PlayerFooterParam) => {
//     const { db } = useContext(DbContext)
//     const { audioPlayer } = useContext(AudioPlayerContext)

//     useEffect(() => {
//         audioPlayer.load(param.user, param.audioEntries, db)
//     }, [param.audioEntries])

//     const [delay, setDelay] = useState(audioPlayer.delay / 1000)
//     const [counter, setCounter] = useState(0)
//     const [lastDuration, setLastDuration] = useState(0)
//     const [activeNbr, setActiveNbr] = useState(0)

//     audioPlayer.addTimerHook((number) => {
//         setCounter(number)
//         setActiveNbr(audioPlayer.getNumberActiveClips())
//     })

//     audioPlayer.addDurationHook((duration) => {
//         setLastDuration(duration)
//     })

//     const { pausedIds, setPausedIds } = useContext(PausedIdsContext)
//     const { shownIds } = useContext(ShownIdsContext)

//     return (
//         <>
//             <View
//                 style={[
//                     styles.footerCard,
//                     {
//                         display: 'flex',
//                         flexDirection: 'row',
//                         justifyContent: 'space-around',
//                     },
//                 ]}
//             >
//                 <ClickableIcon
//                     icon="play"
//                     size={30}
//                     iconColor="black"
//                     clickCallback={() => {
//                         audioPlayer.play()
//                     }}
//                 ></ClickableIcon>
//                 <ClickableIcon
//                     icon="plus"
//                     size={30}
//                     iconColor="black"
//                     clickCallback={() => {
//                         audioPlayer.incrementDelay()
//                     }}
//                 ></ClickableIcon>
//                 <ClickableIcon
//                     icon="minus"
//                     size={30}
//                     iconColor="black"
//                     clickCallback={() => {
//                         audioPlayer.reduceDelay()
//                     }}
//                 ></ClickableIcon>
//                 <ClickableIcon
//                     icon="pause"
//                     size={30}
//                     iconColor="black"
//                     clickCallback={() => {
//                         audioPlayer.stop()
//                     }}
//                 ></ClickableIcon>
//             </View>
//         </>
//     )
// }

// export default PlayerFooter
