var Meteorito = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    cayendo:false,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#meteorito.png");
    // Cuerpo estática, no le afectan las fuerzas
    this.body = new cp.Body(5, cp.momentForBox(1,
                       this.sprite.getContentSize().width,
                       this.sprite.getContentSize().height));
    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    gameLayer.space.addBody(this.body);

    var radio = this.sprite.getContentSize().width / 2;
    // forma
    this.shape = new cp.CircleShape(this.body, radio , cp.vzero);
    this.shape.setCollisionType(tipoMeteorito);
    // forma estática
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite);
},eliminar: function (){
    // quita la forma
    this.gameLayer.space.removeShape(this.shape);
    // quita el sprite
    this.gameLayer.removeChild(this.sprite);
}
});

