<template>
  <el-container>
    <el-header class="header-title" type="flex"  justify="center" height="5rem">My Bill</el-header>
    <el-main class="bill-main">
      <div class="main-top"></div>
      <div class="main-center">
        <div class="table-content">
          <div class="table-option">
            <el-select v-model="selectValue" placeholder="请选择月份">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-button class="add-button" @click="dialogFormVisible = true"
              >添加账单</el-button
            >

            <el-dialog title="添加账单" class="bill-dialog" :visible.sync="dialogFormVisible">
              <el-form :model="addform" ref="addform" :rules="rules">
                <el-form-item
                  label="账单分类"
                  :label-width="formLabelWidth"
                  prop="type"
                >
                  <el-select v-model="addform.type" placeholder="账单分类">
                    <el-option label="收入" value="1"></el-option>
                    <el-option label="支出" value="0"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="账单时间"
                  :label-width="formLabelWidth"
                  prop="time"
                >
                  <el-date-picker
                    v-model="addform.time"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="12:00:00"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-form-item
                  label="账单类型"
                  :label-width="formLabelWidth"
                  prop="category"
                >
                  <el-select v-model="addform.category" placeholder="账单类型">
                    <el-option
                      v-for="item in categoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="账单金额"
                  :label-width="formLabelWidth"
                  prop="amount"
                >
                  <el-input
                    v-model="addform.amount"
                    autocomplete="off"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    maxLength="6"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addBill('addform')"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
          </div>
          <el-row type="flex" class="statistics" justify="end">
            <el-col :span="3"
              ><span>总收入：{{ incomeTotal }}</span></el-col
            >
            <el-col :span="3"
              ><span>总支出：{{ expenditureTotal }}</span></el-col
            >
          </el-row>

          <el-table :data="filterBillData" style="width: 100%" height="400">
            <el-table-column prop="type" :label="labelData[0]">
              <template slot-scope="scope">
                <span>{{ scope.row.type | typeLoader }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              column-key="time"
              :label="labelData[1]"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.time | timeLoader }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="labelData[2]">
              <template slot-scope="scope">
                <span>{{
                  scope.row.name ? scope.row.name : scope.row.category
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" :label="labelData[3]">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "BillPage",
  components: {},

  data() {
    return {
      // attachmentsLists:{},
      billResults: [], //账单数据
      attachResults: [], //附件数据
      categoryLists: {}, //账单分类对应展示名称列表
      billData: [], //账单整合数据
      filterBillData: [], //过滤账单数据
      selectValue: "", //选择月份
      incomeTotal: 0, //收入
      expenditureTotal: 0, //支出
      labelData: ["账单类型", "账单时间", "账单分类", "账单金额"], //自定义表头名


      annexList: [],
      titleData: [],
      tableData: [],
      filterTableData: [],
      selectOptions: [],
      categoryOptions: [],
      
      dialogFormVisible: false,
      addform: {
        time: "",
        type: "",
        category: "",
        amount: 0,
      },
      formLabelWidth: "120px",
      rules: {
        type: [
          { required: true, message: "请选择账单类型", trigger: "change" },
        ],
        time: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        category: [
          { required: true, message: "请选择账单分类", trigger: "change" },
        ],
        amount: [{ required: true, message: "请输入金额", trigger: "blur" }],
      },
      
    };
  },
  created() {
    //初始获取上传结果
    let billResults = JSON.parse(sessionStorage.getItem("billResults"));
    if (billResults) {
      this.billResults = billResults;
    }
    let attachResults = JSON.parse(sessionStorage.getItem("attachResults"));
    if (attachResults) {
      this.attachResults = attachResults;
    }

    //账单分类对应展示名称列表
    this.setCategoryLists(attachResults);

    //整合表格数据
    this.handleBill(billResults);
  },

  watch: {
    //过滤数据
    selectValue(val) {
      this.filterBillData = this.billData.filter((item) => {
        return item.month == val;
      });
    },
    filterBillData() {
        let incomeTotal = 0; //收入
        let expenditureTotal = 0; //支出
        for(let i of this.filterBillData){
          if(i.type == 1){
            incomeTotal = incomeTotal + Number(i.amount);
          }else{
            expenditureTotal = expenditureTotal + Number(i.amount);
          }
        }
      
      this.incomeTotal = incomeTotal;
      this.expenditureTotal = expenditureTotal;
    }
  },
  filters: {
    typeLoader(type) {
      return type == 1 ? "收入" : "支出";
    },

    timeLoader(time) {
      //转换时间戳
      let timeStamp = new Date(parseInt(time));
      let Y = timeStamp.getFullYear();
      let M = timeStamp.getMonth() + 1;
      M = M < 10 ? "0" + M : M;
      let d = timeStamp.getDate();
      d = d < 10 ? "0" + d : d;
      let h = timeStamp.getHours();
      h = h < 10 ? "0" + h : h;
      let m = timeStamp.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = timeStamp.getSeconds();
      s = s < 10 ? "0" + s : s;
      return Y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
  methods: {
    //账单分类对应展示名称列表
    setCategoryLists(results) {
      let obj = new Object();
      for (let i = 1; i < results.length; i++) {
        let label = results[i][0];
        let value = results[i][2];
        obj[label] = value;
      }
      this.categoryLists = obj;
      //处理账单分类下拉框
      this.setCategoryOptions(obj)
    },
    //整合账单数据
    handleBill(results) {
      // let _this = this;
      let data = [];
      let titleData = results[0];
      for (let i = 1; i < results.length; i++) {
        let obj = new Object();

        for (let j = 0; j < results[i].length; j++) {
          if (titleData[j] == "time") {
            obj[titleData[j]] = results[i][j];
            //添加月份字段
            let timeStamp = new Date(parseInt(results[i][j]));
            let M = timeStamp.getMonth() + 1;
            obj["month"] = M;
          } else if (titleData[j] == "category") {
            obj[titleData[j]] = results[i][j];
            //添加账单分类名称
            let label = results[i][j];
            obj["name"] = this.categoryLists[label];
          } else {
            obj[titleData[j]] = results[i][j];
          }
        }
        data.push(obj);

        //选择下拉框数据
        this.setSelectOptions(data)
      }

      this.billData = data;
      this.filterBillData = data;
    },

    //处理下拉框内容
    setSelectOptions(data) {
      let arr = [];
      for (let i of data) {
        arr.push(i.month);
      }
      arr = Array.from(new Set(arr));

      let selectOption = [];
      for (let j of arr) {
        let obj = new Object();
        obj["value"] = j;
        obj["label"] = j + "月";
        selectOption.push(obj);
      }

      this.selectOptions = selectOption;
    },

    //处理账单分类下拉框
    setCategoryOptions(categoryObj) {

      let categoryOption = [];
      for(let i in categoryObj){
        let obj = new Object();
        
        obj["value"] = i;
        obj["label"] = categoryObj[i];
        categoryOption.push(obj);
      }
 
      this.categoryOptions = categoryOption;
    },

    //添加账单
    addBill(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            let timestamp = new Date(this.addform.time).getTime();
            this.addform.time = timestamp;

            //深拷贝
            let obj = {
              time: new Date(this.addform.time).getTime(),
              type: this.addform.type,
              category: this.addform.category,
              amount: this.addform.amount,
              month: new Date(this.addform.time).getMonth(),
              name: this.categoryLists[this.addform.category]
            };

            this.billData.push(obj);

            //更新session
            let arr = [
              this.addform.type, 
              new Date(this.addform.time).getTime(), 
              this.addform.category,
              this.addform.amount
            ]
            let newbillResults = this.billResults;
            newbillResults.push(arr);
            sessionStorage.setItem("billResults", JSON.stringify(newbillResults));

            this.$message({
              message: '已添加一条账单',
              type: 'success'
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        }) 
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main-center {
  border: 1rem solid #76323F;
  border-radius: 1rem;
  background-color: #76323F;
  .statistics {
    font-size: 14px;
    color: #fff;
    padding-bottom: 10px;
  }
  .table-content {
    .table-option {
      display: flex;
      width: 18rem;
      justify-content: space-between;
      padding: 1rem;
      .add-button{
        background-color: #C09F80;
        border-color: #C09F80;
        color: #fbecec;
      }
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

<style lang="scss">
  .bill-dialog{
    .el-dialog__header{
        background-color: #76323F;
        .el-dialog__title{
          color:#fff;
        }
    }
    .el-dialog__footer{
      .el-button--primary{
        background-color: #C09F80;
        border-color: #C09F80;
        color: #faf9f9;
      }
    }
  } 
</style>
