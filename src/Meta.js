var Meta = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 6; i++) {
        var str = "meta" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =  new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#meta.png");
    // Cuerpo estática, no le afectan las fuerzas
    var body = new cp.StaticBody();
    body.setPos(posicion);
    this.sprite.setBody(body);
    // Los cuerpos estáticos nunca se añaden al Space

    // forma
    this.shape = new cp.BoxShape(this.body, this.sprite.getContentSize().width - 16, this.sprite.getContentSize().height - 16);
    this.shape.setCollisionType(tipoMeta);
    // Nunca genera colisiones reales, es como un “fantasma”
    this.shape.setSensor(true);
    // forma estática
    gameLayer.space.addStaticShape(this.shape);
    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);
}
});

