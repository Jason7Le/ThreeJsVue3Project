<template>
    <div>
        <canvas class="c" ref="ThreeJS"></canvas>
    </div>
</template>

<script>
    import * as THREE from 'three'
    export default{
        data(){
            return{
                scene: null,
                camera: null,
                cameraPole: null,
                renderer: null,
                canvas: null,
                canvasW: 0,
                canvasH: 0,
                cameraParam: {
                    fov: 30,
                    aspect: 2,
                    near: .1,
                    far: 200
                },
                planArr: [
                    { x: -3, y: 3, name: '第一块区域' },
                    { x: 3, y: 3, name: '第二块区域'},
                    { x: -3, y: -3, name: '第三块区域' },
                    { x: 3, y: -3, name: '第四块区域' }
                ],
                events: {
                    raycaster: new THREE.Raycaster(),
                    pickedObject: null,
                    pickedObjectSavedColor: 0,
                    pickPosition: { x: 0, y: 0 }
                }
            }
        },
        created() {
            this.canvasW = window.innerWidth;
            this.canvasH = window.innerHeight;
            // 初始化设置宽高比
            this.cameraParam.aspect = this.canvasW / this.canvasH
        },
        mounted(){
            this.start()
        },
        methods: {
            start(){
                // 初始化三要素
                this.initMain()
                // 启用渲染
                this.render()
            },
            initMain(){
                // 初始化三要素
                this.initScene()
                this.initCamera()
                this.initRenderer()
                
                // 添加环境光
                this.addLight()
                
                // 添加形状
                this.createCube()
                
                // 调用点击事件
                this.clickEvents()
            },
            initScene(){
                // 创建场景
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color('white');
            },
            initCamera(){
                // 创建透视摄像头
                const cP = this.cameraParam;
                this.camera = new THREE.PerspectiveCamera(cP.fov, cP.aspect, cP.near, cP.far);
                this.camera.position.z = 30;
                this.scene.add(this.camera)
            },
            initRenderer(){
                // 渲染器
                this.canvas = this.$refs.ThreeJS;
                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.canvas,
                    antialias: true,//是否开启反锯齿，设置为true开启反锯齿。
                    alpha: true,//是否可以设置背景色透明。
                    logarithmicDepthBuffer: true//模型的重叠部位便不停的闪烁起来。这便是Z-Fighting问题，为解决这个问题，我们可以采用该种方法
                })
            },
            addLight(){
                // 环境光
                const color = 0xFFFFFF;
                const intensity = 1;
                const light = new THREE.AmbientLight(color, intensity);
                this.scene.add(light)
            },
            render(){
                // 启动动画
                this.renderer.render(this.scene, this.camera);
                // 动态监听窗口尺寸变化
                if (this.resizeRendererToDisplaySize(this.renderer)) {
                    const canvas = this.renderer.domElement;
                    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    this.camera.updateProjectionMatrix();
                }
                requestAnimationFrame(this.render.bind(this))
            },
            resizeRendererToDisplaySize(renderer){
                const canvas = renderer.domElement;
                this.canvasW = window.innerWidth;
                this.canvasH = window.innerHeight;
                const needResize = canvas.width !== this.canvasW || canvas.height !== this.canvasH;
                if(needResize){
                    this.renderer.setSize(this.canvasW, this.canvasH, false);
                }
                return needResize;
            },
            
            // ====================================基础设置完成=======================
            // ====================================创建立方体========================
            geometry(width, height, depth){
                return new THREE.BoxGeometry(width, height, depth)
            },
            createCube(){
                for(let i = 0; i < this.planArr.length; i++){
                    // 添加几何体
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x8aff58
                    })
                    
                    const cube = new THREE.Mesh(this.geometry(5, 5, .001), material);
                    this.scene.add(cube);
                    // 添加名称
                    cube.name = this.planArr[i].name
                    // 设置几何模型形变
                    cube.position.set(this.planArr[i].x, this.planArr[i].y, 0)
                    
                    // 添加文字
                    let texture = new THREE.Texture(this.getTextCanvas(this.planArr[i].name));
                    texture.needsUpdate = true;
                    let spriteMaterial = new THREE.PointsMaterial({
                            map: texture,
                            size: 12,
                            transparent: true,
                            opacity: 1,
                    });
                    //创建坐标点，并将材质给坐标
                    let geometry = new THREE.BufferGeometry();
                    let vertices = [0, 0, 0];
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    let sprite = new THREE.Points(geometry, spriteMaterial);
                    sprite.position.set(0, 0, .002);
                    
                    cube.add(sprite);
                }
            },
            // 创建文字canvas
            getTextCanvas(text){
                var width=100, height=100; 
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, width, height);
                ctx.font = '6px';
                ctx.fillStyle = '#2891FF';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, width/2,height/2); 
                return canvas;
            },
            // 点击当前坐标
            clickPickPosition(){
                this.pickEvents(this.events.pickPosition, this.scene, this.camera, obj=>{
                    obj.userData.checked = !obj.userData.checked;
                    // alert(`您选中了--${obj.name}`)
                    if(!obj.userData.checked){
                        obj.material.color.setHex(0x8aff58)
                        alert(`您已经取消选中--${obj.name}`)
                    }else{
                        obj.material.color.setHex(0xFFFF00)
                        alert(`您选中了--${obj.name}`)
                    }
                })
            },
            // 获取当前焦点坐标
            setPickPosition(event){
                const pos = this.getCanvasRelativePosition(event);
                this.events.pickPosition.x = (pos.x / this.canvas.width) * 2 - 1;
                this.events.pickPosition.y = (pos.y / this.canvas.height) * -2 + 1;
                
                this.pickEvents(this.events.pickPosition, this.scene, this.camera)
            },
            // 获取当前事件焦点坐标所在位置
            getCanvasRelativePosition(event){
                const rect = this.canvas.getBoundingClientRect();
                return {
                    x: (event.clientX - rect.left) * this.canvas.width / rect.width,
                    y: (event.clientY - rect.top) * this.canvas.height / rect.height
                }
            },
            // 添加鼠标划过以及点击事件
            clickEvents(){
                window.addEventListener('click', this.clickPickPosition);   
                window.addEventListener('mousemove', this.setPickPosition);
            },
            // 创建点击事件(默认是离摄像头最近的相交)
            pickEvents(normalizedPosition, scene, camera, callback){
                // 如果存在拾取的对象，则恢复颜色
                if(this.events.pickedObject){
                    this.events.pickedObject.material.emissive.setHex(this.events.pickedObjectSavedColor);
                    this.events.pickedObject = undefined;
                }
                // 沿着摄像头的方向投射射线
                this.events.raycaster.setFromCamera(normalizedPosition, camera)
                // 获取与射线光线相交的对象列表
                const intersectedObjects = this.events.raycaster.intersectObjects(this.scene.children);
                if(intersectedObjects.length){
                    // 获取与射线光纤相交的第一个对象。也是最近的一个
                    this.events.pickedObject = intersectedObjects[0].object;
                    // 保存当前对象的颜色
                    this.events.pickedObjectSavedColor = this.events.pickedObject.material.emissive.getHex();
                    // 将其发射颜色设置为闪烁的红色/黄色
                    this.events.pickedObject.material.emissive.setHex(0xFFFF00)
                    
                    if(callback){
                        callback(this.events.pickedObject)
                    }
                }
            },
        }
    }
</script>

<style>

    .c{
        width: 500px;
    height: 800px;
    }
</style>
