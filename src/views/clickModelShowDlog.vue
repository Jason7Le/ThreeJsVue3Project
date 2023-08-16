<template>
    <div class="earth-container">
      <div
        id="container"
        class="container"
        ref="container"
      />
    </div>
  </template>
  
  <script>
  import * as THREE from "three";
  import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  let scene,  camera, renderer, controls
  export default {
    name: "Index",
    data() {
      return {
        scene: "",
        light: "",
        camera: "",
        controls: "",
        renderer: "",
        clickObjects:[],
        OrbitControlState: false,
        OrbitControlChangeState: false,
        // 存储已选中模型、挂牌、指示箭头和颜色
        select: {
          object: null, // 选中的模型
          selectedColor: 'red', // 选中的模型的颜色
          arrowColor: 'rgba(70, 160, 255, 1)', // 选中的模型指示箭头颜色
          originColor: null, // 选中的模型原本的的颜色
          arrow: null, // 选中的模型指示箭头
          sprite: null // 选中的模型挂牌
        }
      };
    },
    methods: {
      // 初始化three.js相关内容
      init() {
        scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x999999)); // 环境光
        this.light = new THREE.DirectionalLight(0xdfebff, 0.45); // 从正上方（不是位置）照射过来的平行光，0.45的强度
        this.light.position.set(100, 100, 400);
        this.light.position.multiplyScalar(0.3);
        this.light.shadow.camera.near = 20; // 产生阴影的最近距离
        this.light.shadow.camera.far = 20000; // 产生阴影的最远距离
        this.light.shadow.camera.left = -500; // 产生阴影距离位置的最左边位置
        this.light.shadow.camera.right = 500; // 最右边
        this.light.shadow.camera.top = 500; // 最上边
        this.light.shadow.camera.bottom = -500; // 最下面
  
        // 光源开启阴影
        this.light.castShadow = true;
        this.light.shadow.mapSize = new THREE.Vector2(1024, 1024);
        // var helper = new THREE.DirectionalLightHelper(this.light, 5);
        // scene.add(helper);
        scene.add(this.light);
  
        // 初始化相机
        camera = new THREE.PerspectiveCamera(
          20,
          window.innerWidth / window.innerHeight,
          0.1,
          10000000
        );
        camera.position.set(300, 500, 100);
        camera.lookAt(scene.position);
        renderer = new THREE.WebGLRenderer({
          alpha: true,
        });
        // renderer.setClearColor(0xff0000) // 设置背景颜色
        renderer.setPixelRatio(window.devicePixelRatio); // 为了兼容高清屏幕
        renderer.setSize(window.innerWidth, window.innerHeight); // 改成这样就可以居中
        renderer.shadowMap.enabled = true;
  
        const container = document.querySelector(".container"); // threeJS挂载位置
        container.appendChild(renderer.domElement);
        window.addEventListener("resize", this.onWindowResize, false); // 添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
  
        // 初始化控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0); // ------------------
        controls.minDistance = 800;
        controls.maxDistance = 500000;
        controls.maxPolarAngle = Math.PI / 2;
        controls.update();
  
        controls.addEventListener( 'start', this.startOrbitContorlHandler)
        controls.addEventListener( 'end', this.endOrbitContorlHandler)
        controls.addEventListener( 'change', this.changeOrbitContorlHandler)
      },
      // 窗口监听函数
      onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      render() {
        requestAnimationFrame(this.render);
        renderer.render(scene, camera);
      },
      // 外部模型加载函数
      loadGltf() {
        const that = this;
        // 加载模型
        var loader = new FBXLoader();
        //    loader.setPath('GLTF/')
        loader.load(
          "/static/PoleTowerModel/1.fbx",
          function (gltf) {
            // 就是两个模型 这个是动态的,下面是静态的,这些从sketchfab上面下载即可
            gltf.traverse((object) => {
              if (object.isMesh) {
                // 修改模型的材质
                // console.log(object);
                object.castShadow = true;
                object.receiveShadow = true;
  
           //     that.clickObjects.push(object);
              }
            });
            gltf.receiveShadow = true;
            //旋转--调整模型角度，以达到最好观看效果
            gltf.rotateY(Math.PI);
  
            that.scene.add(gltf);
          }
        );
      },
      addGeometry() {
        const size = 10000
        const divisions = 100
  
        const gridHelper = new THREE.GridHelper( size, divisions, '#000', '#999' )
        scene.add( gridHelper )
  
        const floorGeometry = new THREE.PlaneGeometry(size, size, 50, 50);
        const floorMaterial = new THREE.MeshPhongMaterial({
          color: 0x77028f,
          shininess: 0,
          // wireframe: true
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI
        // 地板接受阴影开启
        floor.receiveShadow = true;
        scene.add(floor);
      },
  
      //给模型添加点击事件
      onMouseClick(event) {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera(mouse, camera);
  
        // 获取raycaster直线和所有模型相交的数组集合
        //  var intersects = raycaster.intersectObjects(this.clickObjects);
        var intersects = raycaster.intersectObjects(scene.children);
        //console.log(intersects);
  
        //将所有的相交的模型的颜色设置为红色
        // for (var i = 0; i < intersects.length; i++) {
        //   intersects[i].object.material.color.set(0xff0000);
        // }
        //if(intersects.length>0){
          console.log('点击了对象：', intersects)
        //}
      },
      onPointerUp(event) {
        // 阻止此回调重复执行已有事件处理
        let evt = event,
        that = this
        event.preventDefault()
        that.pointerUpHandler(evt)
      },
      pointerUpHandler(event){
        if(!this.OrbitControlState || (this.OrbitControlState && !this.OrbitControlChangeState)){
          // 将控制器与模型点击事件区分
          let raycaster = new THREE.Raycaster()
          let intersections = []
          // 获取鼠标屏幕坐标
          var rect = renderer.domElement.getBoundingClientRect()
          let mouse = new THREE.Vector2()
          mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1
          mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1
  
          // 通过相机角度和鼠标位置计算射线
          raycaster.setFromCamera( mouse, camera )
          // 获取射线相交模型，存储在数组intersections中
          raycaster.intersectObjects( scene.children, true, intersections )
  
          let selectedObject = null, // 被选中的模型
          origin = null  // 被选中的模型与射线的交点，用于确定挂牌位置
  
          if(intersections.length>0){
            // 存在与射线相交模型
            for ( var i = 0; i < intersections.length; i++ ) {
              // 遍历与射线相交模型
              if(intersections[i].object instanceof THREE.Mesh){
                // 取第一个（距离最近）的相交Mesh类型模型
                // 如果要排除地面等参照模型，也可在此处添加判断条件
                selectedObject = intersections[i].object
                origin = intersections[i].point
                break
              }
            }
          }
  
          // 处理选中模型样式并触发生成挂牌
          // 如果selectedObject为null则清除之前选中的模型样式和挂牌
          this.setSingleSelect(selectedObject, origin)
        }
      },
      setSingleSelect(object, origin) {
        let popupPosition = origin?origin.clone().add(new THREE.Vector3( 0, 20, 0 )): null
        let arrowPosition = origin?origin.clone().add(new THREE.Vector3( 0, 3, 0 )): null
  
        // 根据模型uuid判断此模型是否已经被选中
        if(this.select.object && object && this.select.object.uuid === object.uuid){
          // 如果模型已选中，则不执行下面操作
          // 更新挂牌位置
          this.select.sprite.position = popupPosition
          this.select.arrow.position = arrowPosition
          return
        }
        if(this.select.object && this.select.originColor){
          // 如果存在选中模型，先清除之前选中模型的样式
          this.select.object.material.color.set( this.select.originColor )
        }
        if(this.select.arrow){
          // 如果存在挂牌箭头，先清除
          scene.remove(this.select.arrow)
          this.select.arrow = null
        }
        if(this.select.sprite){
          // 如果存在挂牌，先清除
          scene.remove(this.select.sprite)
          this.select.sprite = null
        }
  
        // 清空已选中模型和模型原本颜色
        this.select.object = null
        this.select.originColor = null
  
        if(object){
          // 如果传入选中的模型
          // 保存模型
          this.select.object = object
          // 保存模型原色
          this.select.originColor = '#' + object.material.color.getHexString()
          // 设置选中模型颜色
          object.material.color.set( this.select.selectedColor )
          // 添加选中指示箭头
          this.select.arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), arrowPosition, 15, this.select.arrowColor )
          scene.add(this.select.arrow)
          // 加载挂牌，传入挂牌文字和位置
          this.loadTextPopup('温度： 97.5℃', popupPosition)
        }
      },
      loadTextPopup(text, position){
        // 生成挂牌贴图
        let canvas = this.drawCanvas1(text)
  
        // 设置纹理
        let texture = new THREE.Texture(canvas)
        // 设置纹理属性，便于展示
        texture.needsUpdate = true
        // 设置材质
        const material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff })
        // 设置材质透明度
        material.opacity = 0.8
        // 设置挂牌
        this.select.sprite = new THREE.Sprite(material)
        // 设置挂牌位置
        this.select.sprite.position = position
        // 根据挂牌贴图尺寸比例初始化挂牌尺寸
        this.select.sprite.scale.set(10 / canvas.height * canvas.width, 10, 1)
        // 添加挂牌
        scene.add(this.select.sprite)
      },
      // 绘制异形挂牌
      drawCanvas1(text){
        let canvas = document.createElement('canvas'), // 画布
        ctx = canvas.getContext('2d'), // 画笔
        fontSize = 40, // 字体大小
        paddingv = 20, // 挂牌上下与文字距离
        paddingh = 30, // 挂牌左右与文字距离
        backgroundColor = 'rgba(70, 160, 255, 1)', // 挂牌背景色
        fontColor = 'white',  // 挂牌文字颜色
        borderWidth = 5  // 挂牌背景描边宽度
  
        ctx.font = fontSize + "px Arial"
        // 测量文字在画布中的长度，用于计算画布尺寸
        let textWidth = Math.ceil(ctx.measureText(text).width),
        canvasWidth = textWidth + 2*paddingh,
        canvasHeight = fontSize + 2*paddingv
  
        // 设置画布尺寸
        canvas.width = canvasWidth
        canvas.height = canvasHeight
  
        // 绘制一个形状
        let radius = 5 || Math.min(paddingv, paddingh)
        ctx.beginPath()
        ctx.lineWidth = borderWidth
        ctx.strokeStyle = 'blue'
        ctx.moveTo(paddingh + borderWidth, borderWidth)
        ctx.lineTo(canvasWidth - borderWidth - radius, borderWidth)
        // 右上拐角圆弧
        ctx.arcTo(canvasWidth - borderWidth, borderWidth, canvasWidth - borderWidth, borderWidth + radius, radius)
        ctx.lineTo(canvasWidth - borderWidth, canvasHeight - borderWidth - radius)
        // 右下拐角圆弧
        ctx.arcTo(canvasWidth - borderWidth, canvasHeight - borderWidth, canvasWidth - borderWidth - radius, canvasHeight - borderWidth, radius)
        ctx.lineTo(borderWidth + radius, canvasHeight - borderWidth)
        // 左下拐角圆弧
        ctx.arcTo(borderWidth, canvasHeight - borderWidth, borderWidth, canvasHeight - borderWidth - radius, radius)
        ctx.lineTo(borderWidth, paddingv + borderWidth)
        ctx.closePath()
        ctx.stroke()
        ctx.clip()
  
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
  
        ctx.fillStyle = fontColor
        ctx.font = fontSize + "px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  
        return canvas
      },
      startOrbitContorlHandler(evt){
        this.OrbitControlState = true
      },
      endOrbitContorlHandler(evt){
        this.OrbitControlState = false
        this.OrbitControlChangeState = false
      },
      changeOrbitContorlHandler(evt){
        this.OrbitControlChangeState = true
      }
    },
    mounted() {
      this.init();
      this.loadGltf();
      this.render();
      this.addGeometry();
      renderer.domElement.addEventListener( 'pointerup', this.onPointerUp )
      // window.addEventListener("click", this.onMouseClick, false);
    },
    components: {},
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
  .earth-container {
    width: 100%;
    height: 100%;
  }
  </style>