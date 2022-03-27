import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { sc } from './style'

interface BasicCardProps {
    text: string
    action: () => void
    icon: string | null
}
const BasicCard = (props: BasicCardProps) => {
    return (
        <TouchableOpacity onPress={props.action}>
            <Card
                containerStyle={{ marginVertical: sc.componentMargins.small }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {props.icon != null && (
                        <Icon
                            name={props.icon}
                            size={sc.iconSizes.medium}
                            style={{ paddingRight: sc.componentMargins.medium }}
                        ></Icon>
                    )}
                    <Text style={{ fontSize: sc.fontSizes.cardLarge }}>
                        {props.text}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>
    )
}
BasicCard.defaultProps = {
    icon: null,
}

interface TwoLineCard {
    firstText: string
    secondText: string
    firstAction: () => void
    secondAction: () => void
    icons: string[]
    iconActions: (() => void)[]
}
const TwoLineCard = (props: TwoLineCard) => {
    return (
        <Card>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <View>
                    <TouchableOpacity>
                        <Text>{props.firstText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>{props.secondText}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text>Icons</Text>
                </View>
            </View>
        </Card>
    )
}

export { BasicCard, TwoLineCard }
