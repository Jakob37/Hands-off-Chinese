import React, { useContext } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'
import { AudioEntryPair } from 'src/backend/audioentry'
import {
    AudioPlayerContext,
    PausedIdsContext,
} from '../../../store/contexts/contexts'
// import { PlayerCard } from '../card/playercard'
import { AudioCard } from './audiocardlist'

interface PlayerCardListProps {
    listEntries: AudioEntryPair[]
    user: string
}
const PlayerCardList = (props: PlayerCardListProps) => {
    const { pausedIds, setPausedIds } = useContext(PausedIdsContext)

    // FIXME: Should this be used, or removed?
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
                        user={props.user}
                        english={audioEntry.english}
                        chinese={audioEntry.chinese}
                        englishKey={audioEntry.englishKey}
                        chineseKey={audioEntry.chineseKey}
                    ></AudioCard>
                )
            })}
        </View>
    )
}

interface PlayerCardProps {}
const PlayerCard = (props: PlayerCardProps) => {}

export { PlayerCardList }
