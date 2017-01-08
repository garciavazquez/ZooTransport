var Meta = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    tiempoUltimaCaida:0,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#meteorito.png");
    // Cuerpo estática, no le afectan las fuerzas
    var body = new cp.StaticBody();
    body.setPos(posicion);
    this.sprite.setBody(body);

    var radio = this.sprite.getContentSize().width / 2;
    // forma
    this.shape = new cp.CircleShape(body, radio , cp.vzero);
    this.shape.setCollisionType(tipoMeteorito);
    // forma estática
    gameLayer.space.addStaticShape(this.shape);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite);
},eliminar: function (){
    // quita la forma
    this.gameLayer.space.removeShape(this.shape);
    // quita el sprite
    this.gameLayer.removeChild(this.sprite);
}, update:function(dt){
    this.tiempoUltimaCaida = this.tiempoUltimaCaida + dt;
}
});

