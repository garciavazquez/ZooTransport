var Cebra = cc.Class.extend({
    tiempoUltimoSalto:0,
    tiempoEntreSaltos:0,
    gameLayer:null,
    sprite:null,
    shape:null,
    saltando:false,
    actionAnimacion:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;
    this.tiempoEntreSaltos = 4 + Math.floor(Math.random() * 2);
    // Crear animación
   var framesAnimacion = [];
   for (var i=1; i<=4; i++){
    var str = "cebra" + i + ".png";
    var frame = cc.spriteFrameCache.getSpriteFrame(str);
    framesAnimacion.push(frame);
   }

   var animacion = new cc.Animation(framesAnimacion, 0.2);
   this.actionAnimacion =
           new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#cebra1.png");

    this.body = new cp.Body(1, cp.momentForBox(0.1,
       this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width - 25,
        this.sprite.getContentSize().height - 25);
    this.shape.setCollisionType(tipoAnimal);
    this.shape.setFriction(4);
    // agregar forma dinamica
    gameLayer.space.addShape(this.shape);

    gameLayer.addChild(this.sprite,10);


}, update:function (dt) {

           this.tiempoUltimoSalto = this.tiempoUltimoSalto + dt;

           if(this.tiempoUltimoSalto > this.tiempoEntreSaltos && (this.gameLayer.camioneta.body.getVel().x < 100 && this.gameLayer.camioneta.body.getVel().x > 0))
               {
                   this.body.setAngle(0);
                   this.sprite.stopAllActions();
                   this.sprite.runAction(this.actionAnimacion);
                   var actionMover = cc.MoveTo.create(1.5, cc.p(this.sprite.body.p.x - 10,this.sprite.body.p.y));
                   this.sprite.runAction(actionMover);
                   this.tiempoUltimoSalto = 0;
                   this.saltando = true;

               }

   }, terminaSalto:function () {

       if(this.tiempoUltimoSalto > 1.5)
       {
           this.sprite.stopAllActions();
           this.saltando = false;
       }
   }, caeAlSuelo:function() {
        cc.director.runScene(new GameScene());
   }, sePrecipita:function() {
        if(this.sprite.body.p.y <0)
            cc.director.runScene(new GameScene());
   }

});
