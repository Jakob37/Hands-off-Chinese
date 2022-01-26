import { Storage } from 'aws-amplify'
import React, { useState } from 'react'
import { useContext } from 'react'
import { View } from 'react-native'
import Sound from 'react-native-sound'
import { AudioEntryPair } from '../../backend/audioentry'
import { removeFromArray } from '../../util/util'
import { PausedIdsContext } from '../../../store/contexts/mytestcontext'
import { removeEntry } from '../../backend/apicalls'
import { styles } from '../../style/Stylesheet'
import AudioCardActive from './audiocardactive'
import AudioCardSettings from './audiocardsettings'

// FIXME: Clearly move this to util location
const playAudio = async (
    key: string,
    callback: ((track: Sound) => void) | null = null
) => {
    const signedUrl = await Storage.get(key)

    const track = new Sound(signedUrl, null, (e) => {
        if (e) {
            console.warn('error loading track:', e)
        } else {
            if (callback != null) {
                track.play(() => {
                    callback(track)
                })
            } else {
                track.play()
            }
        }
    })
}

interface AudioCardParam {
    audioEntryPair: AudioEntryPair
    isPaused: boolean
    togglePaused: () => void
}
const AudioCard = (param: AudioCardParam) => {
    const [settingMode, setSettingMode] = useState(false)
    const [cardHeight, setCardHeight] = useState(0)
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    return (
        <View
            style={[
                styles.card,
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
            ]}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout
                if (height > cardHeight) {
                    setCardHeight(height)
                }
            }}
        >
            {settingMode ? (
                <AudioCardSettings
                    removeCallback={(
                        englishFile: string,
                        chineseFile: string
                    ) => {
                        removeEntry(englishFile, chineseFile)
                    }}
                    backCallback={() => {
                        setSettingMode(false)
                    }}
                    minCardHeight={cardHeight}
                    englishFile={param.audioEntryPair.englishKey}
                    chineseFile={param.audioEntryPair.chineseKey}
                />
            ) : (
                <AudioCardActive
                    audioEntryPair={param.audioEntryPair}
                    cardTextColor={
                        pausedIds.includes(param.audioEntryPair.id)
                            ? 'gray'
                            : 'black'
                    }
                    togglePaused={() => {

                        if (!pausedIds.includes(param.audioEntryPair.id)) {
                            const addArr = Array.from(pausedIds)
                            addArr.push(param.audioEntryPair.id)
                            setPausedIds(addArr)
                        } else {
                            const trimmedArr = removeFromArray(
                                Array.from(pausedIds),
                                param.audioEntryPair.id
                            )
                            setPausedIds(trimmedArr)
                        }
                    }}
                    setSettingMode={() => {
                        setSettingMode(true)
                    }}
                ></AudioCardActive>
            )}
        </View>
    )
}

export { AudioCard, playAudio }
