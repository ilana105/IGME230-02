class Food extends PIXI.Sprite{
    constructor(name, x = 0, y = 0){
        super();
        this.create(name, x, y);
    }
    
    create(name, x, y) {
        this.anchor.set(.5, .5);
        this.scale.set(2);
        this.name = name;
        this.x = x;
        this.y = y;
        
        this.interactive = true;
        this.buttonMode = true;
        
        this        
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);    
    }
    
     onDragStart(e) {
        this.data = e.data;
        this.alpha = 0.5;
        this.dragging = true;
     }

    onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }

    onDragMove() {
        if (this.dragging) {
            let newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }
}

