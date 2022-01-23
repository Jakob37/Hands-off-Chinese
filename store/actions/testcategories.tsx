const ADD_CATEGORY = 'ADD_CATEGORY'

const addCategory = (category: string) => {
    return { type: ADD_CATEGORY, category }
}

export { ADD_CATEGORY, addCategory }
