import { styles } from "../../Stylesheet";
import React from "react";
import { View, Text } from "react-native";
import { AudioCard } from "../card/audiocard";

const AudioCardList = (param) => {

    return (
        <View>
            <View>
                {
                    param.list.map((audioObj, i) => {
                        console.log(audioObj)
                        return (
                            <AudioCard key={i}
                                english={audioObj[0]}
                                englishKey={audioObj[1]}
                                chinese={audioObj[2]}
                                chineseKey={audioObj[3]}
                                endAction={param.endAction}
                            />
                        );
                    })
                    // Array(20).fill().map((x, i) => { return <CategoryCard title={`Card ${i+1}`} key={i} /> })
                }
            </View>
        </View>
    )

}

export { AudioCardList };