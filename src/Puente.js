var Puente = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    eliminado:false,
    tiempoInvisible:0,
    tiempoEntreVisibilidad:0,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;
    this.tiempoEntreVisibilidad = 4 + Math.floor(Math.random() * 2);

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
},update:function(dt){
    this.tiempoInvisible = this.tiempoInvisible + dt;
    if (this.tiempoInvisible > this.tiempoEntreVisibilidad){
        this.gameLayer.removeChild(this.sprite);
        this.eliminado = true;
        this.tiempoInvisible = 0;
        console.log("Invisible");
    }

    /*if(this.eliminado == true){
        this.gameLayer.addChild(this.sprite);
        this.eliminado = false;
        console.log("Visible");
    }*/
}
});
