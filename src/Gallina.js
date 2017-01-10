var Gallina = cc.Class.extend({
    tiempoUltimoSalto:[],
    tiempoEntreSaltos:[],
    gameLayer:null,
    sprite:[],
    shape:[],
    saltando:false,
    actionAnimacion:[],
    numeroGallinas:3,
    seCayo:-1,
    body:[],
    eliminado:-1,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;
    for (var i = 0; i<3; i++)
        {
         this.tiempoEntreSaltos[i] = 3 + Math.floor(Math.random() * 3);
         this.tiempoUltimoSalto[i] = 0;
         }
    // Crear animación
   var framesAnimacion = [];
   for (var i=1; i<=5; i++){
    var str = "gallina" + i + ".png";
    var frame = cc.spriteFrameCache.getSpriteFrame(str);
    framesAnimacion.push(frame);
   }



    // Crear Sprite - Cuerpo y forma
    for (var i = 0; i<3; i++)
    {
        var random = 0.1 + Math.random() * 0.5;
        var animacion = new cc.Animation(framesAnimacion, random);
        this.actionAnimacion[i] =
                   new cc.RepeatForever(new cc.Animate(animacion));
        this.sprite[i] = new cc.PhysicsSprite("#gallina1.png");
        this.body[i] = new cp.Body(1, cp.momentForBox(0.1,
           this.sprite[i].getContentSize().width,
            this.sprite[i].getContentSize().height));

            this.body[i].setPos(cc.p(posicion.x - (i*30), posicion.y));
            this.body[i].setAngle(0);
            this.sprite[i].setBody(this.body[i]);
            // Se añade el cuerpo al espacio
            gameLayer.space.addBody(this.body[i]);

            // forma
            this.shape[i] = new cp.BoxShape(this.body[i],
            this.sprite[i].getContentSize().width - 25,
            this.sprite[i].getContentSize().height - 25);
            this.shape[i].setCollisionType(tipoAnimal);
            this.shape[i].setFriction(8);
            // agregar forma dinamica
            gameLayer.space.addShape(this.shape[i]);

            // ejecutar la animación
            this.sprite[i].runAction(this.actionAnimacion[i]);

            gameLayer.addChild(this.sprite[i],10);
    }

}, update:function (dt) {
       if (this.seCayo != -1)
        {
            this.eliminado = this.seCayo;
            this.gameLayer.space.removeShape(this.shape[this.seCayo]);
            this.gameLayer.removeChild(this.sprite[this.seCayo]);
            this.seCayo = -1;
        }

         // aumentar el tiempo que ha pasado desde el ultimo salto


          for (var i=0; i<3; i++)
          {
            this.tiempoUltimoSalto[i] = this.tiempoUltimoSalto[i] + dt;
              // Saltan si el tiempo ha pasado
              if(this.eliminado != i && this.tiempoUltimoSalto[i] > this.tiempoEntreSaltos[i]){
                  // Colocar en angulo del cuerpo a 0
                  this.sprite[i].body.setAngle(0);
                  this.sprite[i].body.applyImpulse(cp.v(20, 120), cp.v(0, 0));
                  this.tiempoUltimoSalto[i] = 0;
                  }

          }



  }, caeAlSuelo:function() {
        this.numeroGallinas = this.numeroGallinas -1;
        var menor = 999;
        if (this.numeroGallinas < 2)
            cc.director.runScene(new GameScene());
        else
            for (var i = 0; i<3; i++)
                    if (this.sprite[i].body.p.y < menor)
                         this.seCayo = i;

   }, sePrecipita:function() {
             for (var i = 0; i<3; i++)
                if (this.eliminado != i && this.sprite[i].body.p.y < 0)
                    {
                        this.numeroGallinas = this.numeroGallinas -1;
                        if (this.numeroGallinas < 2)
                            cc.director.runScene(new GameScene());
                        this.gameLayer.space.removeShape(this.shape[i]);
                        this.gameLayer.removeChild(this.sprite[i]);
                    }

       }

});
