/*
export function someMutation (state) {
}
*/

export function setCanvas(state,  payload){
    state.canvas = payload
}

export function setContext( state, payload){
    state.context = payload
}

export function setCanvasWidth( state, payload){
    state.width = payload
}

export function setCanvasHeight( state, payload){
    state.height = payload
}