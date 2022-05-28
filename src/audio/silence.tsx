import BackgroundTimer from 'react-native-background-timer'

const deltaMs = 50

class Silence {
    _duration: number
    _currentTime: number
    _paused: boolean
    _timeout = null
    _completeCallback: () => void

    constructor(durationMs: number) {
        this._duration = durationMs
        this._currentTime = 0
        this._paused = false

        this._timeout = BackgroundTimer.setInterval(() => {
            if (!this._paused) {
                this._currentTime += deltaMs
            }
            if (this._currentTime > this._duration) {
                console.log('Passed silence duration')
                this._silenceDone()
            }
        }, deltaMs)
    }

    detach() {
        clearInterval(this._timeout)
    }

    play(completeCallback: () => void) {
        this._completeCallback = completeCallback
        this._paused = false
    }

    setCurrentTime(time: number) {
        this._currentTime = time
    }

    getCurrentTime(): number {
        return this._currentTime
    }

    setDuration(newDurationMs: number) {
        this._duration = newDurationMs
        if (!this._paused && this._currentTime > this._duration) {
            this._silenceDone()
        }
    }

    _silenceDone() {
        this._completeCallback()
        this._currentTime = 0
        this._paused = true
    }

    isLoaded(): boolean {
        return true
    }

    pause() {
        this._paused = true
    }
}

export { Silence }
