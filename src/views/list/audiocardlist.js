import { styles } from "../../Stylesheet"
import React from "react"
import { View, Text } from "react-native"
import { AudioCard } from "../card/audiocard"

const AudioCardList = (param) => {
    return (
        <View>
            <View>
                {
                    param.listEntries.map((audioObj, i) => {
                        console.log(audioObj)
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
                                    console.log("Pause action! Key:", i)
                                }}
                            />
                        )
                    })
                    // Array(20).fill().map((x, i) => { return <CategoryCard title={`Card ${i+1}`} key={i} /> })
                }
            </View>
        </View>
    )
}

export { AudioCardList }
