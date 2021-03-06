var niveles = [ res.mapa1_tmx , res.mapa2_tmx, res.mapa3_tmx, res.mapa4_tmx, res.mapa5_tmx ];
var nivelActual = 0;

var tipoCamioneta = 1;
var tipoSuelo = 2;
var tipoAnimal = 3;
var tipoMeta = 4;
var tipoMeteorito = 5;

var GameLayer = cc.Layer.extend({
    space:null,
    mapa: null,
    mapaAncho: null,
    teclaIzquierda:false,
    teclaDerecha:false,
    camioneta:null,
    tiempo:0,
    animal:null,
    widthCamioneta:0,
    heightCamioneta:0,
    widthAnimal:0,
    heightAnimal:0,
    puente:null,
    meta:null,
    meteorito:null,
    tiempoUltimaCaida:0,
    eliminar:false,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        this.tiempo = new Date().getTime();
        this.tiempoUltimaCaida = 0;

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        this.space.damping = 0.5;

        this.cargarMapa();

        //Cargar camioneta
        this.camioneta = new cc.PhysicsSprite("#camioneta.png");
        var body = new cp.Body(10, cp.momentForBox(1, 0, this.camioneta.width-20, this.camioneta.height-20));
        this.widthCamioneta = size.width*0.35;
        this.heightCamioneta = size.height*0.2;
        body.p = cc.p(this.widthCamioneta, this.heightCamioneta);
        this.camioneta.setBody(body);
        this.space.addBody(body);
        var shape = new cp.BoxShape(body, this.camioneta.width-60, this.camioneta.height-40);
        shape.setFriction(1);
        shape.setCollisionType(tipoCamioneta);
        this.space.addShape(shape);
        this.addChild(this.camioneta);

        this.widthAnimal = size.width*0.35;
        this.heightAnimal = size.height*0.5;
        //Cargar animal
        switch (nivelActual)
        {
            case 0: this.animal = new Rana(this, cc.p(this.widthAnimal, this.heightAnimal)); break;
            case 1: this.animal = new Cuervo(this, cc.p(this.widthAnimal, this.heightAnimal)); break;
            case 2: this.animal = new Tortuga(this, cc.p(this.widthAnimal, this.heightAnimal)); break;
            case 3: this.animal = new Cebra(this, cc.p(this.widthAnimal, this.heightAnimal)); break;
            case 4: this.animal = new Gallina(this, cc.p(this.widthAnimal, this.heightAnimal)); break;
            default: this.animal = new Rana(this, cc.p(this.widthAnimal, this.heightAnimal)); break;
        }

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var instancia = event.getCurrentTarget();
                instancia.keyPulsada = keyCode;
                if( keyCode == 37 && (new Date().getTime() - instancia.tiempo) > 100 ){
                     instancia.camioneta.body.applyImpulse(cp.v(-150, 0), cp.v(0,0));
                     instancia.tiempo = new Date().getTime();
                }
                if( keyCode == 39 && (new Date().getTime() - instancia.tiempo) > 100 ){
                       instancia.camioneta.body.applyImpulse(cp.v(300,0), cp.v(0,0));
                       instancia.tiempo = new Date().getTime();
                }
            },
            onKeyReleased: function(keyCode, event){
                if(keyCode == 37 || keyCode == 39){
                      var instancia = event.getCurrentTarget();
                      instancia.keyPulsada = null;
                }
            }
        }, this);

        this.scheduleUpdate();

        this.space.addCollisionHandler(tipoAnimal, tipoCamioneta,  null, null, this.colisionAnimalConJugador.bind(this), null);
        this.space.addCollisionHandler(tipoAnimal, tipoSuelo,  null, null, this.colisionAnimalConSuelo.bind(this), null);
        this.space.addCollisionHandler(tipoCamioneta, tipoMeta, null, this.colisionCamionetaConMeta.bind(this), null, null);
        this.space.addCollisionHandler(tipoMeteorito, tipoAnimal, null, null, this.colisionMeteoritoConAnimal.bind(this), null);
        this.space.addCollisionHandler(tipoMeteorito, tipoCamioneta, null, null, this.colisionMeteoritoConCamioneta.bind(this), null);
        this.space.addCollisionHandler(tipoMeteorito, tipoSuelo, null, null, this.colisionMeteoritoConSuelo.bind(this), null);

        return true;
    },update:function (dt) {
        this.space.step(dt);

        this.animal.update(dt);


        var posicionCamioneta = this.camioneta.getBody().p.x-350;
        if(-this.getPosition().x < (this.mapaAncho - cc.winSize.width))
            this.setPosition(cc.p(- posicionCamioneta,0));

        var bodyCamioneta = this.camioneta.body;
        if(bodyCamioneta.getVel().x > 200)
            bodyCamioneta.setVel(cp.v(200, bodyCamioneta.getVel().y))
        if(bodyCamioneta.getVel().x < -100)
             bodyCamioneta.setVel(cp.v(-100, bodyCamioneta.getVel().y))

        // Caída, sí cae vuelve a la posición inicial
        if( this.camioneta.body.p.y < 0){
            cc.director.runScene(new GameScene());
        }
        this.animal.sePrecipita();

        var random =  Math.floor(Math.random() * 10);

        this.tiempoUltimaCaida = this.tiempoUltimaCaida + dt;
        if(this.tiempoUltimaCaida > 3){
            this.meteorito = new Meteorito(this, cc.p(-this.getPosition().x + 400 + random, this.mapa.getContentSize().height + 10));
            this.tiempoUltimaCaida = 0;
        }

        if(this.eliminar) {
            this.meteorito.eliminar();
            this.eliminar = false;
        }

        if(this.puente != null){
            this.puente.update(dt);
        }

    }, cargarMapa:function () {
        this.mapa = new cc.TMXTiledMap(niveles[nivelActual]);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;

        // Solicitar los objeto dentro de la capa Suelos
        var grupoSuelos = this.mapa.getObjectGroup("Suelos");
        var suelosArray = grupoSuelos.getObjects();

        // Los objetos de la capa suelos se transforman a
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < suelosArray.length; i++) {
            var suelo = suelosArray[i];
            var puntos = suelo.polylinePoints;
            for(var j = 0; j < puntos.length - 1; j++){
                var bodySuelo = new cp.StaticBody();

                var shapeSuelo = new cp.SegmentShape(bodySuelo,
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                        parseInt(suelo.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                        parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                    10);
                shapeSuelo.setFriction(0);
                shapeSuelo.setCollisionType(tipoSuelo);
                this.space.addStaticShape(shapeSuelo);
            }
        }

       var grupoPuentes = this.mapa.getObjectGroup("Puentes");
       var puentesArray = grupoPuentes.getObjects();
       if(puentesArray[0] != null){
           this.puente = new Puente(this, cc.p(puentesArray[0]["x"], puentesArray[0]["y"]));
       }

        var grupoMetas = this.mapa.getObjectGroup("Meta");
        var arrayMeta = grupoMetas.getObjects();
        this.meta = new Meta(this, cc.p(arrayMeta[0]["x"], arrayMeta[0]["y"]));

    }, colisionAnimalConJugador:function(arbiter, space) {
         if (this.animal.saltando == true)
            this.animal.terminaSalto();
    }, colisionAnimalConSuelo:function(arbiter, space) {
            /* cc.director.pause();
             cc.audioEngine.stopMusic();*/
            this.animal.caeAlSuelo();
    }, colisionCamionetaConMeta:function(arbiter, space){
        nivelActual = nivelActual +1;
        if(nivelActual > 4){
            nivelActual = 0;
        }
        cc.director.runScene(new GameScene());
    }, colisionMeteoritoConAnimal:function(arbiter, space){
        cc.director.runScene(new GameScene());
    }, colisionMeteoritoConCamioneta:function(arbiter, space){
        cc.director.runScene(new GameScene());
    }, colisionMeteoritoConSuelo:function(arbiter, space){
        this.eliminar = true;
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();

        //cache
        cc.spriteFrameCache.addSpriteFrames(res.camioneta_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rana_plist);
        cc.spriteFrameCache.addSpriteFrames(res.cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.puente_plist);
        cc.spriteFrameCache.addSpriteFrames(res.meta_plist);
        cc.spriteFrameCache.addSpriteFrames(res.meteorito_plist);
        cc.spriteFrameCache.addSpriteFrames(res.tortuga_plist);
        cc.spriteFrameCache.addSpriteFrames(res.cebra_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gallina_plist);

        cc.audioEngine.playMusic(res.musicabucle_wav, true);

        var layer = new GameLayer();
        this.addChild(layer);
    }
});
