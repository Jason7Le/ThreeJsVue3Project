<template>
    <div class="container">
        <p>
            composition api的使用, 需要配置一个setup 函数

            <br>1.setup 函数是一个新的组件选项, 作为组件中 compositionAPI 的起点

            <br>2.从生命周期角度来看, setup 会在 beforeCreate 钩子函数之前执行

            <br>3.setup 中不能使用 this, this 指向 undefined

            <br>4.在模版中需要使用的数据和函数，需要在 setup 返回。
        </p>
        <h1 @click="say()">{{ msg }}</h1>
    </div>
</template>
<script lang="ts">
export default {
    setup(){
        console.log('setup action!')
        console.log('this', this)
        const msg = 'Hi~  VUE3'
        const say = () =>{
            console.log(msg)
        }
        return {
            msg,
            say
        }
    }
}
</script>