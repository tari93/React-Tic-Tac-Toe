import './index.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSquare } from "../game/gameSlice";
import { Square } from "../../types/square";


function Box(props:{square: Square}) {
    const dispatch = useAppDispatch()
    const filledLine:Square[] = useAppSelector((state) => state.game.filledLine)
    return <div className={`box ${props.square.isSelected ? 'zoom selected' : '' } ${filledLine.find((square) => square.position === props.square.position) ? 'win': ''}`} onClick={()=>dispatch(selectSquare({selectedSquare: props.square, symbol: 'X'}))}>
        {props.square.symbol}

           </div>
}

export default Box;