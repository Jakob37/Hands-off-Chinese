const { Categories } = require("../../components/menues/categories")
const React = require("react")
const { ScrollView } = require("react-native")

const AudioCardList = (param) => {
    return (
        <ScrollView>
            <Categories
                list={param.audioList}
                endAction={param.refreshS3List} 
            />
        </ScrollView>
    )
}

export default AudioCardList;
