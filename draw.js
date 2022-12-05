import * as THREE from "three";
import * as glUtil from "./glUtil.js"
import fs from "node:fs"
global.navigator = {userAgent: ""}

class Draw{
    scene = null;
    renderer = null;
    camera = null;
    cameraOrigin = null;
    outputStream = null;

    constructor(canvas, width, height, ratio, renderer, outputStream) {
        this.outputStream = outputStream;

        this.renderer = (typeof renderer === "undefined" ? new THREE.WebGLRenderer({ canvas }) : renderer);
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio( ratio );

        this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 300 );
        this.camera.position.set(0, 0, 300);
        this.cameraOrigin = new THREE.Vector3(0, 0, 30);
        this.camera.lookAt( this.cameraOrigin );
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.add( new THREE.HemisphereLight( 0xFFFfff, 0x111122 ) );
    }

    async run() {
        console.log("start run")
        const ps = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 100, 100, 0 ),
            new THREE.Vector3( 200, 0, 0 )
        ).getPoints( 300 );
        console.log(ps)

        const geometry = new THREE.TubeGeometry( new THREE.CatmullRomCurve3(ps), 20, 4, 14, false );
        const material = new THREE.MeshPhysicalMaterial({ color: 0x81E349 })
        const mesh = new THREE.Mesh( geometry,  material);
        this.scene.add( mesh );

        console.log("start render")
        await this.render();
    }

    async render(){
        this.renderer.render( this.scene, this.camera );
        await glUtil.saveImage(this.renderer, this.outputStream);
    }
}

var fileStream = fs.createWriteStream("/app/data/result.png");
(async function (width, height, outputStream){
    const canvas = {
        width,
        height, 
        addEventListener: event => {},
        removeEventListener: event => {},
        style: {width: width, height: height}
    };
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas, context: glUtil.createGl(width, height) } );
    const draw = new Draw(canvas, width, height, 1, renderer, outputStream)
    await draw.run();
})(800, 800, fileStream);