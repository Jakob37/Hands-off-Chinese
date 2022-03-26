import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, Text } from 'react-native-elements'
import { sc } from './style'

interface BasicCardProps {
    text: string
    action: () => void
}

const BasicCard = (props: BasicCardProps) => {
    return (
        <Card containerStyle={{ marginVertical: 5 }}>
            <TouchableOpacity onPress={props.action}>
                <Text style={{ fontSize: sc.fontSizes.cardLarge }}>
                    {props.text}
                </Text>
            </TouchableOpacity>
        </Card>
    )
}

export { BasicCard }
