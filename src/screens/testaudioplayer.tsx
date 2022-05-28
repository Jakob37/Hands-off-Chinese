import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { TextSettings } from '../uicomponents/buttons'
import { NewAudioPlayerClass } from '../audio/NewAudioPlayer'
import { AudioEntryPair } from '../backend/audioentry'
import ClickableIcon from '../uicomponents/clickableicon'
import { icons, styleConstants } from '../uicomponents/style'
import { getSignedUrl } from '../views/card/util'

const SILENCE_SECONDS = 3

// TP: Could these modes be used as a source here?
const PLAYER_MODES = {
    // english_chinese: ['chinese', 'silence'],
    english_chinese: ['english', 'silence', 'chinese', 'silence'],
    chinese_only: ['chinese', 'pause'],
    chinese_english: ['chinese', 'silence', 'english', 'silence'],
} as Record<string, ('english' | 'chinese' | 'silence')[]>

const audioPlayer = new NewAudioPlayerClass()

interface NewAudioPlayerProps {
    audioEntries: AudioEntryPair[]
    newEntryCallback: (newEntry: AudioEntryPair) => void
}
function NewAudioPlayer(props: NewAudioPlayerProps) {
    const [playLanguages, setPlayLanguages] = useState<
        ('english' | 'chinese' | 'silence')[]
    >(PLAYER_MODES.english_chinese)
    const [playAudioIndices, setPlayAudioIndices] = useState({
        language: 0,
        audio: 0,
    })
    // const [audioEntryIndex, setAudioEntryIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playSeconds, setPlaySeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [soundName, setSoundName] = useState('')
    const [isRepeating, setIsRepeating] = useState(false)

    const [adaptivePause, setAdaptivePause] = useState(false)
    const [silenceSetting, setSilenceSetting] = useState(SILENCE_SECONDS)
    const [lastSoundDuration, setLastSoundDuration] = useState(1)
    const [silenceDurationSeconds, setSilenceDuration] =
        useState(SILENCE_SECONDS)

    const [soundOrSilence, setSoundOrSilence] =
        useState<'sound' | 'silence'>('sound')

    useEffect(() => {
        if (!adaptivePause) {
            setSilenceDuration(silenceSetting)
        } else {
            setSilenceDuration(silenceSetting * lastSoundDuration)
        }
    }, [adaptivePause, silenceSetting, lastSoundDuration])

    useEffect(() => {
        setIsPlaying(false)
    }, [adaptivePause, silenceSetting])

    const incrementPlayModeIndex = () => {
        let playIndex = playAudioIndices.language + 1
        let entryIndex = playAudioIndices.audio
        if (playIndex >= playLanguages.length) {
            playIndex -= playLanguages.length
            if (!isRepeating) {
                entryIndex = (entryIndex + 1) % props.audioEntries.length
            }
        }

        setPlayAudioIndices({ language: playIndex, audio: entryIndex })
        // setAudioEntryIndex(entryIndex)
    }

    useEffect(() => {
        console.log('Changing silence duration to', silenceDurationSeconds)
        audioPlayer.changeSilenceDuration(silenceDurationSeconds)
    }, [silenceDurationSeconds])

    // When audio entries changes
    useEffect(() => {
        return () => {
            console.log('--- Detaching')
            setPlaySeconds(0)
            audioPlayer.detach()
            setSoundName('')
        }
    }, [props.audioEntries])

    useEffect(() => {
        console.log('>>> Initializing audio player')
        audioPlayer.init(soundOrSilence, (time) => {
            setPlaySeconds(time)
        })
        audioPlayer.setPlayCompleteCallback(
            () => {
                incrementPlayModeIndex()
            },
            false,
            null
        )

        if (isPlaying) {
            console.log(
                '[Screen] unpause, state:',
                playAudioIndices,
                'is playing',
                isPlaying
            )
            audioPlayer.unpause()
        } else {
            console.log(
                '[Screen] pause, state:',
                playAudioIndices,
                'is playing',
                isPlaying
            )
            audioPlayer.pause()
        }

        // Seems like the 'isPlaying' is needed to update the callbacks on pause
    }, [props.audioEntries, isPlaying])

    useEffect(() => {
        console.log('[Screen] audio indices', playAudioIndices)
        // const soundOrSilence =
        //     playAudioIndices.language == 1 ? 'silence' : 'sound'
        const soundOrSilence =
            playLanguages[playAudioIndices.language] == 'silence'
                ? 'silence'
                : 'sound'
        setSoundOrSilence(soundOrSilence)
        audioPlayer.setPlayCompleteCallback(
            () => {
                incrementPlayModeIndex()
            },
            true,
            soundOrSilence
        )
        // playNew()
    }, [playAudioIndices])

    // FIXME: Reduce away the 'soundOrSilence' state, and calculate directly
    // from the indices
    useEffect(() => {
        playNew()
    }, [soundOrSilence])

    const playNew = () => {
        // const playingLanguage = playLanguages[playAudioIndices.language]
        console.log('[Screen] playingLanguage', soundOrSilence)
        if (soundOrSilence != 'silence') {
            console.log('[Screen] Loading sound')
            loadSound(() => {
                console.log('[Screen] Loading completed')
                if (isPlaying) {
                    audioPlayer.playSound()
                }
            })
        } else {
            // FIXME: Return this
            console.log('[Screen] Playing silence')
            audioPlayer.playSilence(silenceDurationSeconds * 1000)
            setDuration(silenceDurationSeconds)
        }
    }

    const loadSound = async (loadCompleteCallback: () => void) => {
        console.assert(props.audioEntries.length > 0)

        console.log('[Screen] loadSound')

        const playingLanguage = playLanguages[playAudioIndices.language]

        const currAudioEntry = props.audioEntries[playAudioIndices.audio]
        if (playAudioIndices.language == 0) {
            props.newEntryCallback(currAudioEntry)
        }
        const user = currAudioEntry.user
        const id =
            playingLanguage == 'chinese'
                ? currAudioEntry.chineseKey
                : currAudioEntry.englishKey
        const key = `${user}/${id}`
        const url = await getSignedUrl(key)

        setSoundName(key)

        audioPlayer.loadAudio(
            url,
            key,
            (error) => {
                console.log('failed to load the sound', error)
                setIsPlaying(false)
            },
            (sound) => {
                const soundDuration = sound.getDuration()
                setDuration(soundDuration)
                setLastSoundDuration(soundDuration)
                loadCompleteCallback()
            }
        )
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                }}
            >
                <View>
                    <ClickableIcon
                        icon={icons.minusCircled}
                        clickCallback={() => {
                            setSilenceSetting(silenceSetting - 1)
                        }}
                        size={styleConstants.iconSizes.large}
                    ></ClickableIcon>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setAdaptivePause(!adaptivePause)
                        }}
                    >
                        <Text style={{ alignSelf: 'center' }}>
                            {silenceSetting}
                            {adaptivePause ? 'x' : 's'} pause
                        </Text>
                    </TouchableOpacity>
                </View>

                <ClickableIcon
                    icon={icons.plusCircled}
                    clickCallback={() => {
                        setSilenceSetting(silenceSetting + 1)
                    }}
                    size={styleConstants.iconSizes.large}
                ></ClickableIcon>

                {isPlaying && (
                    <ClickableIcon
                        icon={icons.pause}
                        clickCallback={() => {
                            setIsPlaying(false)
                        }}
                        size={styleConstants.iconSizes.large}
                    ></ClickableIcon>
                )}
                {!isPlaying && (
                    <ClickableIcon
                        icon={icons.play}
                        clickCallback={() => {
                            setIsPlaying(true)
                        }}
                        size={styleConstants.iconSizes.large}
                    ></ClickableIcon>
                )}

                <Text style={{ alignSelf: 'center' }}>
                    {`${(Math.round(playSeconds * 10) / 10).toString()} / ${(
                        Math.round(duration * 10) / 10
                    ).toString()} s`}
                </Text>

                <ClickableIcon
                    icon={icons.repeat}
                    iconColor={
                        isRepeating
                            ? styleConstants.colors.blue
                            : styleConstants.colors.black
                    }
                    clickCallback={() => {
                        setIsRepeating(!isRepeating)
                    }}
                    size={styleConstants.iconSizes.large}
                ></ClickableIcon>

                <View style={{ alignSelf: 'center' }}>
                    <TextSettings
                        onValueUpdate={(newValue) => {
                            audioPlayer._playSpeed = newValue
                            console.log('Setting play speed', newValue)
                        }}
                        settings={[0.6, 0.7, 0.8, 0.9, 1, 1.25, 1.5, 1.75, 2].map(
                            (val) => {
                                return {
                                    value: val,
                                    display: `${val}x`,
                                }
                            }
                        )}
                        defaultIndex={4}
                    ></TextSettings>
                </View>

                {/* <ClickableIcon
                    icon={icons.leftArrow}
                    clickCallback={() => {
                        audioPlayer.jump(-JUMP_SECONDS)
                    }}
                    size={styleConstants.iconSizes.large}
                ></ClickableIcon>

                <ClickableIcon
                    icon={icons.rightArrow}
                    clickCallback={() => {
                        audioPlayer.jump(JUMP_SECONDS)
                    }}
                    size={styleConstants.iconSizes.large}
                ></ClickableIcon> */}
            </View>
        </View>
    )
}

export default NewAudioPlayer
