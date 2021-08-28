import { getTimestamp } from "./util";
import Amplify, { Storage } from "aws-amplify";

/**
 * @param {string} id 
 * @param {string} filename 
 */
 const testPost = async (id, filename) => {
    // const id = 'testid';
    // const filename = 'testfilename';
    const creationdate = new Date().getMilliseconds();

    const params = `{"id": "${id}", "filename": "${filename}", "creationdate": ${creationdate}}`;

    const apiUrl = 'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta';

    const apiTestXhr = new XMLHttpRequest();
    const isAsync = true;
    apiTestXhr.open('PUT', apiUrl, isAsync);
    apiTestXhr.setRequestHeader('Content-type', 'application/json');
    apiTestXhr.onreadystatechange = (e) => {
        // console.log(e);
        // @ts-ignore
        console.log(e.target.response);
        // console.log(Object.keys(e.target));
    }
    const result = await apiTestXhr.send(params);
    console.log(result);
    return result;
}

/**
 * @param {string} id 
 * @param {string} filename 
 */
const testGet = async (id, filename) => {
    // const id = 'testid';
    // const filename = 'testfilename';

    const params = `filename=testfilename`;
    // const params = `{"filename": "${filename}"}`;

    const apiUrl = `https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/meta`;

    const apiTestXhr = new XMLHttpRequest();
    const isAsync = true;
    apiTestXhr.open('GET', apiUrl+"?"+params, isAsync);
    apiTestXhr.setRequestHeader('Content-type', 'application/json');
    apiTestXhr.onreadystatechange = (e) => {
        // console.log(e);
        // console.log(e.target);
        // @ts-ignore
        console.log(e.target.response);
        // console.log(Object.keys(e.target));
    }
    const result = await apiTestXhr.send(null);
    console.log(result);
    return result;
}

/**
 * @param {string} apiUrl 
 * @param {string} text 
 * @param {string} voice 
 * @param {string} prefix 
 * @param {() => void} onReadyCall 
 */
const generateAudio = (apiUrl, text, voice, prefix, onReadyCall=null) => {

    const params = `{"text": "${text}", "voice": "${voice}", "prefix": "${prefix}"}`;

    const pollyXhr = new XMLHttpRequest();
    const isAsync = true;
    pollyXhr.open('POST', apiUrl, isAsync);
    pollyXhr.setRequestHeader('Content-type', 'application/json');
    pollyXhr.onreadystatechange = function (e) {
        // @ts-ignore
        // console.log('response', e.target.response);
        if (onReadyCall != null) {
            onReadyCall();
        }
    }
    pollyXhr.send(params);
}

/**
 * @param {string} english 
 * @param {string} chinese 
 * @param {() => void} onReadyCall 
 */
const generatePollyAudio = async (english, chinese, onReadyCall) => {

    const englishVoice = 'Emma';
    const chineseVoice = 'Zhiyu';

    generateAudio(
        'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly',
        chinese,
        chineseVoice,
        getTimestamp(),
        onReadyCall
    );

    generateAudio(
        'https://1meap5kmbd.execute-api.eu-west-1.amazonaws.com/dev/polly',
        english,
        englishVoice,
        getTimestamp(),
        onReadyCall
    );
}

/**
 * @returns {Promise<[string,string,string,string][]>}
 */
const retrieveEntriesFromS3 = async () => {

    console.log('Retrieving entries');

    const listResult = await Storage.list('');
    const s3Names = listResult.filter((result) => result.key != '').map((result) => result.key);

    /** @type {Map<string, {english:string, chinese:string, englishKey:string, chineseKey:string}>} */
    const baseToObj = new Map();

    // const splits = s3Names.map((name) => { return name.split('_') });
    for (const s3Name of s3Names) {
        const [base, languageString] = s3Name.split('_');
        const langObj = baseToObj.get(base);
        if (langObj == null) {
            baseToObj.set(base, {
                english: languageString,
                englishKey: s3Name,
                chinese: '',
                chineseKey: ''
            });
        } else {
            langObj.chinese = languageString;
            langObj.chineseKey = s3Name;
        }
    }

    const langArr = Array.from(baseToObj)
        .map(([_, obj]) => /** @type {[string,string,string,string]} */([
            obj.english,
            obj.englishKey,
            obj.chinese,
            obj.chineseKey
        ]));

    console.log(s3Names);

    return langArr;
}

export {
    testPost,
    testGet,
    generateAudio,
    generatePollyAudio,
    retrieveEntriesFromS3,
};
