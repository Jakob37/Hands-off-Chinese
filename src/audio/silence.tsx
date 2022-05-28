// import BackgroundTimer from 'react-native-background-timer'
// const deltaMs = 50

class Silence {
    _duration: number

    _currentStart: number

    _prevElapsed: number
    _currElapsed: number
    _paused: boolean
    _timeout = null
    _completeCallback: () => void

    constructor(durationMs: number) {
        this._duration = durationMs
        this._prevElapsed = 0
        this._currElapsed = 0
        this._paused = false

        this._currentStart = new Date().getTime()
    }

    update() {
        this._currElapsed = new Date().getTime() - this._currentStart
        const totElapsed = this._prevElapsed + this._currElapsed
        if (totElapsed > this._duration) {
            this._onComplete()
        }
    }

    play(completeCallback: () => void) {
        this._completeCallback = completeCallback
        this._paused = false

        this._currentStart = new Date().getTime()
    }

    getCurrentTime(): number {
        console.log(
            'Prev elapsed',
            this._prevElapsed,
            'curr elapsed',
            this._currElapsed
        )
        return this._prevElapsed + this._currElapsed
    }

    setDuration(newDurationMs: number) {
        this._duration = newDurationMs
        this._onComplete()
    }

    _onComplete() {
        this._completeCallback()
        this._prevElapsed = 0
        this._currElapsed = 0
        this._paused = true
    }

    isLoaded(): boolean {
        return true
    }

    pause() {
        this._paused = true
        this._prevElapsed += this._currElapsed
        this._currElapsed = 0
    }

    isPlaying(): boolean {
        return !this._paused
    }
}

export { Silence }
