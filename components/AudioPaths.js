class AudioPaths {
  label;
  english;
  chinese;
  constructor(basePath) {
    this.label = basePath;
    this.english = `${basePath}_english.mp3`;
    this.chinese = `${basePath}_chinese.mp3`;
  }
}

export {AudioPaths};
