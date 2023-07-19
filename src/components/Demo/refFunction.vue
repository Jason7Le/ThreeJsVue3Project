<template>
    <div>
        <h1>ref 函数</h1>
        <h3>reactive 处理的数据, 必须是复杂类型, 如果是简单类型无法处理成响应式, 所以有 ref 函数!

            <br>作用: 对传入的数据（一般简单数据类型），包裹一层对象, 转换成响应式。
        </h3>
        <p>
            ref 函数接收一个的值, 返回一个ref 响应式对象, 有唯一的属性 value

            <br> 在 setup 函数中, 通过 ref 对象的 value 属性, 可以访问到值

            <br>在模板中, ref 属性会自动解套, 不需要额外的 .value

            <br>ref函数也支持传入复杂类型，传入复杂类型，也会做响应式处理
        </p>
        <div>{{ money }}</div>
        <button @click="money++">Click</button>

        <h2>明确的对象，明确的属性，用reactive，其他用 ref</h2>
    </div>
</template>
<script lang="ts">
import { reactive, ref } from 'vue'
export default {
   setup() {
        let money = ref(0)
        money.value ++
        return {
            money
        }
   }
}
</script>