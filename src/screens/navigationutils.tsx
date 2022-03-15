import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AudioEntryPair } from "../backend/audioentry"

const NAVIGATION = {
    main: 'Home',
    audioList: 'Audio entries',
    audioPlayer: 'Audio player'
}

type RootStackParamList = {
    Home: undefined
    'Audio entries': { audioEntries: AudioEntryPair[] }
    'Audio player': { audioEntries: AudioEntryPair[] }
}
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type AudioEntriesProps = NativeStackScreenProps<RootStackParamList, 'Audio entries'>

export { NAVIGATION, RootStackParamList, HomeProps, AudioEntriesProps };
