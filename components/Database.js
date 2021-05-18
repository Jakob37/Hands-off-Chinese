const { AudioPaths } = require("./AudioPaths");

function testPrint() {
    console.log('test print');
}

class AudioLibrary {
    /** @type {AudioPaths[]} */
    audioPaths;
    constructor(audioPaths) {
        this.audioPaths = audioPaths;
    }
}

const audioPaths = [];
for (let i = 1; i <= 12; i++) {
  audioPaths.push(new AudioPaths(`exercise${i}`))
}

const audioLibraries = new Map();
audioLibraries.set('exam_revision_3', new AudioLibrary(audioPaths))

export { audioLibraries };
