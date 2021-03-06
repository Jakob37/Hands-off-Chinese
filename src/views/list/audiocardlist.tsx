import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { AudioEntryPair } from '../../backend/audioentry'
import { IconsCard, TwoLineCard } from '../../uicomponents/cards'
import {
    DbContext,
    FlaggedIdsContext,
    PausedIdsContext,
} from '../../../store/contexts/contexts'
import { sc } from '../../uicomponents/style'
import { toggleEntryInArray } from '../../util/util'
import { playAudio } from '../card/util'
import { FLAGS_ID, putUserDataRequest } from '../../backend/apicalls'

interface AudioCardListProps {
    listEntries: AudioEntryPair[]
    user: string
}
const AudioCardList = (props: AudioCardListProps) => {
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
                )
            })}
        </View>
    )
}

//FIXME: Generalize the pausing / flagging code here

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
    const { db } = useContext(DbContext)

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
                    textStyle={{
                        color: pausedIds.includes(props.id)
                            ? sc.colors.gray
                            : sc.colors.black
                    }}
                    icons={[
                        {
                            icon: 'gear',
                            action: () => {
                                setSettingsOpened(!settingsOpened)
                            },
                            color: pausedIds.includes(props.id)
                            ? sc.colors.gray
                            : sc.colors.black
                        },
                        {
                            icon: 'flag',
                            action: () => {
                                const updatedFlaggedIds = toggleEntryInArray(
                                    flaggedIds,
                                    props.id
                                )
                                setFlaggedIds(updatedFlaggedIds)
                                putUserDataRequest(FLAGS_ID, db.getUser(), updatedFlaggedIds)
                            },
                            color: flaggedIds.includes(props.id)
                                ? sc.colors.blue
                                : pausedIds.includes(props.id)
                                ? sc.colors.gray
                                : sc.colors.black,
                        },
                        // {
                        //     icon: 'pause',
                        //     action: () => {
                        //         console.log('Triggering pause')
                        //         const updatedArr = toggleEntryInArray(
                        //             pausedIds,
                        //             props.id
                        //         )
                        //         setPausedIds(updatedArr)
                        //     },
                        //     color: pausedIds.includes(props.id)
                        //         ? sc.colors.gray
                        //         : sc.colors.black,
                        // },
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
                                ? sc.colors.gray
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

export { AudioCardList, AudioCard }
