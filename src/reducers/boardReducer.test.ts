import { boardReducer, dispatchers } from './boardReducer';


describe('Test', () => {
    test('reducer', () => {
        const state = { mark: 0, undercover: 0 };
        let newState = boardReducer(state, dispatchers.mark());
        expect(newState).toEqual({ mark: 1, undercover: 0 });
    });
})