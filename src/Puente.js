var Puente = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#puente1.png");

    this.body = new cp.Body(1, cp.momentForBox(0.1, this.sprite.getContentSize().width, this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body, this.sprite.getContentSize().width, this.sprite.getContentSize().height);
    //this.shape.setCollisionType(tipoAnimal);
    this.shape.setFriction(4);
    // agregar forma dinamica
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa

    gameLayer.addChild(this.sprite,10);
}, update:function (dt) {


},  moverAutomaticamente: function(){ //CAMBIAR ESTO PARA QUE SEA EN VERTICAL
    // Velocidad baja ha colisionado con algo,
    if ( this.body.vx < 3 &&  this.body.vx > -3 ) {
        if (this.direccion == "derecha"){
            this.direccion = "izquierda";
            this.body.p.x = this.body.p.x -10; // Para que salga de la colisión
            this.sprite.scaleX = 1;
        } else {
            this.direccion = "derecha";
            this.body.p.x = this.body.p.x + 10; // Para que salga de la zona de colisión
            this.sprite.scaleX = -1;
        }
    }
}
});
