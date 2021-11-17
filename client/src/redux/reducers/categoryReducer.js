export default function categoryReducer(state = {}, action) {
    switch(action.type) {
        case 'GET':
            return action.payload;
        default: 
            return state
    }
}