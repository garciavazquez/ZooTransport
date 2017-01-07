var Rana = cc.Class.extend({
    tiempoUtimoSalto:0,
    tiempoEntreSaltos:0,
    gameLayer:null,
    sprite:null,
    shape:null,
    saltando:false,
    actionAnimacionParado:null,
    actionAnimacionSalto:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;
    this.tiempoEntreSaltos = 4 + Math.floor(Math.random() * 2);
    // Crear animación
   var framesAnimacion = [];

   var str = "rana1.png";
   var frame = cc.spriteFrameCache.getSpriteFrame(str);
   framesAnimacion.push(frame);
   var str = "rana3.png";
   var frame = cc.spriteFrameCache.getSpriteFrame(str);
   framesAnimacion.push(frame);
   var animacionParado = new cc.Animation(framesAnimacion, 0.2);
   this.actionAnimacionParado =
           new cc.RepeatForever(new cc.Animate(animacionParado));
    var framesAnimacion = [];
    var str = "rana4.png";
    var frame = cc.spriteFrameCache.getSpriteFrame(str);
    framesAnimacion.push(frame);
    var str = "rana2.png";
    var frame = cc.spriteFrameCache.getSpriteFrame(str);
    framesAnimacion.push(frame);
    var animacionSalto = new cc.Animation(framesAnimacion, 0.6);

    this.actionAnimacionSalto =
        new cc.RepeatForever(new cc.Animate(animacionSalto));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#rana1.png");

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
    // ejecutar la animación
    this.sprite.runAction(this.actionAnimacionParado);

    gameLayer.addChild(this.sprite,10);

}, update:function (dt) {

      // aumentar el tiempo que ha pasado desde el ultimo salto
      this.tiempoUtimoSalto = this.tiempoUtimoSalto + dt;

      // Saltan si el tiempo ha pasado
      if(this.tiempoUtimoSalto > this.tiempoEntreSaltos){


          // Colocar en angulo del cuerpo a 0
          this.body.setAngle(0);
          this.sprite.stopAllActions();
          this.sprite.runAction(this.actionAnimacionSalto);
          this.body.applyImpulse(cp.v(0, 300), cp.v(0, 0));
          this.tiempoUtimoSalto = 0;
          this.saltando = true;

      }
  }, terminaSalto:function () {

          this.sprite.stopAllActions();
          this.sprite.runAction(this.actionAnimacionParado);
          this.saltando = false;
       }



});
