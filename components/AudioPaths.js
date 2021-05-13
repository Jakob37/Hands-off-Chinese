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
  
  const audioPaths = [];
  audioPaths.push(new AudioPaths('ilikeapples'));
  audioPaths.push(new AudioPaths('ilikeoranges'));
  audioPaths.push(new AudioPaths('ilikepears'));

  export { AudioPaths, audioPaths };
  