<template>
    <div>
        <h1>script setup语法(★)</h1>
        <p>要使用这个语法，需要将 setup attribute 添加到代码块上：</P>

        <code>
            <script setup>
            console.log('hello script setup')
                </script>
        </code>

        <P>顶层的绑定会自动暴露给模板，所以定义的变量，函数和import导入的内容都可以直接在模板中直接使用</p>
            <h3>根组件</h3>
    <div>点击次数：{{ count }}</div>
    <button @click="add">点击修改</button>
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    const count = ref(0)
    const add = () =>{
        count.value ++
    }
</script>