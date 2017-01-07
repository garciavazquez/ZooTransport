var Puente = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
   /* this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#puente.png");

    this.body = new cp.Body(1, cp.momentForBox(0.1, this.sprite.getContentSize().width, this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body, this.sprite.getContentSize().width, this.sprite.getContentSize().height);

    this.shape.setFriction(4);
    // agregar forma dinamica
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa

    gameLayer.addChild(this.sprite,10);*/

      this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#puente.png");
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);

        // forma
        this.shape = new cp.BoxShape(body, this.sprite.width - 16, this.sprite.height - 16);
        this.shape.setCollisionType(tipoMeta);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite);
},  moverAutomaticamente: function(){ //CAMBIAR ESTO PARA QUE SEA EN VERTICAL
    // Velocidad baja ha colisionado con algo,
    if ( this.body.vy < 3 &&  this.body.vy > -3 ) {
        if (this.direccion == "arriba"){
            this.direccion = "abajo";
            this.body.p.y = this.body.p.y -10; // Para que salga de la colisión
            this.sprite.scaleY = 1;
        } else {
            this.direccion = "arriba";
            this.body.p.y = this.body.p.y + 10; // Para que salga de la zona de colisión
            this.sprite.scaleY = -1;
        }
    }
}
});
