<template>
  <el-container>
    <el-main>
      <div class="main-top"></div>
      <div class="main-center">
        <div class="table-content">
          <div class="table-option">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
              :on-change="handleChange"
              accept=".csv"
            >
              <el-button slot="trigger" size="small" type="primary"
                >上传csv</el-button
              >
            </el-upload>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="annexList"
              :on-change="handleAnnexChange"
              accept=".csv"
            >
              <el-button slot="trigger" size="small" type="primary"
                >添加csv</el-button
              >
            </el-upload>

            <el-select v-model="selectValue" placeholder="请选择月份">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-button type="primary" @click="dialogFormVisible = true">添加账单</el-button>

            <el-dialog title="添加账单" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="账单分类" :label-width="formLabelWidth">
                  <el-select v-model="form.type" placeholder="账单分类">
                    <el-option label = "收入" value = 1></el-option>
                    <el-option label = "支出" value = 0></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="账单时间" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="form.value3"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="12:00:00">
                  </el-date-picker>
                </el-form-item>

                <el-form-item label="账单类型" :label-width="formLabelWidth">
                  <el-select v-model="form.region" placeholder="账单类型">
                    <el-option label="一" value="5il79e11628"></el-option>
                    <el-option label="二" value="5il79e11628"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="账单金额" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
              </div>
            </el-dialog>
          </div>

          <el-table :data="filterTableData" style="width: 100%" height="400">
             <el-table-column
              prop="type"
              :label="labelData[0]"
            >
            <template slot-scope="scope">
              <span >{{ scope.row.type|typeLoader }}</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="time"
            column-key="time"
            :filters="[{text: '7', value: '2019-07-01 00:00:00'}]"
            :filter-method="filterHandler"
              :label="labelData[1]"
            >
            <template slot-scope="scope">
       
        <span >{{ scope.row.time|timeLoader }}</span>
      </template>
            </el-table-column>
            <el-table-column
              prop="category"
              :label="labelData[2]"
            >
            <template slot-scope="scope">
       
        <span >{{ scope.row.category|categoryLoader(that) }}</span>
      </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              :label="labelData[3]"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Papa from "papaparse";
export default {
  name: "HelloWorld",
  components: {},

  data() {
    return {
      that: this,
      fileList: [],
      annexList: [],
      titleData: [],
      labelData: ["账单类型", "账单时间", "账单分类", "账单金额"],
      tableData: [],
      filterTableData: [],
      selectOptions: [],
      selectValue: '',
      dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          value3: ''
        },
        formLabelWidth: '120px'
    };
  },
  created() {
    //从session中获取初始值
    let csvResults = sessionStorage.getItem("csvResults");
    let annexResults = sessionStorage.getItem("annexResults");


    if (csvResults) {
      let file = JSON.parse(csvResults);
      this.handleFile(file);
    }

    if(annexResults){
      let file = JSON.parse(annexResults);
      this.handleAnnexFile(file);
    }
  },
  watch:{
    selectValue(val){
      console.log("xuanze："+val)
      this.filterTableData = this.tableData.filter(item => {
        return item.month == val;
      })
    }
  },
  filters: {
    typeLoader(type){
      return (type == 1) ? "收入" : "支出";
    },

    timeLoader(time){
      //转换时间戳
      let timeStamp = new Date(parseInt(time));
      let Y = timeStamp.getFullYear();
      let M = timeStamp.getMonth() + 1;
      M = M < 10 ? ('0' + M ): M;
      let d = timeStamp.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = timeStamp.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = timeStamp.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = timeStamp.getSeconds();
      s = h < 10 ? ('0' + s) : s;
      return Y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
    },

    categoryLoader(category,that){
      if(that.annexList){
       return that.annexList[category]
      }else{
        return category
      }
    }
  },
  methods: {
    filterData(data){
      let obj = [];
      this.tableData.filter(item => {
        obj.push({
          text: item[data.month],
          value: item[data.month]
        })
      })
      return obj;
    },
 
    //转换时间戳
    changeTimeStamp(time){
      let timeStamp = new Date(parseInt(time));
      let Y = timeStamp.getFullYear();
      let M = timeStamp.getMonth() + 1;
      M = M < 10 ? ('0' + M ): M;
      let d = timeStamp.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = timeStamp.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = timeStamp.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = timeStamp.getSeconds();
      s = h < 10 ? ('0' + s) : s;
      // console.log(Y);
      return Y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("date");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },

    handleChange(file) {
      //判断上传是否为csv文件
      let _this = this;
      const isCSV = file.raw.type === "text/csv";

      if (!isCSV) {
        this.$message.error("只能上次csv文件!");
      } else {
        Papa.parse(file.raw, {
          complete: function (results) {
            //存储已上传的csv文件
            sessionStorage.setItem("csvResults", JSON.stringify(results));
            //处理csv文件
            _this.handleFile(results);
          },
        });
      }
    },

    //附件
    handleAnnexChange(file){
      //判断上传是否为csv文件
      let _this = this;
      const isCSV = file.raw.type === "text/csv";

      if (!isCSV) {
        this.$message.error("只能上次csv文件!");
      } else {
        Papa.parse(file.raw, {
          complete: function (results) {
            //存储已上传的csv文件
            sessionStorage.setItem("annexResults", JSON.stringify(results));
            //处理csv文件
            _this.handleAnnexFile(results);
          },
        });
      }
    },

    //处理csv文件
    handleFile(results) {
      let _this = this;
      let data = [];
      let titleData = results.data[0];
      for (let i = 1; i < results.data.length; i++) {
        let obj = new Object();

        for (let j = 0; j < results.data[i].length; j++) {
          if(titleData[j] == "time"){ 
            obj[titleData[j]] = results.data[i][j];
            //添加月份字段
            let timeStamp = new Date(parseInt(results.data[i][j]));
            let M = timeStamp.getMonth() + 1;
            obj["month"] = M;
          }else{
            obj[titleData[j]] = results.data[i][j];
          }   
        }
        data.push(obj);
        
      }
      _this.titleData = titleData;
      _this.tableData = data;
      _this.filterTableData = data;
      
      //选择下拉框
      this.setSelectOptions(data)
    },

    //处理附件
    handleAnnexFile(results){
      let obj = new Object();
       for (let i = 1; i < results.data.length; i++) {
        let label = results.data[i][0];
        let value = results.data[i][2];
        obj[label] = value;
       }
       this.annexList = obj;
    },

    //处理下拉框内容
    setSelectOptions(data){
      let arr = [];
      for(let i of data){
        arr.push(i.month)
      }
      arr = Array.from(new Set(arr));
      
      let selectOption = [];
      for(let j of arr){
        let obj = new Object();
        obj["value"] = j;
        obj["label"] = j + "月";
        selectOption.push(obj)
      }

      this.selectOptions = selectOption;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main-center {
  margin: 3rem;
  border: 1rem solid #5e9960;
  border-radius: 1rem;
  .table-content {
    .table-option {
      display: flex;
      width: 24rem;
      justify-content: space-between;
      padding: 1rem;
    }
    .el-form-item {
      width: 50%;
    }
  }
  .table-title {
    height: 2rem;
    background-color: #5e9960;
  }
}
</style>

<style>
</style>
