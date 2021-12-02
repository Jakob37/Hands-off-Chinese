import React from "react"
import { TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

interface ClickableIconInterface {
    icon: string
    size: number
    color: string
    clickCallback: () => void
}

const ClickableIcon = (param: ClickableIconInterface) => {
    return (
        <>
            <TouchableOpacity onPress={param.clickCallback}>
                <Icon
                    name={param.icon}
                    size={param.size}
                    color={param.color}
                ></Icon>
            </TouchableOpacity>
        </>
    )
}

export default ClickableIcon
