const { Categories } = require("./categories")
const React = require("react")
const { ScrollView } = require("react-native")

const CategoryCardList = (param) => {
    return (
        <ScrollView>
            {/* <Categories
                list={param.audioList}
                endAction={param.refreshS3List} 
            /> */}
        </ScrollView>
    )
}

export default CategoryCardList;
