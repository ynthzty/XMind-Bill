<template>
  <el-container>
    <el-header class="header-title" type="flex"  justify="center" height="5rem">My Bill</el-header>
    <el-main class="bill-main">
      <div class="main-top"></div>
      <div class="main-center">
        <div class="steps-main">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="上传账单"></el-step>
            <el-step title="上传附件"></el-step>
          </el-steps>
        </div>
        <div class="step-content" v-if="active == 0">
          <el-upload 
            class="upload-demo"
            drag
            ref="uploadBill"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="uploadBill"
            accept=".csv"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传csv文件</div>
          </el-upload>
        </div>

        <div class="step-content" v-else-if="active == 1">
          <el-upload 
            class="upload-demo"
            drag
            ref="uploadAttachments"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="uploadAttachments"
            accept=".csv"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传csv文件</div>
          </el-upload>
        </div>

        <div class="step-content" v-else>
          <el-button type="primary" @click="goBillPage">查看账单</el-button>
        </div>
<!-- 
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
        
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Papa from "papaparse";
export default {
  name: "UploadPage",
  components: {},

  data() {
    return {
      active: 0,
      billResults: [],
      attachResults: []
    }
  },
  created() {
    
  },

  watch: {
  
  },
  filters: {
   
  },
  methods: {
    //步骤条下一步
    next() {
        if (this.active++ > 2) this.active = 0;
    },
    //验证csv文件
    checkFile(file){
      const isCSV = file.raw.type === "text/csv";

      if (!isCSV) {
        this.$message.error("只能上传csv文件!");
        return false;
      } else {
        return true;
      }
    },
    //上传账单
    uploadBill(file){
      let _this = this;

      if(this.checkFile(file)){
        Papa.parse(file.raw, {
          complete: function (results) {
            //处理csv文件
            sessionStorage.setItem("billResults", JSON.stringify(results.data));

            _this.billResults = results.data;
          },
        });
      }
      this.next()
      this.$refs.uploadBill.clearFiles()
      
    },
    //上传附件
    uploadAttachments(file){
      let _this = this;
      console.log("attach");
       if(this.checkFile(file)){
        Papa.parse(file.raw, {
          complete: function (results) {
            //处理csv文件
            sessionStorage.setItem("attachResults", JSON.stringify(results.data));
            _this.attachResults = results.data;
          },
        });
      }
      this.next()
      this.$refs.uploadAttachments.clearFiles()
    },

    goBillPage(){
      this.$router.push({
          name:"billPage"
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main-center {
  border: 1rem solid #76323F;
  border-radius: 1rem;
  background-color: #fff;
  .statistics{
    font-size: 14px;
  }
  .steps-main {
    padding: 3rem 20rem;
  }
  .step-content{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 13rem;
  }
}
</style>
<style lang="scss">
.step-content{
  .el-button--primary{
    background-color: #C09F80;
    border-color: #C09F80;
    color: #faf9f9;
    width: 14rem;
    height: 4rem;
    font-size: 20px;
  }
}
</style>