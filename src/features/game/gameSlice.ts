import { createSlice } from "@reduxjs/toolkit";
import { Square } from "../../types/square";

export interface GameState {
    matrix: Square[][],
    status: 'Win' | 'Lose' | 'Tie' | 'Play',
    playerTurn: 'Player' | 'Robot',
    filledLine: [],
    message: string
}
function initMatrix(): Square[][] {
    let matrix:Array<Array<Square>> = []
    for (let i=0;i<3;i++){
        let column = new Array<Square>()
        for (let j=0; j<3 ; j++){
            column.push(new Square([i,j]))
        }
        matrix.push(column)
    }
    return matrix
}

const initialState: GameState = {
    matrix: initMatrix(),
    status: 'Play',
    playerTurn: 'Player',
    filledLine: [],
    message: ''    
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        selectSquare: (state, action) => {
            state.matrix = state.matrix.map((column) => {
                column.map((s) => {
                    if (s.position === action.payload.selectedSquare.position){
                        s.isSelected = true
                        s.symbol = action.payload.symbol
                    }
                    return s
                })
                return column
            })
            state.playerTurn = state.playerTurn === 'Robot' ? 'Player': 'Robot'
        },
        replay: (state, action) => {
            state.matrix = initMatrix()
            state.status = 'Play'
            state.filledLine = []
            state.message = ''
            state.playerTurn = 'Player'
        },
        win: (state, action) =>{
            state.filledLine =  action.payload
            state.status = 'Win'
            state.message = 'Congratulations, you win the game!'
        },
        lose: (state, action) => {
            state.filledLine = action.payload
            state.status = 'Lose'
            state.message = 'Ops! The robot\'s 3afrite'
        },
        tie: (state, action) =>{
            state.status = 'Tie'
            state.message = 'A draw game'
        }
    },
})

export const { selectSquare, win, replay } = gameSlice.actions

export default gameSlice.reducer
