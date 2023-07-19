<script lang="ts" setup>
import { onMounted } from 'vue'
// 引入three.js
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 三维场景Scene
// 创建3D场景对象Scene
const scene = new THREE.Scene();

// 物体形状：几何体Geometry,设置几何体长宽高，也就是x、y、z三个方向的尺寸
// 创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(80, 40, 50);

// 物体外观：材质Material
// 创建一个材质对象Material不受光照影响
// const material = new THREE.MeshBasicMaterial({
//     color: 'orange',//0xff0000设置材质颜色为红色
//     transparent: true,
//     opacity: 0.5
// })

//MeshLambertMaterial受光照影响
const material = new THREE.MeshLambertMaterial({
    color: 'orange',//0xff0000设置材质颜色为红色
    // transparent: true,
    // opacity: 0.5
})


// 物体：网格模型Mesh
// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh

// 模型位置position
mesh.position.set(0, 0, 0)
scene.add(mesh)

// 透视投影相机PerspectiveCamera, 正投影相机OrthographicCamera (opens new window)和透视投影相机PerspectiveCamera
// const camera = new THREE.PerspectiveCamera();



// width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
const width = window.innerWidth || 800
const height = window.innerHeight || 500
// PerspectiveCamera( fov视场角度, aspectCanvas画布宽高比, near近裁截面, far远裁截面 )
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 1000)
// 相机位置.position
//相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(100, 100, 100);

// 相机观察目标.lookAt()
// 相机观察目标指向Threejs 3D空间中某个位置
camera.lookAt(0, 0, 0) // 坐标原点
camera.lookAt(0, 0, 0)//y 轴上位置10
camera.lookAt(mesh.position); //指向mesh对应的位置


// WebGL渲染器WebGLRenderer
const renderer = new THREE.WebGLRenderer()
// 设置Canvas画布尺寸.setSize()
renderer.setSize(width, height)
// 渲染器渲染方法.render()
renderer.render(scene, camera)
// document.body.appendChild(renderer.domElement);

// 辅助观察坐标系
const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

// 点光源PointLight
const pointLight = new THREE.PointLight(0xffffff, 1.0)
pointLight.position.set(100, 60, 50)

// 点光源辅助观察PointLightHelper
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)
scene.add(pointLightHelper)


// 环境光AmbientLight
// const AmbientLight = new THREE.AmbientLight(0xffffff, 1.0)
// scene.add(AmbientLight)

// 平行光DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(-100, -100, 50);

// directionalLight.position.set(100, 0, 0);
// directionalLight.position.set(0, 100, 0);
// directionalLight.position.set(100, 100, 100);
// directionalLight.position.set(100, 60, 50);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh
scene.add(directionalLight)

// 平行光辅助观察DirectionalLightHelper
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(dirLightHelper)

// 相机控件OrbitControls
// 使用OrbitControls
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
// controls.addEventListener('change', function () {
//     renderer.render(scene, camera)//执行渲染操作
//     console.log('camera.position', camera.position)
// })
//监听鼠标、键盘事件

// 渲染函数
const clock = new THREE.Clock();
function render() {
    // 计算两帧渲染时间间隔和帧率
    const spt = clock.getDelta() * 1000
    // console.log('两帧渲染时间间隔(毫秒)',spt)
    // console.log('帧率FPS', 1000/spt)
    renderer.render(scene, camera);
    // mesh.rotateY(0.01)//每次绕y轴旋转0.01弧度
    mesh.rotateX(0.01)//每次绕X轴旋转0.01弧度
    // mesh.rotateZ(0.01)//每次绕z轴旋转0.01弧度
    requestAnimationFrame(render)//请求再次执行渲染函数render，渲染下一帧
}
render();

// canvas画布宽高度动态变化
// onresize 事件会在窗口被调整大小时发生
window.onresize = function(){
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight)
     // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
}
onMounted(() => {
    document.getElementById('webgl').appendChild(renderer.domElement)
})




</script>
<template>
    <div id="webgl" style="margin: 0 auto;">

    </div>
</template>