/*
export function someAction (context) {
}
*/

export function setFile ({commit} , payload){
    commit("setFile", payload)
}


export function setBase64 ({commit} , payload){
    commit("setBase64", payload)
}