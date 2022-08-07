import {call, put, select, takeEvery} from "redux-saga/effects"
import { Square } from "../types/square"
import { RootState } from "./store"

const getMatrix = (state:RootState) => state.game.matrix

function winning(selectedLines:Square[][], filledSquare:Square) {
    let result:Square[] = []
    for (let line of selectedLines){
        result = line.filter((s) => s.symbol === filledSquare.symbol)
        if (result.length === 3){
            return result
        }
    }
    return []
}


function getLinesIntersection(matrix:Square[][], square:Square){
    // Get lines intersection between selected position and matrix lines
    const board_size:number = matrix.length
    let lines:Square[][] = []
    let row:Square[] = []
    let column:Square[] = []
    let diagonals: Square[][] = [
        [matrix[0][0], matrix[1][1], matrix[board_size -1][board_size-1]],
        [matrix[0][board_size -1], matrix[1][1], matrix[board_size -1][0]],
    ]
    // Fill row that intersect with square position
    for (let elem of matrix[square.position![0]]){
        row.push(elem)
    }
    // Fill column that intersect with square position
    for (let index = 0; index< board_size; index++){
        column.push(matrix[index][square.position![1]])
    }
    // check diagonals
    diagonals = diagonals.filter((line) => {
        for (let s of line){
            if (JSON.stringify(s.position) === JSON.stringify(square.position)){
                return line
            }
        }
    })
    
    lines.push(row, column)
    if (diagonals.length > 0){
        lines.push(...diagonals)
    }
    return lines
}

function robotPlay(boardMatrix:Square[][]){
    let robotSquare: Square | undefined = undefined
    let index = 0
    const filledLines = boardMatrix.filter((line:Square[]) =>{
        for (let s of line){
            if (s.symbol !== ''){
                return line
            }
        }
    })

    while (robotSquare === undefined && index < filledLines.length){
        console.log(`${index} ${filledLines[index]}`)
        robotSquare = filledLines[index]!.find((s) => {
            console.log(`synbol ${s}`)
            return s.symbol === ''
        })
        index += 1
    }
    if (robotSquare === undefined){
        let line:Square[] | undefined = boardMatrix.find((line) => {
            return line.find((s) => {
                return s.symbol === ''
            })
        })
        robotSquare = line!.find((s) => {
            return s.symbol === ''
        })
    }
    return robotSquare
}

function* boardFilled(action: any): any{
    const matrix:Square[][] = yield select(getMatrix)
    let tempMatrix:Square[][] = matrix.filter((line) =>{
        line = line.filter((s) => {
            console.log(`Symbol ${s.symbol !== ''}`)
            return s.symbol !== ''
        })
        if (line.length === 3){
            return line
        }
    })
    if (JSON.stringify(matrix) === JSON.stringify(tempMatrix)){
        yield put({ type: 'game/tie' })
    }
}

function* checkWin(action: any): any{
    const matrix:Square[][] = yield select(getMatrix)
    const linesIntersection: Square[][] = yield call(getLinesIntersection, matrix, action.payload.selectedSquare)
    const filledLine:Square[]  = yield call(winning, linesIntersection, action.payload.selectedSquare)
    // get the correct line
    if (filledLine.length === 3){
        yield put({ type: 'game/win', payload: filledLine})
    }
    else {
        const robotTurn:Square = yield call(robotPlay, matrix)
        yield put({ type: 'game/robotTurn', payload: {selectedSquare: robotTurn, symbol: 'O'}})
    }
}


function* gameMiddleware(){
    yield takeEvery('game/selectSquare', boardFilled)
    yield takeEvery('game/selectSquare', checkWin)
}



export default gameMiddleware
