// import React, { useState } from 'react'
// import { useContext } from 'react'
// import { View } from 'react-native'
// import { AudioEntryPair } from '../backend/audioentry'
// import { removeFromArray, toggleEntryInArray } from '../util/util'
// import {
//     FlaggedIdsContext,
//     PausedIdsContext,
// } from '../../store/contexts/contexts'
// import { styles } from '../style/Stylesheet'
// import AudioCardActive from './audiocardactive'
// import AudioCardSettings from '../views/card/audiocardsettings'

// interface AudioCardParam {
//     audioEntryPair: AudioEntryPair
//     isPaused: boolean
//     user: string
//     togglePaused: () => void
// }
// const AudioCard = (param: AudioCardParam) => {
//     const [settingMode, setSettingMode] = useState(false)
//     const [cardHeight, setCardHeight] = useState(0)
//     const { pausedIds, setPausedIds } = useContext(PausedIdsContext)
//     const { flaggedIds, setFlaggedIds } = useContext(FlaggedIdsContext)

//     return (
//         <View
//             style={[
//                 styles.card,
//                 {
//                     display: 'flex',
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                 },
//             ]}
//             onLayout={(event) => {
//                 const { height } = event.nativeEvent.layout
//                 if (height > cardHeight) {
//                     setCardHeight(height)
//                 }
//             }}
//         >
//             {settingMode ? (
//                 <AudioCardSettings
//                     removeCallback={(
//                         englishFile: string,
//                         chineseFile: string
//                     ) => {
//                         console.log('FIXME: Currently not implemented')
//                         // removeEntry(englishFile, chineseFile)
//                     }}
//                     backCallback={() => {
//                         setSettingMode(false)
//                     }}
//                     minCardHeight={cardHeight}
//                     englishFile={param.audioEntryPair.englishKey}
//                     chineseFile={param.audioEntryPair.chineseKey}
//                 />
//             ) : (
//                 <AudioCardActive
//                     user={param.user}
//                     audioEntryPair={param.audioEntryPair}
//                     cardTextColor={
//                         pausedIds.includes(param.audioEntryPair.id)
//                             ? 'gray'
//                             : 'black'
//                     }
//                     togglePaused={() => {
//                         const updatedArr = toggleEntryInArray(
//                             pausedIds,
//                             param.audioEntryPair.id
//                         )
//                         setPausedIds(updatedArr)
//                     }}
//                     toggleFlagged={() => {
//                         const updatedArr = toggleEntryInArray(
//                             flaggedIds,
//                             param.audioEntryPair.id
//                         )
//                         setFlaggedIds(updatedArr)
//                     }}
//                     setSettingMode={() => {
//                         setSettingMode(true)
//                     }}
//                     isFlagged={flaggedIds.includes(param.audioEntryPair.id)}
//                 ></AudioCardActive>
//             )}
//         </View>
//     )
// }

// export { AudioCard }
