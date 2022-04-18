// import { AudioEntryPair } from "src/backend/audioentry"
// import { HocDb } from "src/backend/database"
// import AudioFooter from "./audiofooter"
// import CategoryFooter from "./categoryfooter"

// const React = require("react")
// const { View, TouchableOpacity, Text, TextInput } = require("react-native")


// interface FooterParam {
//     audioEntries: AudioEntryPair[],
//     backToMenu: () => void,
//     refreshCategories: () => void,
//     addNew: (english, chinese, category) => void,
//     isSelectedView: boolean,
//     db: HocDb
//     startCategory: string
//     updateCategory: (category: string) => void
//     loadDb: () => void
// }

// const Footer = (param: FooterParam) => {
//     return (
//         <View>
//             {param.isSelectedView ? (
//                 <AudioFooter
//                     audioEntries={param.audioEntries}
//                     db={param.db}
//                 />
//             ) : (
//                 <CategoryFooter
//                     refreshCategories={param.refreshCategories}
//                     addEntry={param.addNew}
//                     startCategory={param.startCategory}
//                     updateCategory={param.updateCategory}
//                     loadDb={param.loadDb}
//                 />
//             )}
//         </View>
//     )
// }

// export default Footer