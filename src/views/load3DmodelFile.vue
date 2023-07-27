<!-- 加载3D模型文件 -->
<script lang="ts" setup>
// 引入three.js
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {addBottomGrid} from '../utils.js'
import { onMounted, onUpdated, onBeforeUpdate, onBeforeMount } from 'vue';
// 初始化3d画布以及场景
let scene = new THREE.Scene()
const width = 500
const height = 800

console.log(width / height)

// 透视投影相机PerspectiveCamera, 正投影相机
const camera = new THREE.PerspectiveCamera(12000, width / height, 1, 10000)
camera.position.set(-0.685, 3.977, 38.784)
// 相机观察目标指向Threejs 3D空间中某个位置
camera.lookAt(0, 0, 0) // 坐标原点
// camera.lookAt(0, 10, 0)//y 轴上位置10


// 设置环境光（十六进制颜色）
let ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient)


// 设置点光源（十六进制颜色）
let pointlight = new THREE.PointLight(0xffffff)
pointlight.position.set(400, 200, 300)
scene.add(pointlight)



const material = new THREE.MeshLambertMaterial({
    transparent: true, //使用背景透明的png贴图，注意开启透明计算

})
// 创建一个长方体几何对象Geometry
const grometry = new THREE.BoxGeometry(0, 0, 0)
const mesh = new THREE.Mesh(grometry, material)
mesh.position.set(50, 50, 50)
scene.add(mesh)

// 加载三维模型文件
const loader = new FBXLoader()
loader.load('/static/PoleTowerModel/1.fbx', function (obj) {
    console.log('控制台查看加载obj文件返回的对象结构', obj);
    console.log('obj对象场景属性', obj.scene);
    obj.scale.set(.043, .043, .043)
    obj.position.set(0, -50, 0)
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



// WebGL渲染器WebGLRenderer
let renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.render(scene, camera)

// 改变背景透明度值
renderer.setClearAlpha(0.1)
// 设置渲染器的初始颜色（十六进制颜色, 透明度）
renderer.setClearColor(0xEEEEEE, 1)

//监听鼠标、键盘事件
const controls = new OrbitControls(camera, renderer.domElement)
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
    renderer.render(scene, camera)//执行渲染操作
    console.log('camera', camera.position)
})

// 增加底部网格
let BottomGrid = addBottomGrid(THREE)
scene.add(BottomGrid.plane)
scene.add(BottomGrid.helper)

function render() {
    // mesh.rotateX(0.01)//每次绕X轴旋转0.01弧度
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

render()
onMounted(() => {
    document.getElementById('threeD').appendChild(renderer.domElement)
})
onBeforeMount(() => {
    render()
})


</script>
<template>
    <div id="threeD">
        <div id="infO"></div>
    </div>
</template>
<style scoped>
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