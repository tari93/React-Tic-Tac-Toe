import {useAppSelector, useAppDispatch} from '../../app/hooks'

import Board from "../board";
import { replay } from './gameSlice';
import './index.css'


function Game(){
    const message:string = useAppSelector((state) => state.game.message );
    const dispatch = useAppDispatch()
    return (
        <div className="game">
            <h3>React Tic Tac Toe</h3>
            <Board />
            { message !== '' && <div className='message'>{message}</div>}
            <button onClick={() => dispatch(replay({}))}>Replay</button>
        </div>
    );
}


export default Game