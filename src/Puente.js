var Puente = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#puente.png");
    // Cuerpo estática, no le afectan las fuerzas
    var body = new cp.StaticBody();
    body.setPos(posicion);
    this.sprite.setBody(body);

    // forma
    this.shape = new cp.BoxShape(body, this.sprite.width - 16, this.sprite.height - 16);

    this.shape.setCollisionType(tipoSuelo);
    // forma estática
    gameLayer.space.addStaticShape(this.shape);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite);
}
});
