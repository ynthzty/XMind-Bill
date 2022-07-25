<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
      <div class="main-top"></div>
      <div class="main-center">
        <el-tabs
          class="main-tabs"
          v-model="activeName"
          type="border-card"
          @tab-click="handleClick"
          tabPosition="left"
        >
          <el-tab-pane label="用户管理" name="first">
            <div class="keyboard-mask">
              <input
                :value="input"
                class="input"
                @input="onInputChange"
                placeholder="Tap on the virtual keyboard to start"
              />
              <SimpleKeyboard
                @onChange="onChange"
                @onKeyPress="onKeyPress"
                :input="input"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth"
            >定时任务补偿</el-tab-pane
          >
        </el-tabs>
      </div>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
import SimpleKeyboard from "./SimpleKeyboard";
export default {
  name: "HelloWorld",
  components: {
    SimpleKeyboard,
  },

  data() {
    return {
      activeName: "first",
      input: "",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onChange(input) {
      this.input = input;
    },
    onKeyPress(button) {
      console.log("button", button);
    },
    onInputChange(input) {
      this.input = input.target.value;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  padding: 0;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-top {
  height: 80px;
  background-color: #a9906a;
}

.main-tabs {
  height: 100%;
}

.main-center {
  flex: 1;
}

input {
  width: 100%;
  height: 100px;
  padding: 20px;
  font-size: 20px;
  border: none;
  box-sizing: border-box;
}

.simple-keyboard {
  max-width: 850px;
}
</style>
