import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AudioEntryPair } from '../backend/audioentry'

const NAVIGATION = {
    main: 'Home' as 'Home',
    audioList: 'Audio entries' as 'Audio entries',
    audioPlayer: 'Audio player' as 'Audio player',
}

type RootStackParamList = {
    Home: undefined
    'Audio entries': { audioEntries: AudioEntryPair[], category: string }
    'Audio player': { audioEntries: AudioEntryPair[], category: string }
}
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type AudioEntriesProps = NativeStackScreenProps<
    RootStackParamList,
    'Audio entries'
>
type AudioPlayerProps = NativeStackScreenProps<RootStackParamList, 'Audio player'>

export { NAVIGATION, RootStackParamList, HomeProps, AudioEntriesProps, AudioPlayerProps }
