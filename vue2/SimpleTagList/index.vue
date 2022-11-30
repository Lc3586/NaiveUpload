<!--
简单标签集组件

通过标签的展示形式来维护数组数据
使用示例：
  <template>
    <simple-tag-list v-model="optionList"
              name="选项"
              :type="DataType.字符串">
    </simple-tag-list>
  </template>

  <script lang="ts" setup>
  import {reactive} from "vue";
  import SimpleTagList from '@/components/SimpleTagList/index.vue';

  const loading = reactive(['值一', '值二', '值三']);
  </script>

@author LCTR
@date 2022-07-25
-->

<template>
  <div>
    <el-tag
      v-for="(item, index) in list"
      :key="index"
      type="info"
      size="small"
      :closable="!props.readonly"
      :disable-transitions="false"
      :title="item"
      @close="remove(index)"
      effect="plain"
    >
      {{ getText(item) }}
    </el-tag>

    <div v-show="input.visible">
      <div :title="'按下回车键确认添加此' + props.name">
        <el-input
          v-model="input.value"
          :placeholder="'请输入' + props.name"
          @keyup.enter="confirm"
          :title="'按下回车键确认添加此' + props.name"
          :ref="setInputRef"
          clearable
        />
      </div>
    </div>

    <el-button
      v-show="!input.visible && !props.readonly"
      @click="show"
      type="primary"
      link
      size="small"
    >
      + 添加新{{ props.name }}
    </el-button>
  </div>
</template>

<script>
import { ElTag, ElInput, ElButton } from "element-ui";

// 数据输入组件引用对象
let inputRef;

export default {
  name: "SimpleTagList",
  props: {
    /**
     * 数据集合
     */
    modelValue: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * 名称
     *
     * @默认值 内容
     */
    name: {
      type: String,
      default() {
        return "内容";
      },
    },
    /**
     * 只读
     * <p>没有操作按钮，只能查看不能修改</p>
     */
    readonly: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  components: {},
  /**
   * 渲染数据
   */
  data() {
    return {
      /**
       * 数据集合
       */
      list: [],
      /**
       * 输入框信息
       */
      input: {
        /**
         * 显示状态
         */
        visible: false,
        /**
         * 值
         */
        value: null,
      },
    };
  },
  watch: {},
  /**
   * 初始化方法
   */
  created() {
    //写入数据
    this.list = props.modelValue;
  },
  methods: {
    /**
     * 获取显示文本
     *
     * @param value 值
     */
    getText(value) {
      return value;
    },

    /**
     * 设置数据输入组件引用对象
     *
     * @param el 引用对象
     */
    setInputRef(el) {
      inputRef = el;
    },

    /**
     * 显示新增输入框
     */
    show() {
      this.input.visible = true;
      // 输入框获取焦点
      inputRef.focus();
    },

    /**
     * 确认新增
     */
    confirm() {
      if (this.input.value) {
        this.list.push(this.input.value);

        // 通知数据已变更
        this.$emit("update:modelValue", this.list);
      }

      this.input.visible = false;
      this.input.value = null;
    },

    /**
     * 移除
     *
     * @param index 索引
     */
    remove(index) {
      this.list.splice(index, 1);

      // 通知数据已变更
      this.$emit("update:modelValue", this.list);
    },
  },
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 7px;
}
</style>
