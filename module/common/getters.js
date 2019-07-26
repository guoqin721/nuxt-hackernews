export const getterImgCode = state => {
    return {
        ...state.imgCode,
        extra: 'getter test'
    }
}