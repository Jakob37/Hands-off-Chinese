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

const iLikeFruits = [
    new AudioPaths('ilikeapples'),
    new AudioPaths('ilikeoranges'),
    new AudioPaths('ilikepears'),
];

const examRevision3 = [];
for (let i = 1; i <= 12; i++) {
  examRevision3.push(new AudioPaths(`exercise${i}`))
}

/** @type {Map<string,AudioLibrary>} */
const audioLibraries = new Map();
audioLibraries.set('exam_revision_3', new AudioLibrary(examRevision3));
audioLibraries.set('I like fruits', new AudioLibrary(iLikeFruits));

export { audioLibraries };
