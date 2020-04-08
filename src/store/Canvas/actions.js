/*
export function someAction (context) {
}
*/

export function setCanvas({commit}, payload){
    commit("setCanvas", payload)
}

export function setContext( {commit}, payload){
    commit("setContext" , payload)
}

export function setCanvasTamanho( {commit}, payload){
    commit("setCanvasWidth" , payload.width)
    commit("setCanvasHeight" , payload.height)
}