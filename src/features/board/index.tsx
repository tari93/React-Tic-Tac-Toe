import { Square } from "../../types/square";
import Box from "../box";
import './index.css';
import { useAppSelector, useAppDispatch } from "../../app/hooks";


function Board(){
    const arrCombinations:Square[][] = useAppSelector((state) => state.game.matrix)
    const status = useAppSelector((state) => state.game.status)
    const filledLine:Square[] = useAppSelector((state) => state.game.filledLine)
    
    return (
        <div className={`${status !== 'Play' && 'disabled'}`}>
            <div className='board'  >
            {arrCombinations.map((arr, columnIndex) => 
                arr.map((elem, rowIndex) => { return <Box key={[columnIndex,rowIndex].join('-')}  square={elem} /> }))}
            </div>
        </div>
        )    
    }


export default Board;
