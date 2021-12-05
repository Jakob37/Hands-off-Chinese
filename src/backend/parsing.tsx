import DocumentPicker from "react-native-document-picker"
import RNFS from "react-native-fs"
import Toast from "react-native-simple-toast"

async function writeCsvToDownloads(fileName: string, content: string[][]) {
    const path = RNFS.DownloadDirectoryPath + "/" + fileName
    const fileContent = content.map((colCells) => colCells.join(",")).join("\n")
    await RNFS.writeFile(path, fileContent, "utf8")
        .then((_success) => {
            Toast.show(`File written to ${path}`)
        })
        .catch((err) => {
            console.log(err.message)
        })
}

interface FileInfo {
    uri: string
    type: string
    name: string
    size: number
}

async function pickFileFromDisk(
    debug: boolean = false
): Promise<FileInfo | null> {
    let resultFile: FileInfo | null = null
    try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        })
        resultFile = res[0]
        if (debug) {
            console.log(
                resultFile.uri,
                resultFile.type,
                resultFile.name,
                resultFile.size
            )
        }
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            if (debug) {
                console.log("picker cancelled")
            }
        } else {
            Toast.show("Error", err)
        }
    }
    return resultFile
}

async function parseCsv(filePath: string): Promise<string[][] | null> {
    let cells = null
    try {
        const contents = await RNFS.readFile(filePath)
        cells = contents.split("\n").map((col) => col.split(","))
        Toast.show(`Found ${cells.length} entries`)
    } catch (e) {
        console.log("Parsing error", e)
    }
    return cells
}

export { writeCsvToDownloads, pickFileFromDisk, parseCsv }
