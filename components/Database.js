const { AudioPaths } = require("./AudioPaths");

class AudioLibrary {
    /** @type {AudioPaths[]} */
    audioPaths;
    /** @type {[string,string][]} */
    pathPairs;

    /**
     * @param {AudioPaths[]} audioPaths 
     */
    constructor(audioPaths) {
        this.audioPaths = audioPaths;
        this.pathPairs = /** @type {[string, string][]} */ (audioPaths.map((paths) => [paths.english, paths.chinese]));
    }
}

const iLikeFruits = [
    new AudioPaths('ilikeapples'),
    new AudioPaths('ilikeoranges'),
    new AudioPaths('ilikepears'),
];

const examRevision3 = [];
for (let i = 1; i <= 12; i++) {
  examRevision3.push(new AudioPaths(`exercise${i}`));
}

const examRevision4 = [];
for (let i = 1; i <= 23; i++) {
    examRevision4.push(new AudioPaths(`e${i}`));
}
  
/** @type {Map<string,AudioLibrary>} */
const audioLibraries = new Map();
audioLibraries.set('exam_revision_3', new AudioLibrary(examRevision3));
audioLibraries.set('I like fruits', new AudioLibrary(iLikeFruits));
audioLibraries.set('Exam revision 4', new AudioLibrary(examRevision4));

export { audioLibraries };
