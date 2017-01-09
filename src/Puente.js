var Puente = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    eliminado:false,
    tiempoVisible:0,
    tiempoEntreVisibilidad:0,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;
    this.tiempoVisible = 4;

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
    this.tiempoEntreVisibilidad = this.tiempoEntreVisibilidad + dt;
    if (this.tiempoEntreVisibilidad > this.tiempoVisible){
        if(this.eliminado)
        {
            this.gameLayer.space.addStaticShape(this.shape);
            this.gameLayer.addChild(this.sprite);
        }
        else
        {
            this.gameLayer.space.removeShape(this.shape);
            this.gameLayer.removeChild(this.sprite);
        }
        this.eliminado = !this.eliminado;
        this.tiempoEntreVisibilidad = 0;
    }
}
});
