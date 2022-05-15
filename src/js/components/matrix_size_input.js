const maxMatrixSize = 10;
const inputSize = 216;
const squareSize = inputSize / maxMatrixSize;

class MatrixSizeInput extends HTMLElement {
    value = 0;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const wrapper = document.createElement("div");
        wrapper.classList = ["wrapper"];

        const hoverableWrapper = document.createElement("div");
        hoverableWrapper.classList = ["hoverable-wrapper"];
        wrapper.appendChild(hoverableWrapper);


        for (let ri = 0; ri < maxMatrixSize; ri++) {
            const row = document.createElement("div");
            row.classList = ["row"];
            wrapper.appendChild(row);

            const hoverableRow = document.createElement("div");
            hoverableRow.classList = ["row"];
            hoverableWrapper.appendChild(hoverableRow);

            
            for (let ci = 0; ci < maxMatrixSize; ci++) {
                const square = document.createElement("div");
                square.classList = ["square"];
                square.setAttribute("data-row", ri+1);
                square.setAttribute("data-col", ci+1);

                const hoverableSquare = document.createElement("div");
                hoverableSquare.classList = ["hoverable-square"];
                hoverableSquare.setAttribute("data-row", ri+1);
                hoverableSquare.setAttribute("data-col", ci+1);
                let resolution = ri > ci ? ri : ci;
                hoverableSquare.title = (resolution+1)+"x"+(resolution+1)
                
                hoverableSquare.addEventListener("mouseover", (e) => this.onHoverSquare(e));
                hoverableSquare.addEventListener("click", (e) => this.onClickSquare(e));
                
                hoverableRow.appendChild(hoverableSquare);
                row.appendChild(square);
            }
        }

        const sizeTextWrapper = document.createElement("div");
        sizeTextWrapper.classList = ['size-text-wrapper'];

        const sizeText = document.createElement("span");
        sizeText.classList = ["size-text"];

        sizeTextWrapper.appendChild(sizeText)
        wrapper.appendChild(sizeTextWrapper);

        this.shadowRoot.addEventListener("mouseout", (e) => this.onMouseOut(e))

        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                width: ${inputSize}px;
                height: ${inputSize}px;
                border-radius: 5px;
                background-color: #EFEFEF;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                position: relative;
                border: 1px solid rgba(0,0,0,0.1);
            }
            .hoverable-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                position: absolute;
                display: flex;
                flex-direction: column;
                z-index: 5;
            }
            .row {
                height: ${squareSize}px;
                width: 100%;
                display: flex;
            }
            .square, .hoverable-square {
                height: ${squareSize}px;
                width: ${squareSize}px;
            }
            .square {
                border: 1px solid rgba(0,0,0,0.1);
                transition: 0.15s;
            }
            .square.hovering {
                background-color: #D2D2D2;
            }
            .square.selected {
                background-color: #008CC1;
            }
            .square.selected.hovering {
                background-color: #5c7c89;
            }
            .size-text-wrapper {
                position: absolute;
                z-index: 4;
                top: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.3s;
            }
            .size-text {
                color: #fff;
                font-size: 18px;
                text-shadow: 0 0px 6px rgba(0,0,0,0.65)
            }
        `;
        this.shadowRoot.append(style, wrapper)
        this.updateSizeText();
        this.setValue(4);
    }

    updateSizeText() {
        this.shadowRoot.querySelector(".size-text").textContent = this.value + "x" + this.value;
    }

    onMouseOut(e) {
        let squares = [...this.shadowRoot.querySelectorAll(".square")];
        squares = squares.filter(square => {
            square.classList.remove("hovering");
        })

    }

    onHoverSquare(e) {
        let preMatrixSize = this.getMatrixValueFromSquare(e.target);

        let squares = [...this.shadowRoot.querySelectorAll(".square")];
        squares = squares.filter(square => {
            square.classList.remove("hovering");
            let _r = parseInt(square.getAttribute("data-row"));
            let _c = parseInt(square.getAttribute("data-col"));
            if (_r <= preMatrixSize && _c <= preMatrixSize) {
                return true;
            }
        });
        squares.forEach(square => {
            square.classList.add("hovering");
        })
    }

    onClickSquare(e) {
        let preMatrixSize = this.getMatrixValueFromSquare(e.target);

        this.setValue(preMatrixSize);
    }

    getMatrixValueFromSquare(square) {
        let r = parseInt(square.getAttribute("data-row"));
        let c = parseInt(square.getAttribute("data-col"));
        let preMatrixSize = r > c ? r : c;
        if (preMatrixSize < 2) preMatrixSize = 2;
        return preMatrixSize;
    }

    setValue(newValue) {
        let squares = [...this.shadowRoot.querySelectorAll(".square")];
        squares = squares.filter(square => {
            square.classList.remove("selected");
            let _r = parseInt(square.getAttribute("data-row"));
            let _c = parseInt(square.getAttribute("data-col"));
            if (_r <= newValue && _c <= newValue) {
                return true;
            }
        });
        squares.forEach(square => {
            square.classList.add("selected");
        })
        this.value = newValue;
        this.updateSizeText();

        let sizeTextWrapper = this.shadowRoot.querySelector(".size-text-wrapper");
        sizeTextWrapper.style.width = (squareSize*newValue)+"px";
        sizeTextWrapper.style.height = (squareSize*newValue)+"px";
    }
}

window.customElements.define('matrix-size-input', MatrixSizeInput);