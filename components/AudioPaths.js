class AudioPaths {
  /** @type {string} */
  label;
  /** @type {string} */
  english;
  /** @type {string} */
  chinese;

  /**
   * @param {string} basePath 
   */
  constructor(basePath) {
    this.label = basePath;
    this.english = `${basePath}_english.mp3`;
    this.chinese = `${basePath}_chinese.mp3`;
  }
}

export {AudioPaths};
