const lowerScale = 0.5;

class SceneObject {
    tag = "";
    initializer = null;

    constructor(tag, initializer) {
        this.tag = tag;
        this.initializer = initializer;
    }
}

class Scene {
    /** @type {HTMLCanvasElement} */
    canvas = null
    /** @type {CanvasRenderingContext2D} */
    context = null;

    scale = 1;

    isTranslating = false;
    translateX = 0;
    translateY = 0;


    /** @type {SceneObject[]}  */
    sceneObjects = []

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.translateX = window.innerWidth / 2;
        this.translateY = window.innerHeight / 2;

        this.canvas.addEventListener("wheel", (e) => this.onScroll(e));
        this.canvas.addEventListener("mousedown", (e) => this.setIsTranslating(e));
        this.canvas.addEventListener("mouseup", (e) => this.setIsTranslatingFalse(e));
        this.canvas.addEventListener("mouseleave", (e) => this.setIsTranslatingFalse(e, true));
        this.canvas.addEventListener("mousemove", (e) => this.onTranslate(e));
        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    }

    /** @param {Function} initializer */
    addObject(tag, initializer) {
        this.sceneObjects.push(new SceneObject(tag, initializer));
    }

    clearScene() {
        this.sceneObjects = [];
    }

    draw() {
        let currentTransform = this.context.getTransform();
        this.context.clearRect(
            0 - Math.abs(this.translateX) * ((1/this.scale)*10), 
            0 - Math.abs(this.translateY) * ((1/this.scale)*10), 
            this.canvas.width * ((1/this.scale)*10) + Math.abs(this.translateX)* ((1/this.scale)*10), 
            this.canvas.height * ((1/this.scale)*10) + Math.abs(this.translateY)* ((1/this.scale)*10)
        );
        this.context.setTransform(this.scale, 0, 0, this.scale, this.translateX, this.translateY);
        this.sceneObjects.forEach((obj) => {
            
            obj.initializer();
        })
    }

    reloadCanvasResolution() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    /** @param {WheelEvent} event */
    onScroll(event) {
        let down = event.deltaY > 0;
        if (down) {
            this.scale -= 0.05;
            if (this.scale < lowerScale) {
                this.scale = lowerScale;
            } 
        } else {
            this.scale += 0.05;
        }
        this.draw();
    }

    /** @param {MouseEvent} event */
    onTranslate(event) {
        if (this.isTranslating) {
            this.translateX += event.movementX ;
            this.translateY += event.movementY ;
            this.draw();
        }
    }

    /** @param {MouseEvent} event */
    setIsTranslating(event) {
        if (event.button == 0 || event.button == 2) {
            this.isTranslating = true;
            this.canvas.style.cursor = "grabbing";
        }
    }

    /** @param {MouseEvent} event */
    setIsTranslatingFalse(event, force=false) {
        if (event.button == 0 || event.button == 2 || force) {
            this.isTranslating = false;
            this.canvas.style.cursor = "grab";
        }
    }

}


const canvas = document.getElementById("graphs-canvas");
const scene = new Scene(canvas);

scene.reloadCanvasResolution();
window.onresize = () => scene.reloadCanvasResolution();


scene.draw();