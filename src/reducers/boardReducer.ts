

export const mark = () => {
    return { type: "mark" }
}

export const unmark = () => {
    return { type: "unmark" }
}


export const uncover = (uncovered: number) => {
    return { type: "uncover", uncovered: uncovered }
}

export const mine = () => {
    return { type: "mine" }
}

export const dispatchers = {
    mark, unmark, uncover, mine
}

export const boardReducer = (state = { mark: 0, uncover: 0, mine: 0 }, dispatch: { type: string, uncovered?: number }) => {
    switch (dispatch.type) {
        case "mark":
            return {
                mark: state.mark + 1,
                uncover: state.uncover,
                mine: state.mine,
            }
        case "mark":
            return {
                mark: state.mark - 1,
                uncover: state.uncover,
                mine: state.mine,
            }
        case "uncover":
            if (dispatch.uncovered !== undefined) {
                return {
                    mark: state.mark,
                    uncover: dispatch.uncovered,
                    mine: state.mine,
                }
            }
            return {
                mark: state.mark,
                uncover: 0,
                mine: state.mine,
            }
        case "mine":
            return {
                mark: state.mark,
                uncover: state.uncover,
                mine: state.mine + 1,
            }
        default:
            return state
    }
};
