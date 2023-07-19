<template>
    <div>
        <h1>reactive 函数</h1>
        <p>psetup 需要有返回值, 只有返回的值才能在模板中使用</p>
        <p>默认普通的数据, 不是响应式的</p>
        <h3>作用: 传入一个复杂数据类型，将复杂类型数据, 转换成响应式数据 （返回该对象的响应式代理）</h3>

        <div>{{ obj.name }}</div>
        <div>{{ obj.age }}</div>
        <button @click="obj.name = 'lisa'">Change Value!</button>

        <h2>总结： 通常是用来定义响应式 对象数据, Reactive 函数是一种强大的编程模式，它可以使程序更加响应式和易于维护。它的作用包括处理异步数据流、构建响应式UI等</h2>
    </div>
</template>
<script lang="ts">
import { reactive } from 'vue'
export default {
    setup() {
        const obj = reactive({
            name: 'jakc',
            age: 18
        })
        return {
            obj
        }
    }
}
</script>