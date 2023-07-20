<!-- 加载3D模型文件 -->
<script lang="ts" setup>
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    // 引入three.js
import * as THREE from 'three';
import { onMounted } from 'vue';
// 初始化3d画布以及场景
const sence = new THREE.Scene()
const width = 800
const height = 500

// 透视投影相机PerspectiveCamera, 正投影相机
const camera = new THREE.PerspectiveCamera(30, width/height, 1, 1000)
camera.position.set(100, 100, 100)
camera.lookAt(0, 0, 0)

// WebGL渲染器WebGLRenderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)

// 设置环境光（十六进制颜色）
let ambient = new THREE.AmbientLight(0x444444);
sence.add(ambient)

renderer.render(sence, camera)

const loader = new OBJLoader()
loader.load('/public/PoleTowerModel/2.obj', function(obj){
    console.log('控制台查看加载obj文件返回的对象结构',obj);
  console.log('obj对象场景属性', obj.scene);
  obj.children[0].geometry.center()
  sence.add(obj.scene)
})
onMounted(()=>{
    document.getElementById('threeD').appendChild(renderer.domElement)
})
</script>
<template>
    <div class="threeD"></div>
</template>