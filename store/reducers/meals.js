
// Import from somewhere?
const MEALS = [
    { meal: 'pancakes' },
    { meal: 'meat balls' },
    { meal: 'macaroni' },
]

const initialState = {
    meals: MEALS,
    filteredMeals: MEALS,
    favoriteMeals: [],
}

const mealsReducer = (state = initialState, action) => {
    return state;
}

export default mealsReducer;
