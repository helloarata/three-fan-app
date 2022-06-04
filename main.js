import './style.css'
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App3();
  app.init();
  app.render();

}, false);

class App3{
  static get SIZES(){
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  static get RENDERER_PARAM(){
    return {
      width: App3.SIZES.width,
      height: App3.SIZES.height,
    }
  }

  static get PERSPECTIVE_CAMERA_PARAM(){
    return {
      fov: 60,
      aspect: App3.SIZES.width / App3.SIZES.height,
      near: 0.1,
      far: 100,
      x: 2.6,
      y: 1.35,
      z: 4.8,
      lookAt: new THREE.Vector3(0, 0, 0),
    }
  }

  static get MATERIAL_PARAM(){
    return {
      color: 0xffffff,
    }
  }

  static get DIRECTIONAL_LIGHT_PARAM(){
    return {
      color: 0xffffff,
      intensity: 0.9,
      x: 5.0,
      y: 5.0,
      z: 9.0,
    }
  }

  static get AMBIENTLIGHT_PARAM(){
    return {
      color: 0xffffff,
      intensity: 0.2,
    }
  }

  constructor(){
    this.renderer;
    this.scene;
    this.perspectiveCamera;
    this.directionalLight; 
    this.ambientLight;
    this.hemisphereLight;
    this.timeElapsed;
    this.render = this.render.bind(this);
    this.airPlane;
    this.fan;
    this.clock;
  }

  init(){
    this.createScene();
    this.createCamera();
    this.createLight();
    this.createFan();
    this.createClock();
    this.createAirPlane();
    this.resize();
    this.createTimeElapsed();
  }

  render(){
    requestAnimationFrame(this.render);
    const time = this.timeElapsed.getElapsedTime();
    this.fan.children[0].rotation.y = Math.sin(time)+1;
    this.fan.children[0].children[0].rotation.z -=0.3;
    this.fan.children[0].children[1].rotation.z -=0.3;
    this.clock.children[4].rotation.z -= 0.0006;
    this.clock.children[5].rotation.z -= 0.006;
    this.clock.children[6].rotation.z -= 0.6;
    this.airPlane.children[4].rotation.x -= 0.3;
    this.renderer.render(this.scene, this.perspectiveCamera);
  }

  resize(){
    window.addEventListener('resize', () => {
      this.renderer.setSize(App3.SIZES.width, App3.SIZES.height);
      this.perspectiveCamera.aspect = App3.SIZES.width / App3.SIZES.height;
      this.perspectiveCamera.updateProjectionMatrix();
    }, false);
  }

  createScene(){
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height);
    this.renderer.setClearColor(new THREE.Color(0xd9d9d9));
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const div = document.getElementById('app');
    div.appendChild(this.renderer.domElement);
    this.scene     = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xd9d9d9, 0.1, 7);
  }

  createCamera(){
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      App3.PERSPECTIVE_CAMERA_PARAM.fov,
      App3.PERSPECTIVE_CAMERA_PARAM.aspect,
      App3.PERSPECTIVE_CAMERA_PARAM.near,
      App3.PERSPECTIVE_CAMERA_PARAM.far,
    );
    this.perspectiveCamera.position.set(
      App3.PERSPECTIVE_CAMERA_PARAM.x,
      App3.PERSPECTIVE_CAMERA_PARAM.y,
      App3.PERSPECTIVE_CAMERA_PARAM.z,
    );
    this.perspectiveCamera.lookAt(App3.PERSPECTIVE_CAMERA_PARAM.lookAt);
  }

  createLight(){
    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity,
    );
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z,
    );
    this.scene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENTLIGHT_PARAM.color,
      App3.AMBIENTLIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);

    this.hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1);
    this.scene.add(this.hemisphereLight);
  }

  createTimeElapsed(){
    this.timeElapsed = new THREE.Clock();
  }

  createAirPlane(){
    this.airPlane      = new THREE.Group();
    this.airPlane.name = 'airPlane';

    const geoCockpit      = new THREE.BoxGeometry(0.3, 0.25, 0.25, 1, 1, 1);
    const matCockpit      = new THREE.MeshPhongMaterial({color: 0x524848});
    const cockpit         = new THREE.Mesh(geoCockpit, matCockpit);
    cockpit.name          = 'cockpit';
    cockpit.castShadow    = true;
    cockpit.receiveShadow = true;
    this.airPlane.add(cockpit);

    const geoEngine = new THREE.BoxGeometry(0.1, 0.25, 0.25, 1, 1, 1);
    const matEngine = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const engine    = new THREE.Mesh(geoEngine, matEngine);
    engine.name     = 'engine';
    engine.position.set(0.2, 0, 0);
    this.airPlane.add(engine);

    const geoTailPlane = new THREE.BoxGeometry(0.15, 0.1, 0.025, 1, 1, 1);
    const matTailPlane = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const tailPlane    = new THREE.Mesh(geoTailPlane, matTailPlane);
    tailPlane.name     = 'tailPlane';
    tailPlane.position.set(-0.175, 0.125, 0);
    this.airPlane.add(tailPlane);

    const geoSidePlane = new THREE.BoxGeometry(0.2, 0.04, 0.725, 1, 1, 1);
    const matSidePlane = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const sidePlane    = new THREE.Mesh(geoSidePlane, matSidePlane);
    sidePlane.name     = 'sidePlane';
    this.airPlane.add(sidePlane);

    const geoPropeller = new THREE.BoxGeometry(0.1, 0.05, 0.05, 1, 1, 1);
    const matPropeller = new THREE.MeshPhongMaterial({color: 0x59332e});
    const propeller    = new THREE.Mesh(geoPropeller, matPropeller);
    propeller.name     = 'propeller';
    
    const geoBlade  = new THREE.BoxGeometry(0.005, 0.5, 0.1, 1, 1, 1);
    const matBlade  = new THREE.MeshPhongMaterial({color: 0x23190f});
    const blade     = new THREE.Mesh(geoBlade, matBlade);
    blade.name      = 'blade';
    blade.position.set(0.04, 0, 0);
    propeller.add(blade);
    propeller.position.set(0.25, 0, 0);
    this.airPlane.add(propeller);
    this.airPlane.position.set(2,0.5,1);
    this.airPlane.rotation.y = -Math.PI/2;
    this.scene.add(this.airPlane);
  }

  createFan(){
    this.fan      = new THREE.Group();
    this.fan.name = 'fan';

    const swing = new THREE.Group();
    swing.name  = 'swing';

    const propeller = new THREE.Group();
    propeller.name  = 'propeller';
    const geoWing1  = new THREE.CircleGeometry(0.4, 0, 0, 0.25);
    const geoWing2  = new THREE.CircleGeometry(0.4, 0, -0.125+Math.PI/2, 0.25);
    const geoWing3  = new THREE.CircleGeometry(0.4, 0, -0.2+Math.PI, 0.25);
    const geoWing4  = new THREE.CircleGeometry(0.4, 0, -0.125+Math.PI+Math.PI/4, 0.25);
    const geoWing5  = new THREE.CircleGeometry(0.4, 0, -0.125+Math.PI*2-Math.PI/4, 0.25);
    const matWing   = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const wingArray = [geoWing1, geoWing2, geoWing3, geoWing4, geoWing5];
    for(let i = 0; i < 5; i++){
      let wing  = new THREE.Mesh(wingArray[i], matWing);
      wing.name = `wing${i+1}`;
      propeller.add(wing);
    }
    propeller.position.set(0, 0, 0.25);
    swing.add(propeller);
    
    const geoSpinner       = new THREE.CylinderGeometry(0.07, 0.07, 0.1);
    const matSpinner       = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const spinner          = new THREE.Mesh(geoSpinner, matSpinner);
    spinner.name           = 'spinner';
    spinner.rotation.order = 'ZYX';
    spinner.rotation.x     = Math.PI/2;
    spinner.position.set(0, 0, 0.2);
    swing.add(spinner);

    const geoMotor = new THREE.CapsuleGeometry(0.14, 0.14, 36);
    const matMotor = new THREE.MeshPhongMaterial({color: 0x524848});
    const motor    = new THREE.Mesh(geoMotor, matMotor);
    motor.name     = 'motor';
    motor.rotation.x = Math.PI/2;
    swing.add(motor);
    swing.position.set(0, 1, 0);
    this.fan.add(swing);

    const geoPipe = new THREE.CylinderGeometry(0.05,0.05, 1.0);
    const matPipe = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const pipe    = new THREE.Mesh(geoPipe, matPipe);
    pipe.name     = 'pipe';
    pipe.position.set(0, 0.5, 0);
    this.fan.add(pipe);

    const geoBase = new THREE.CylinderGeometry(0.25,0.25,0.05,36);
    const matBase = new THREE.MeshPhongMaterial({color: 0x524848});
    const base    = new THREE.Mesh(geoBase, matBase);
    base.name     = 'base';
    this.fan.add(base);

    this.fan.rotation.y = -Math.PI/4;
    this.fan.position.set(0, 0, 1);
    this.scene.add(this.fan);

  }

  createClock(){
    this.clock      = new THREE.Group();
    this.clock.name = 'clock';

    const geoFlame = new THREE.TorusGeometry(0.25, 0.025, 8, 36);
    const matFlame = new THREE.MeshPhongMaterial({color: 0x524848});
    const flame    = new THREE.Mesh(geoFlame, matFlame);
    flame.name     = 'flame';
    flame.position.set(1, 0, 1);
    this.clock.add(flame);

    const geoFrontBoard = new THREE.CircleGeometry(0.25, 16);
    const matFrontBoard = new THREE.MeshPhongMaterial();
    const frontBoard    = new THREE.Mesh(geoFrontBoard, matFrontBoard);
    frontBoard.name     = 'frontBoard';
    frontBoard.material.transparent = true;
    frontBoard.material.opacity = 0.4;
    frontBoard.position.set(1, 0, 1.025);
    this.clock.add(frontBoard);

    const geoBackBoard = new THREE.CircleGeometry(0.25, 16);
    const matBackBoard = new THREE.MeshPhongMaterial({color: 0xd8d0d1});
    const backBoard    = new THREE.Mesh(geoBackBoard, matBackBoard);
    backBoard.name     = 'backBoard';
    backBoard.position.set(1, 0, 0.975);
    this.clock.add(backBoard);

    const geoFastener  = new THREE.CylinderGeometry(
      0.025,
      0.025,
      0.012,
    );
    const matFastener = new THREE.MeshPhongMaterial({color: 0x59332e});
    const fastener    = new THREE.Mesh(geoFastener, matFastener);
    fastener.name     = 'fastener';
    fastener.position.set(1, 0, 1.0);
    fastener.rotation.x = Math.PI / 2;
    this.clock.add(fastener);

    const hourHand  = new THREE.Group();
    hourHand.name   = 'hourHand';
    const geoHour   = new THREE.BoxGeometry(0.025, 0.24, 0.012)
    const matHour   = new THREE.MeshPhongMaterial({color: 0x23190f});
    const hour      = new THREE.Mesh(geoHour, matHour);
    hour.name       = 'hour';
    hour.position.set(0, 0.16, 0);
    hourHand.add(hour);
    hourHand.scale.set(0.5, 0.5, 0.5);
    hourHand.position.set(1, 0, 1);
    this.clock.add(hourHand);
  
    const minuteHand  = new THREE.Group();
    minuteHand.name   = 'minuteHand';
    const geoMinute   = new THREE.BoxGeometry(0.025, 0.4, 0.012);
    const matMinute   = new THREE.MeshPhongMaterial({color: 0x23190f});
    const minute      = new THREE.Mesh(geoMinute, matMinute);
    minute.name       = 'minute';
    minute.position.set(0, 0.19, 0);
    minuteHand.add(minute);
    minuteHand.scale.set(0.5, 0.5, 0.5);
    minuteHand.position.set(1, 0, 1);
    this.clock.add(minuteHand);

    const secondHand  = new THREE.Group();
    secondHand.name   = 'secondHand';
    const geoSecond   = new THREE.BoxGeometry(0.025, 0.43, 0.012);
    const matSecond   = new THREE.MeshPhongMaterial({color: 0x23190f});
    const second      = new THREE.Mesh(geoSecond, matSecond);
    second.name       = 'second';
    second.position.set(0, 0.19, 0);
    secondHand.add(second);
    secondHand.scale.set(0.25, 0.5, 0.5);
    secondHand.position.set(1, 0, 1);
    this.clock.add(secondHand);

    this.clock.position.set(0, 0.5, 0);
    this.scene.add(this.clock);
    
  }
}