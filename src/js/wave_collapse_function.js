

class WCFMatrixObject {
    top = 0
    topRight = 0
    right = 0
    botRight = 0
    bot = 0
    botLeft = 0
    left = 0
    topLeft = 0

    name = ""
    label = ""

    isVertex = false;
    graphVertex = null;

    constructor(name, label, isVertex=false) {
        this.name = name;
        this.label = label
        let coords = name.split("");
        this.top = parseInt(coords[0]);
        this.topRight = parseInt(coords[1]);
        this.right = parseInt(coords[2]);
        this.botRight = parseInt(coords[3]);
        this.bot = parseInt(coords[4]);
        this.botLeft = parseInt(coords[5]);
        this.left = parseInt(coords[6]);
        this.topLeft = parseInt(coords[7]);
        this.isVertex = isVertex;
    }

    rename() {
        this.name = `${this.top}${this.topRight}${this.right}${this.botRight}${this.bot}${this.botLeft}${this.left}${this.topLeft}`;
    }

    /** @param {WCFMatrixObject[]} items */
    getAllowedOnTop(items) {
        if (this.top === 0) {
            return items.filter(item => {
                return !item || item.bot === 0;
            })
        };
        return items.filter(item => {
            return !item || item.bot === 1;
        })
    }
    
    /** @param {WCFMatrixObject[]} items */
    getAllowedOnTopRight(items) {
        if (this.topRight === 0) {
            return items.filter(item => {
                return !item || item.botLeft === 0;
            })
        };
        return items.filter(item => {
            return !item || item.botLeft === 1;
        })
    }

    /** @param {WCFMatrixObject[]} items */
    getAllowedOnRight(items) {
        if (this.right === 0) {
            return items.filter(item => {
                return !item || item.left === 0;
            })
        };
        return items.filter(item => {
            return !item || item.left === 1;
        })
    }

    /** @param {WCFMatrixObject[]} items */
    getAllowedOnBotRight(items) {
        if (this.botRight === 0) {
            return items.filter(item => {
                return !item || item.topLeft === 0;
            })
        };
        return items.filter(item => {
            return !item || item.topLeft === 1;
        })
    }

    
    /** @param {WCFMatrixObject[]} items */
    getAllowedOnBot(items) {
        if (this.bot === 0) {
            return items.filter(item => {
                return !item || item.top === 0;
            })
        };
        return items.filter(item => {
            return !item || item.top === 1;
        })
    }

    
    /** @param {WCFMatrixObject[]} items */
    getAllowedOnBotLeft(items) {
        if (this.botLeft === 0) {
            return items.filter(item => {
                return !item || item.topRight === 0;
            })
        };
        return items.filter(item => {
            return !item || item.topRight === 1;
        })
    }

    
    /** @param {WCFMatrixObject[]} items */
    getAllowedOnLeft(items) {
        if (this.left === 0) {
            return items.filter(item => {
                return !item || item.right === 0;
            })
        };
        return items.filter(item => {
            return !item || item.right === 1;
        })
    }

    
    /** @param {WCFMatrixObject[]} items */
    getAllowedOnTopLeft(items) {
        if (this.topLeft === 0) {
            return items.filter(item => {
                return !item || item.botRight === 0;
            })
        };
        return items.filter(item => {
            return !item || item.botRight === 1;
        })
    }
}

const possibleObjects = [
    new WCFMatrixObject("10101010", "4way", true),

    new WCFMatrixObject("10000010", "top-left", true),
    new WCFMatrixObject("10100000", "top-right", true),

    new WCFMatrixObject("10001000", "top-bot"),

    new WCFMatrixObject("00001010", "bot-left", true),
    new WCFMatrixObject("00101000", "bot-right", true),

    new WCFMatrixObject("00100010", "left-right"),

    new WCFMatrixObject("10100010", "left-right-top", true),
    new WCFMatrixObject("00101010", "left-right-bot", true),

    
    new WCFMatrixObject("10001010", "top-bot-left", true),
    new WCFMatrixObject("10101000", "top-bot-left", true),

    // new WCFMatrixObject("01000100", "topRight-botLeft"),
    // new WCFMatrixObject("01100100", "topRight-botLeft-right", true),
    // new WCFMatrixObject("01000110", "topRight-botLeft-left", true),
    // new WCFMatrixObject("01100110", "topRight-botLeft-right-left", true),

    // new WCFMatrixObject("00010001", "botRight-topLeft"),
    // new WCFMatrixObject("00110001", "botRight-topLeft-right", true),
    // new WCFMatrixObject("00010011", "botRight-topLeft-left", true),
    // new WCFMatrixObject("00110011", "botRight-topLeft-right-left", true),
]

function getRandomFromList(list) {
    let min = 0;
    let max = list.length;
    return list[Math.floor(Math.random() * (max - min)) + min];
}

function generateWCFMatrix(matrixSize=4) {
    let matrix = [...Array(matrixSize)].map(e => [...Array(matrixSize)].map(e => null));
    
    matrix.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            let allowedItems = [...possibleObjects];
            // Same row, left side
            if (colIndex > 0 && row[colIndex-1]) {
                /** @type WCFMatrixObject */
                let leftSideItem = row[colIndex-1];
                allowedItems = leftSideItem.getAllowedOnRight(allowedItems); 
            }

            // Above row
            if (rowIndex > 0) {
                // Top side
                if (matrix[rowIndex-1][colIndex]) {
                    /** @type WCFMatrixObject */
                    let topSideItem = matrix[rowIndex-1][colIndex];
                    allowedItems = topSideItem.getAllowedOnBot(allowedItems); 
                    if (rowIndex == 1) {
                    }
                }

                // Left side
                if (colIndex > 0 && matrix[rowIndex-1][colIndex-1]) {
                    /** @type WCFMatrixObject */
                    let topleftSideItem = matrix[rowIndex-1][colIndex-1];
                    allowedItems = topleftSideItem.getAllowedOnBotRight(allowedItems); 
                } 

                // Right side
                if (colIndex < matrixSize - 1 && matrix[rowIndex-1][colIndex+1]) {
                    /** @type WCFMatrixObject */
                    let toprightSideItem = matrix[rowIndex-1][colIndex+1];
                    allowedItems = toprightSideItem.getAllowedOnBotLeft(allowedItems); 
                } 
            }
            
            if (allowedItems.length > 0) {
                let item = getRandomFromList(allowedItems)
                if (item) {
                    matrix[rowIndex][colIndex] = new WCFMatrixObject(item.name, item.imageSrc, item.label, item.isVertex);
                } else {
                    matrix[rowIndex][colIndex] = null;    
                }
                if (matrix[rowIndex][colIndex]) {
                    if (rowIndex === 0 || rowIndex === matrix.length-1) {
                        matrix[rowIndex][colIndex].left = 1;
                        matrix[rowIndex][colIndex].right = 1;
                        matrix[rowIndex][colIndex].rename();
                    }
                    if (colIndex === 0 || colIndex === matrix.length-1) {
                        matrix[rowIndex][colIndex].top = 1;
                        matrix[rowIndex][colIndex].bot = 1;
                        matrix[rowIndex][colIndex].rename();
                    }
                }
            }
        })
    })

    return matrix;
}

