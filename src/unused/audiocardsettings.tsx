// import React from "react"
// import { View, Text } from "react-native"
// import ClickableIcon from "../../uicomponents/clickableicon"

// interface AudioCardSettingsInterface {
//     removeCallback: (englishFile: string, chineseFile: string) => void
//     backCallback: () => void
//     minCardHeight: number
//     englishFile: string
//     chineseFile: string
// }

// const AudioCardSettings = (param: AudioCardSettingsInterface) => {
//     return (
//         <View
//             style={{
//                 height: param.minCardHeight,
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//             }}
//         >
//             <ClickableIcon
//                 icon="times"
//                 size={30}
//                 iconColor="gray"
//                 clickCallback={() => {
//                     param.removeCallback(param.englishFile, param.chineseFile)
//                 }}
//             />
//             <ClickableIcon
//                 icon="exchange"
//                 size={30}
//                 iconColor="gray"
//                 clickCallback={param.backCallback}
//             />
//         </View>
//     )
// }

// export default AudioCardSettings
