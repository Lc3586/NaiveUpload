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
      v-for="(item, index) in value"
      :key="index"
      type="info"
      size="small"
      :closable="!readonly"
      :disable-transitions="false"
      :title="item"
      @close="remove(index)"
      effect="plain"
    >
      {{ getText(item) }}
    </el-tag>

    <div v-show="input.visible">
      <div :title="'按下回车键确认添加此' + name">
        <el-input
          v-model="input.value"
          :placeholder="'请输入' + name"
          @keyup.enter="confirm"
          :title="'按下回车键确认添加此' + name"
          ref="inputRef"
          clearable
        />
      </div>
    </div>

    <el-button
      v-show="!input.visible && !readonly"
      @click="show"
      type="primary"
      link
      size="small"
    >
      + 添加新{{ name }}
    </el-button>
  </div>
</template>

<script>
import { ElTag, ElInput, ElButton } from "element-ui";

export default {
  name: "SimpleTagList",
  props: {
    /**
     * 数据集合
     */
    value: {
      type: Array,
      default() {
        return [];
      },
      require: true,
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
  /**
   * 渲染数据
   */
  data() {
    return {
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
     * 显示新增输入框
     */
    show() {
      this.input.visible = true;
      // 输入框获取焦点
      this.$nextTick(() => this.$refs.inputRef.$refs.input.focus());
    },

    /**
     * 确认新增
     */
    confirm() {
      if (this.input.value) {
        this.value.push(this.input.value);

        // 通知数据已变更
        this.$emit("change", this.value);
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
      this.$emit("change", this.value);
    },
  },
};
</script>
<style scoped>
.el-tag {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
