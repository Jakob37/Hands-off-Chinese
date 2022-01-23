import { useDispatch } from 'react-redux'
import { toggleFavorite, TOGGLE_FAVORITE } from '../actions/meals'

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
    switch (action.type) {
        case TOGGLE_FAVORITE:
            const existingIndex = state.favoriteMeals.findIndex(
                (meal) => meal.id == action.mealId
            )
            if (existingIndex >= 0) {
                const updatedFavMeals = { ...state.favoriteMeals }
                updatedFavMeals.splice(existingIndex, 1)
                return { ...state, favoriteMeals: updatedFavMeals }
            } else {
                const meal = state.meals.find(
                    (meal) => meal.id === action.mealId
                )
                return {
                    ...state,
                    favoriteMeals: state.favoriteMeals.concat(meal),
                }
            }
        default:
            return state
    }
}

// const dispatch = useDispatch();
// const toggleFavoriteHandler = useCallback(() => {
//     dispatch(toggleFavorite(mealId))
// }, [dispatch, mealId])

export default mealsReducer
