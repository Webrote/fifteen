'use strict';

class Fifteen {
    constructor({ element }) {
        this._element = element;

        this._matrix = this._getMatrix();

        this._render();

        this._counterPlace = this._element.querySelector('[data-element="counter"]');
        this._resultPlace = this._element.querySelector('[data-element="result"]');

        this._element.addEventListener('click', this._onTileClick.bind(this));

        Fifteen._counter = 0;
    }



    _render() {
        // this._element.innerHTML = '';
        let markup = '';

        for(let y = 0; y < 4; y++) {
            for(let x = 0; x < 4; x++) {
                if(this._matrix[y][x] !== 16) {
                    markup += `
                        <div class="cell"
                            data-num="${ this._matrix[y][x] }"
                            data-pos="${ String(x)+String(y) }"
                        ></div>
                    `
                }

            }
        }
        markup += `
                    <div class="counter__wrapper">
                        Moves: 
                    
                        <span data-element="counter"></span>
                    </div>
                    <div data-element="result"></div>
                   `;
        this._element.innerHTML = markup;
    }


    _getMatrix(){
        return [
            [1, 2,   3, 4],
            [5, 6,  11, 8],
            [9,16,  15,12],
            [13,10,  7,14],
        ];
    }

    _onTileClick(event){
        let tile = event.target.closest('.cell');

        if(!tile) {
            return;
        }

        let dataPos = tile.getAttribute('data-pos');
        let matrixXY = Fifteen._getMatrixXY(dataPos);
        let newPos = this._checkMatrixSiblings(matrixXY);

        if(newPos !== null) {
            Fifteen._counter++;
            this._showCounter();

            let temp = this._matrix[matrixXY.y][matrixXY.x];
            this._matrix[matrixXY.y][matrixXY.x] = 16;
            this._matrix[newPos.y][newPos.x] = temp;

            tile.setAttribute('data-pos', String(newPos.x)+String(newPos.y) );

            let customEvent = new CustomEvent('tileSlide');
            this._element.dispatchEvent(customEvent);

        }
        this._checkRightSet();
    }
    _showCounter() {
        this._counterPlace.innerHTML = `${ Fifteen._counter }`;
    }

    static _getMatrixXY(pos) {
        return {
            x: +pos[0],
            y: +pos[1]
        }
    }
    _checkMatrixSiblings(xyObj){
        if( xyObj.x !== 0 ){
            if( this._matrix[xyObj.y][xyObj.x-1] === 16 ) {
                return {
                    x: xyObj.x-1,
                    y: xyObj.y
                }
            }
        }

        if( xyObj.x !== 3 ) {
            if( this._matrix[xyObj.y][xyObj.x+1] === 16 ) {
                return {
                    x: xyObj.x+1,
                    y: xyObj.y
                }
            }
        }

        if( xyObj.y !== 0 ){
            if( this._matrix[xyObj.y-1][xyObj.x] === 16 ) {
                return {
                    x: xyObj.x,
                    y: xyObj.y-1
                }
            }
        }

        if( xyObj.y !== 3 ){
            if( this._matrix[xyObj.y + 1][xyObj.x] === 16 ) {
                return {
                    x: xyObj.x,
                    y: xyObj.y+1
                }

            }

        }

        return null;

    }

    _checkRightSet(){
        let newMatrix = [];

        function _checkArr(element, index){
            return (element === index+1);
        }

        for(let y = 0; y < 4; y++) {
            newMatrix = newMatrix.concat(this._matrix[y]);
        }

        if(newMatrix.every(_checkArr)) {
            this._counterPlace.innerHTML = `Game is over!
                                            Your score is ${ Fifteen._counter }`;
        }
    }
}

new Fifteen({
    element: document.querySelector('[data-field-container]')
})