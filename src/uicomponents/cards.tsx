import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import ClickableIcon from './clickableicon'
import { sc, sl } from './style'

// Valid font awesome icons can be found here:
// https://oblador.github.io/react-native-vector-icons/

interface IconDatum {
    icon: string
    action?: () => void
    color?: string
}

interface BasicCardProps {
    text: string
    action: () => void
    icon: IconDatum | null
}
const BasicCard = (props: BasicCardProps) => {
    return (
        <TouchableOpacity onPress={props.action}>
            <Card containerStyle={sl.card}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {props.icon != null && (
                        <Icon
                            name={props.icon.icon}
                            size={sc.iconSizes.medium}
                            style={{ paddingRight: sc.componentMargins.medium }}
                            color={props.icon.color}
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
    textStyle: Record<string, string | number>
    firstAction: () => void
    secondAction: () => void
    icons: IconDatum[]
}
const TwoLineCard = (props: TwoLineCard) => {
    return (
        <Card containerStyle={sl.card}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View>
                    <TouchableOpacity onPress={props.firstAction}>
                        <Text style={{ fontSize: sc.fontSizes.cardLarge, ...props.textStyle}}>
                            {props.firstText}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.secondAction}>
                        <Text
                            style={{
                                fontSize: sc.fontSizes.cardMedium,
                                ...props.textStyle
                            }}
                        >
                            {props.secondText}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    {props.icons.map(({ icon, action, color }, i) => {
                        return (
                            <ClickableIcon
                                key={i}
                                icon={icon}
                                clickCallback={action}
                                iconColor={color}
                            ></ClickableIcon>
                        )
                    })}
                </View>
            </View>
        </Card>
    )
}
TwoLineCard.defaultProps = {
    firstText: null,
    secondText: null,
    textStyle: undefined,
}

interface IconsCardProps {
    icons: IconDatum[]
}
const IconsCard = (param: IconsCardProps) => {
    return (
        <Card containerStyle={sl.card}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                {param.icons.map(({ icon, action, color }, i) => {
                    return (
                        <ClickableIcon
                            key={i}
                            icon={icon}
                            clickCallback={action}
                            size={sc.iconSizes.large}
                            iconColor={color != undefined ? color : undefined}
                        ></ClickableIcon>
                    )
                })}
            </View>
        </Card>
    )
}

export { BasicCard, TwoLineCard, IconsCard }
