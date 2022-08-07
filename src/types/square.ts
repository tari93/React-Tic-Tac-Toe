export class Square {
    position?: number[];
    isSelected: boolean=false    
    symbol: string=''

    constructor(position:number[]){
        this.position = position
    }
}
