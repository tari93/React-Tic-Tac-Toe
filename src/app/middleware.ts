import {call, put, select, takeEvery, takeLatest} from "redux-saga/effects"
import { Square } from "../types/square"
import { RootState } from "./store"

const getMatrix = (state:RootState) => state.game.matrix
const getStatus = (state:RootState) => state.game.status
const getPlayerTurn = (state:RootState) => state.game.playerTurn

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
const winningCombinations:string[][] = [
    ['0,0', '1,1','2,2'],
    ['0,0', '0,1','0,2'],
    ['1,0', '1,1', '1,2'],
    ['2,0', '2,1', '2,2'],
    ['0,0', '1,0','2,0'],
    ['0,1', '1,1', '2,2'],
    ['0,2', '1,2', '2,2'],
    ['0,2', '1,1','2,0'],

]

function robotPlay(boardMatrix:Square[][]){
    let setX:Square[]=[]
    let setO:Square[] = []
    let possibleXMove: any[] = []
    let possibleOMove: any[] = []
    for (let line of boardMatrix) {
        let selectedX:Square[] = line.filter((item) => item.symbol === 'X' )
        setX.push(...selectedX)
        let selectedO:Square[] = line.filter((item) => item.symbol === 'O')
        setO.push(...selectedO)
        
    }
    let arrX:any[] = setX.map((elem) => elem.position!.join(','))
    let arrO = setO.map((elem) => elem.position!.join(','))
    for (let line of winningCombinations) {
        let scoreX = line.filter((item) => (arrX.includes(item))).length
        let scoreO = line.filter((item) => (arrO.includes(item))).length
        let resultX:any[]= line.filter((item) => !arrX.includes(item) && !arrO.includes(item))
        .map(elem => ({elem:elem, score:scoreX }))
        possibleXMove.push(...resultX)
        let resultO:any[]= line.filter((item) => !arrX.includes(item) && !arrO.includes(item))
        .map(elem => ({elem:elem, score:scoreO }))
        possibleOMove.push(...resultO)
    }
    // Order possibles moves by score
    possibleXMove.sort((a,b) => b.score - a.score)
    possibleOMove.sort((a,b) => b.score - a.score)
    let [row, column] = (possibleOMove[0].score >= possibleXMove[0].score  ?  possibleOMove[0].elem: possibleXMove[0].elem).split(',')
    return  boardMatrix[row][column]

}

function* checkWin(action: any): any{
    const matrix:Square[][] = yield select(getMatrix)
    const status = yield select(getStatus)
    const playerTurn = yield select(getPlayerTurn)
    const linesIntersection: Square[][] = yield call(getLinesIntersection, matrix, action.payload.selectedSquare)
    const filledLine:Square[]  = yield call(winning, linesIntersection, action.payload.selectedSquare)
    let tempMatrix:Square[][] = matrix.filter((line) =>{
        line = line.filter((s) => {
            return s.symbol !== ''
        })
        if (line.length === 3){
            return line
        }
    })
    // get the correct line
    if (filledLine.length === 3 && filledLine.find((square) => square.symbol === 'X')){
        yield put({ type: 'game/win', payload: filledLine})
    }

    else if (filledLine.length === 3 && filledLine.find((square) => square.symbol === 'O')){
        yield put({ type: 'game/lose', payload: filledLine})
    }

    else {
        if (JSON.stringify(matrix) === JSON.stringify(tempMatrix)){
            yield put({ type: 'game/tie' })
        }
        else {
            if(status === 'Play' && playerTurn === 'Robot'){
                const robotTurn:Square = yield call(robotPlay, matrix)
                yield put({ type: 'game/selectSquare', payload: {selectedSquare: robotTurn, symbol: 'O'}})
            }
        }
    }
}


function* gameMiddleware(){
    yield takeLatest('game/selectSquare', checkWin)
}


export default gameMiddleware
