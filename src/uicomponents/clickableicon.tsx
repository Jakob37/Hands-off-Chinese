import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { sc } from './style'
Icon.loadFont()

interface ClickableIconInterface {
    icon: string
    size: number
    iconColor: string
    backgroundColor: string
    clickCallback: () => void
}
const ClickableIcon = (param: ClickableIconInterface) => {
    return (
        <>
            <TouchableOpacity
                onPress={param.clickCallback}
            >
                <Icon
                    style={{
                        backgroundColor: param.backgroundColor,
                        borderRadius: param.size,
                        width: param.size + sc.iconPaddings.medium,
                        height: param.size + sc.iconPaddings.medium,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }}
                    name={param.icon}
                    size={param.size}
                    color={param.iconColor}
                ></Icon>
            </TouchableOpacity>
        </>
    )
}
ClickableIcon.defaultProps = {
    size: sc.iconSizes.medium,
    iconColor: sc.colors.black,
    backgroundColor: null,
}

export default ClickableIcon
