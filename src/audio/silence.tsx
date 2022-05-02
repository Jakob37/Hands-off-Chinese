class Silence {

    _duration: number
    _currentTime: number
    _paused: boolean
    _timeout = null
    _completeCallback: () => void

    constructor(duration: number, completeCallback: () => void) {
        this._duration = duration
        this._currentTime = 0
        this._paused = false
        this._completeCallback = completeCallback

        this._timeout = setInterval(() => {
            if (!this._paused) {
                this._currentTime += 100
            }
            if (this._currentTime > this._duration) {
                
            }
        }, 100)
    }

    play(completeCallback: () => void) {
    }

    setCurrentTime(time: number) {
        this._currentTime = time
    }

    getCurrentTime(): number {
        return this._currentTime
    }

    isLoaded(): boolean {
        return true
    }
}

export { Silence }
