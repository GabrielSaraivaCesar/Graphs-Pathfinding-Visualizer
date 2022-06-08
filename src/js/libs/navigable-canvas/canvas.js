const lowerScale = 0.1;
const animationFPS = 60;
const scrollMoveSens = 50;

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

    // Mobile only
    isPinching = false;
    lastPinchDist = null;
    lastMovingPosX = null;
    lastMovingPosY = null;

    animationFrame = 0;
    lastAnimationFrame = null;

    /** @type {SceneObject[]}  */
    sceneObjects = []

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.translateX = window.innerWidth / 2;
        this.translateY = window.innerHeight / 2;

        /* Desktop Support */
        this.canvas.addEventListener("wheel", (e) => this.onScroll(e));
        this.canvas.addEventListener("mousedown", (e) => this.setIsTranslating(e));
        this.canvas.addEventListener("mouseup", (e) => this.setIsTranslatingFalse(e));
        this.canvas.addEventListener("mouseleave", (e) => this.setIsTranslatingFalse(e, true));
        this.canvas.addEventListener("mousemove", (e) => this.onTranslate(e));
        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

        /* Mobile Support */
        this.canvas.addEventListener('touchstart', (e) => this.setIsTranslating(e, true));
        this.canvas.addEventListener('touchmove', (e) => this.onTranslate(e, true));
        this.canvas.addEventListener('touchend', (e) => this.setIsTranslatingFalse(e, true));

        setInterval(() => this.runAnimationFrame(), 1000/animationFPS);

    }

    /** @param {Function} initializer */
    addObject(tag, initializer) {
        this.sceneObjects.push(new SceneObject(tag, initializer));
    }

    clearScene() {
        this.sceneObjects = [];
    }

    resetAnimationFrame() {
        this.animationFrame = 0;
    }

    runAnimationFrame() {
        let timeDelta = new Date().getTime() - this.lastAnimationFrame;
        if (this.lastAnimationFrame === null) timeDelta = 0;

        this.animationFrame += 1 * (timeDelta/1000);

        this.draw();
        this.lastAnimationFrame = new Date().getTime();
    }

    draw() {
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
        this.context.setTransform(this.scale, 0, 0, this.scale, this.translateX, this.translateY);
    }

    reloadCanvasResolution() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    getScrollXMov(x) {
        return (x / (window.innerWidth / 2) - 1) * scrollMoveSens;
    }
    getScrollYMov(y) {
        return (y / (window.innerHeight / 2) - 1) * scrollMoveSens;
    }

    /** @param {WheelEvent} event */
    onScroll(event) {
        let xMov = event.clientX / window.innerWidth;
        let down = event.deltaY > 0;

        if (down) {
            // this.translateX += window.innerWidth*(1/this.scale)/2 * 0.05;
            // this.translateX += -((event.clientX ) / 4) * 0.05;
            // this.translateY += (this.getScrollYMov(event.clientY)) * 0.05;
            this.scale -= 0.05;
            if (this.scale < lowerScale) {
                this.scale = lowerScale;
            } 
        } else {
            // this.translateX -= window.innerWidth*(1/this.scale)/2 * 0.05;
            // this.translateY += -(this.getScrollYMov(event.clientY))  * 0.05;
            this.scale += 0.05;
        }
        this.draw();
    }

    /** @param {MouseEvent|TouchEvent} event */
    onTranslate(event, mobile=false) {
        event.preventDefault();
        if (this.isTranslating) {
            if (!mobile) {
                this.translateX += event.movementX;
                this.translateY += event.movementY;
            } else {
                let touch = event.targetTouches[0];

                let xDelta = touch.clientX - (this.lastMovingPosX || touch.clientX);
                let yDelta = touch.clientY - (this.lastMovingPosY || touch.clientY);
                
                this.translateX += xDelta;
                this.translateY += yDelta;
                
                this.lastMovingPosX = touch.clientX;
                this.lastMovingPosY = touch.clientY;
            }
            this.draw();
        } else if (this.isPinching) {
            
            let dist = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY);
            let delta = (this.lastPinchDist || 0) - dist;
            let down = delta > 0;
            
            if (this.lastPinchDist !== null) {
                if (down) {
                    this.scale -= Math.abs(delta / 200);
                    if (this.scale < lowerScale) {
                        this.scale = lowerScale;
                    } 
                } else {
                    this.scale += Math.abs(delta / 200);
                }
            }
            this.lastPinchDist = dist;
        }
    }

    /** @param {MouseEvent|TouchEvent} event */
    setIsTranslating(event, mobile=false) {
        event.preventDefault();
        if (mobile || event.button == 0 || event.button == 2) {
            if (mobile && event.touches.length === 2) {
                this.isPinching = true;
                this.isTranslating = false;
            } else {
                this.isPinching = false;
                this.isTranslating = true;
                this.canvas.style.cursor = "grabbing";
            }
        }
    }

    /** @param {MouseEvent} event */
    setIsTranslatingFalse(event, force=false) {
        if (event.button == 0 || event.button == 2 || force) {
            this.isTranslating = false;
            this.canvas.style.cursor = "grab";
            this.lastMovingPosX = null;
            this.lastMovingPosY = null;
            this.lastPinchDist = null;
        }
    }

}


const canvas = document.getElementById("graphs-canvas");
const scene = new Scene(canvas);

scene.reloadCanvasResolution();
window.onresize = () => scene.reloadCanvasResolution();


scene.draw();