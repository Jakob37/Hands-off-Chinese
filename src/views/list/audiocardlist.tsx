import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'
import { AudioEntryPair } from '../../backend/audioentry'
import { IconsCard, TwoLineCard } from '../../uicomponents/cards'
import {
    FlaggedIdsContext,
    PausedIdsContext,
} from '../../../store/contexts/contexts'
import { sc } from '../../uicomponents/style'
import { toggleEntryInArray } from '../../util/util'
import { playAudio } from '../card/util'

interface AudioCardProps {
    id: string
    chinese: string
    english: string
    chineseKey: string
    englishKey: string
    user: string
}
const AudioCard = (props: AudioCardProps) => {
    const [settingsOpened, setSettingsOpened] = useState(false)

    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)
    const { flaggedIds, setFlaggedIds } = useContext(FlaggedIdsContext)

    return (
        <View key={props.id}>
            {!settingsOpened ? (
                <TwoLineCard
                    firstText={props.chinese}
                    secondText={props.english}
                    firstAction={() => {
                        playAudio(props.chineseKey, props.user)
                    }}
                    secondAction={() => {
                        playAudio(props.englishKey, props.user)
                    }}
                    icons={[
                        {
                            icon: 'gear',
                            action: () => {
                                setSettingsOpened(!settingsOpened)
                            },
                        },
                    ]}
                ></TwoLineCard>
            ) : (
                <IconsCard
                    icons={[
                        {
                            icon: 'remove',
                            action: () => {
                                console.log('FIXME: Currently not implemented')
                            },
                        },
                        {
                            icon: 'flag',
                            action: () => {
                                const updatedArr = toggleEntryInArray(
                                    flaggedIds,
                                    props.id
                                )
                                setFlaggedIds(updatedArr)
                            },
                            color: flaggedIds.includes(props.id)
                                ? sc.colors.blue
                                : sc.colors.black,
                        },
                        {
                            icon: 'pause',
                            action: () => {
                                const updatedArr = toggleEntryInArray(
                                    pausedIds,
                                    props.id
                                )
                                setPausedIds(updatedArr)
                            },
                            color: pausedIds.includes(props.id)
                                ? sc.colors.yellow
                                : sc.colors.black,
                        },
                        {
                            icon: 'gear',
                            action: () => {
                                setSettingsOpened(!settingsOpened)
                            },
                        },
                    ]}
                ></IconsCard>
            )}
        </View>
    )
}

interface AudioCardListProps {
    listEntries: AudioEntryPair[]
    user: string
}
const AudioCardList = (props: AudioCardListProps) => {
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    useEffect(() => {
        console.log('--- Testing responding pausedIds change ---')
    }, [pausedIds])

    return (
        <View>
            {props.listEntries.map((audioEntry, i) => {
                return (
                    <AudioCard
                        key={i}
                        id={audioEntry.id}
                        chinese={audioEntry.chinese}
                        english={audioEntry.english}
                        chineseKey={audioEntry.chineseKey}
                        englishKey={audioEntry.englishKey}
                        user={props.user}
                    ></AudioCard>
                    // <AudioCard
                    //     key={i}
                    //     user={param.user}
                    //     audioEntryPair={audioEntry}
                    //     togglePaused={() => {
                    //         if (!pausedIds.includes(audioEntry.id)) {
                    //             console.log('adding')
                    //             setPausedIds([...pausedIds, audioEntry.id])
                    //         } else {
                    //             // FIXME: Utility function
                    //             const spliceIndex = pausedIds.indexOf(
                    //                 audioEntry.id
                    //             )
                    //             pausedIds.splice(spliceIndex, 1)
                    //             setPausedIds([...pausedIds])
                    //         }
                    //     }}
                    //     isPaused={pausedIds.includes(audioEntry.id)}
                    // />
                )
            })}
        </View>
    )
}

export { AudioCardList }
