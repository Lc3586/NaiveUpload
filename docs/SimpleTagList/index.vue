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
  <el-tag
    v-for="(item, index) in renderData.list"
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

  <div v-show="renderData.input.visible">
    <div :title="'按下回车键确认添加此' + props.name">
      <el-input
        v-model="renderData.input.value"
        :placeholder="'请输入' + props.name"
        @keyup.enter="confirm"
        :title="'按下回车键确认添加此' + props.name"
        :ref="setInputRef"
        clearable
      />
    </div>
  </div>

  <el-button
    v-show="!renderData.input.visible && !props.readonly"
    @click="show"
    type="primary"
    link
    size="small"
  >
    + 添加新{{ props.name }}
  </el-button>
</template>

<script lang="ts" setup>
import { ElTag, ElInput, ElButton } from "element-plus";
import { ComponentPublicInstance, reactive } from "vue-demi";

/**
 * 渲染数据
 */
const renderData = reactive({
  /**
   * 数据集合
   */
  list: [] as unknown[],
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
    value: null as unknown,
  },
});

// 组件属性
const props = withDefaults(
  defineProps<{
    /**
     * 数据集合
     */
    modelValue: unknown[];
    /**
     * 名称
     *
     * @默认值 内容
     */
    name?: string;
    /**
     * 只读
     * <p>没有操作按钮，只能查看不能修改</p>
     */
    readonly?: boolean;
  }>(),
  {
    title: "内容",
    modelValue: () => [],
    readonly: false,
  }
);

/**
 * 获取显示文本
 *
 * @param value 值
 */
const getText = (value: unknown): string => {
  return value as string;
};

// 数据输入组件引用对象
let inputRef: HTMLInputElement;

/**
 * 设置数据输入组件引用对象
 *
 * @param el 引用对象
 */
const setInputRef = (el: Element | ComponentPublicInstance | null) => {
  inputRef = el as HTMLInputElement;
};

/**
 * 显示新增输入框
 */
const show = () => {
  renderData.input.visible = true;
  // 输入框获取焦点
  inputRef.focus();
};

/**
 * 确认新增
 */
const confirm = () => {
  if (renderData.input.value) {
    renderData.list.push(renderData.input.value);

    // 通知数据已变更
    emit("update:modelValue", renderData.list);
  }

  renderData.input.visible = false;
  renderData.input.value = null;
};

/**
 * 移除
 *
 * @param index 索引
 */
const remove = (index: number) => {
  renderData.list.splice(index, 1);

  // 通知数据已变更
  emit("update:modelValue", renderData.list);
};

// 组件自定义事件
const emit = defineEmits<{
  /**
   * 数据变更结果
   *
   * @param e
   * @param list 数据集合
   */
  (e: "update:modelValue", list: unknown[]): void;
}>();

(async () => {
  //写入数据
  renderData.list = props.modelValue;
})();
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 7px;
}
</style>
