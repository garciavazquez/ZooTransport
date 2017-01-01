var niveles = [ res.mapa1_tmx , res.mapa2_tmx, res.mapa3_tmx, res.mapa4_tmx, res.mapa5_tmx ];
var nivelActual = 0;

var tipoJugador = 1;
var tipoSuelo = 2;

var idCapaJuego = 1;
var idCapaControles = 2;

var GameLayer = cc.Layer.extend({
    space:null,
    mapa: null,
    mapaAncho: null,
    teclaIzquierda:false,
    teclaDerecha:false,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.cargarMapa();
        this.scheduleUpdate();
        return true;
    },update:function (dt) {
        this.space.step(dt);

        var capaControles = this.getParent().getChildByTag(idCapaControles);

        if ( capaControles.monedas >= 3){
            console.log("Nivel: ", nivelActual);
            nivelActual = nivelActual + 1;
            cc.director.runScene(new GameScene());
        }
    }, cargarMapa:function () {
        this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
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


    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
