import { ADD_CATEGORY } from '../actions/testcategories'

const DUMMY_CATEGORIES = ['Category A', 'Category B', 'Category C']

const initialState = {
    categories: DUMMY_CATEGORIES,
}

const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CATEGORY:
            console.log('Adding')
            state.categories.push(action.category)
        default:
            return state
    }
}

export default categoriesReducer
