import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AudioEntryPair } from '../backend/audioentry'

const NAVIGATION = {
    main: 'Home' as 'Home',
    audioList: 'Audio entries' as 'Audio entries',
    audioPlayer: 'Audio player' as 'Audio player',
    testAudioPlayer: 'Test audio player' as 'Test audio player',
}

type RootStackParamList = {
    Home: undefined
    'Audio entries': { audioEntries: AudioEntryPair[] }
    'Audio player': { audioEntries: AudioEntryPair[] }
    'Test audio player': { audioEntries: AudioEntryPair[] }
}
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type AudioEntriesProps = NativeStackScreenProps<
    RootStackParamList,
    'Audio entries'
>
type TestAudioPlayerProps = NativeStackScreenProps<RootStackParamList, 'Test audio player'>

export { NAVIGATION, RootStackParamList, HomeProps, AudioEntriesProps, TestAudioPlayerProps }
