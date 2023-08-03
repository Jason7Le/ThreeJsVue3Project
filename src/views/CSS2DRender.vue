<script lang="ts" setup>
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
var camera, scene, renderer, labelRenderer;
function init() {
    renderer = new THREE.WebGLRenderer({
        altialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("dom").appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'fixed';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.zIndex = '100';
    document.getElementById("dom").appendChild(labelRenderer.domElement);
    const dom = document.createElement('div');
    dom.className = 'label'
    dom.innerHTML = "测试一个label";
    dom.setAttribute('data-name', 'label');
    dom.addEventListener('click', this.clickLabel, false);
    dom.addEventListener('mousedown', this.clickLabel, false);// 有时候PC端click事件不生效，不知道什么原因，就使用mousedown事件
    dom.addEventListener('touchstart', this.clickLabel, false);
    const Label = new CSS2DObject(dom);
    // position为3D坐标，数据类型Vector3
    Label.position.set(position.x, position.y + 14, position.z);
    Label.name = 'lable-name';
    // console.log(Label)
    scene.add(Label);
}
</script>
<template>
    <div id="dom"></div>
</template>
<style lang="sss" scoped>

</style>