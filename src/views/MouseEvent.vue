<!-- Raycaster(射线拾取模型) -->
<script lang="ts" setup>
// 引入three.js
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { addBottomGrid } from '../utils.js'
import { onMounted, onUpdated, onBeforeUpdate, onBeforeMount, getCurrentInstance, ref } from 'vue';
let threeDdom = ref(null)
let scene, camera, renderer
const pageInstance = getCurrentInstance()
let towermesh
// 创建场景
const createScene = function () {
    scene = new THREE.Scene()
}
// 创建相机
const createCamera = function () {
    const container = document.getElementById('threeDdom')
    const width = container.offsetWidth
    const height = container.offsetHeight
    console.log(width / height)
    // 透视投影相机PerspectiveCamera, 正投影相机
    camera = new THREE.PerspectiveCamera(12000, width / height, 1, 10000)
    camera.position.set(-0.685, 3.977, 38.784)
    // 相机观察目标指向Threejs 3D空间中某个位置
    camera.lookAt(0, 0, 0) // 坐标原点
    // camera.lookAt(0, 10, 0)//y 轴上位置10
    scene.add(camera)
}

// 创建光源
const createLight = function () {
    // 设置环境光（十六进制颜色）
    let ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient)


    // 设置点光源（十六进制颜色）
    let pointlight = new THREE.PointLight(0xffffff)
    pointlight.position.set(400, 200, 300)
    scene.add(pointlight)
    // 平行光
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(-400, 120, -300)
    // 点光源辅助观察
    // const directionalLightHelper = new THREE.PointLightHelper(directionalLight, 10)
    // scene.add(directionalLightHelper)
    scene.add(directionalLight)
}

// 增加虚拟模型
const AddVirtualModel = function () {
    const material = new THREE.MeshLambertMaterial({
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
    })
    // 创建一个长方体几何对象Geometry
    const grometry = new THREE.BoxGeometry(0, 0, 0)
    const mesh = new THREE.Mesh(grometry, material)
    mesh.position.set(50, 50, 50)
    scene.add(mesh)
}



// 创建渲染器
const createRender = function () {
    const container = document.getElementById('threeDdom')
    const width = container?.offsetWidth
    const height = container?.offsetHeight
    // WebGL渲染器WebGLRenderer
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    renderer.render(scene, camera)

    // 改变背景透明度值
    renderer.setClearAlpha(0.1)
    // 设置渲染器的初始颜色（十六进制颜色, 透明度）
    renderer.setClearColor(0xEEEEEE, 1)
}

// 创建控件对象
const createControls = function () {
    //监听鼠标、键盘事件
    const controls = new OrbitControls(camera, renderer.domElement)
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
        renderer.render(scene, camera)//执行渲染操作
        // console.log('camera', camera.position)
    })
}

// 增加底部网格
const addBottomGridFn = function () {
    let BottomGrid = addBottomGrid(THREE)
    scene.add(BottomGrid.plane)
    scene.add(BottomGrid.helper)
}

// 渲染
function render() {
    // mesh.rotateX(0.01)//每次绕X轴旋转0.01弧度
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
// 射线拾取模型
function addRaycaster() {
    const raycaster = new THREE.Raycaster()
    console.log('射线属性', raycaster)
    // 设置射线起点
    raycaster.ray.origin = new THREE.Vector3(100, 0, 0)
    // 设置射线方向射线方向沿着x轴
    raycaster.ray.direction = new THREE.Vector3(50, 10, 0)
    // 射线发射拾取模型对象
    console.log(towermesh)
    const intersects = raycaster.intersectObjects([towermesh])
    console.log("射线器返回的对象", intersects)
}
// 辅助观察坐标系
function addAxesHelper() {
    const axesHelper = new THREE.AxesHelper(50)
    scene.add(axesHelper)
}
// 加载三维模型文件
const loadFbx = function () {
    // 加载三维模型文件
    const loader = new FBXLoader()
    loader.load('/static/PoleTowerModel/tower2.fbx', function (obj) {
        console.log('控制台查看加载obj文件返回的对象结构', obj);
        console.log('obj对象场景属性', obj.scene);
        obj.name = 'test-tower2'
        obj.scale.set(.043, .043, .043)
        obj.position.set(0, -50, 0)
        towermesh = obj
        addRaycaster() //射线拾取模型
        scene.add(obj)
    },
        // onProgress回调
        function (xhr) {
            console.log(xhr)
        },
        // onError回调
        function (err) {
            console.error('An error happened' + err);
        }
    )
    loader.load('/static/PoleTowerModel/monitoringHost.fbx', (obj) => {
        console.log('监控主机', obj);
        obj.name = '监控主机'
        obj.scale.set(.03, .03, .03)
        obj.position.set(0, 10, 0)
        scene.add(obj)
    })
}
// 获取与射线相交的对象数组
const getIntersects = (event) => {
    event.preventDefault();
    // console.log('event.clientX:' + event.clientX)
    // console.log('event.clientY:' + event.clientY)
    // 声明 raycaster 和 mouse 变量
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, camera);

    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    const intersects = raycaster.intersectObjects(scene.children)

    //返回选中的对象
    return intersects
}
// 点击鼠标
const onMouseClick = (event) => {
    // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
    const intersects = getIntersects(event)
    // console.log('点击鼠标intersects:', intersects)
    if(intersects.length !==0){
        for(let item of intersects){
            if(item.object instanceof THREE.Mesh){
                if( item.object.parent.name=== 'test-tower2'){
                    console.log('你點中了: ', item.object.parent.name, item)
                }
                if(item.object.parent.name=== '监控主机'){
                    console.log('你點中了: ', item.object.parent.name, item)
                }
            }
        }
    }
    // 获取选中最近的 Mesh 对象
    if(intersects.length !==0 && intersects[0].object instanceof THREE.Mesh){
        let selectObject = intersects[0].object
        console.log('选中 Mesh:', selectObject)
    }else {
        // alert("未选中Mesh!");
    }
}
// 初始化
const initThree = () => {
    createScene() // 创建场景
    createCamera() // 创建相机
    loadFbx() // 加载三维模型
    createLight() // 创建光源
    createRender() // 创建渲染器
    createControls() // 创建控件对象
    addBottomGridFn() // 增加底部网格
    AddVirtualModel() // 增加虚拟模型
    addAxesHelper() // 辅助观察坐标系
    render() // 渲染
    addEventListener('click', onMouseClick, false)
}
onMounted(() => {
    initThree()
    document.getElementById('threeDdom').appendChild(renderer.domElement)
})
onBeforeMount(() => {
})


</script>
<template>
    <div id="threeDdom">
        <div id="infO"></div>
    </div>
</template>
<style scoped>
#threeDdom {
    width: 500px;
    height: 800px;
}

#tag {
    width: 100px;
    height: 100px;
    background-color: gray;
    position: absolute;
    top: 0;
    pointer-events: none;
    text-align: center;
    line-height: 100px;
}
</style>