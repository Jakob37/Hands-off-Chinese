import React from "react"
import { View } from "react-native"
import { AudioCard } from "../card/audiocard"

const AudioCardList = (param) => {
    return (
        <View>
            <View>
                {
                    param.listEntries.map((audioObj, i) => {
                        return (
                            <AudioCard
                                key={i}
                                english={audioObj[0]}
                                englishKey={audioObj[1]}
                                chinese={audioObj[2]}
                                chineseKey={audioObj[3]}
                                isActive={audioObj[4]}
                                endAction={param.endAction}
                                pauseAction={() => {
                                    console.warn("Pause action! Key:", i)
                                }}
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

export { AudioCardList }
