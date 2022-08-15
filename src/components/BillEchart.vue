<template>
  <div class="my-echart">
    <span class="chart-title" v-if="selectValue">{{ selectValue }}月账单</span>
    <span class="chart-title" v-else>全部账单</span>

    <div
      class="echart"
      id="mychart"
      :style="{ float: 'left', width: '100%', height: '400px' }"
    ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BillEchart",
  components: {},
  props: ["selectValue", "filterBillData"],
  data() {
    return {
      name: "张雪",
      xData: ["2020-02", "2020-03", "2020-04", "2020-05"], //横坐标数据
      yData: [30, 132, 80, 134], //纵坐标数据，与横坐标对应
      typeArr: [],
      incomeArr: [],
      expenditureArr: [],
    };
  },
  mounted() {
    this.initEcharts();
  },

  watch: {
    selectValue(newV) {
      return newV;
    },
    filterBillData: {
      handler(newV) {
        let data = newV;
        let arr = [];
        for (let i of data) {
          arr.push(i.name);
        }
        let nameArr = Array.from(new Set(arr));
        let filterArr = [];
        for (let val of nameArr) {
          let obj = new Object();
          let incomeSum = 0;
          let expenditureSum = 0;
          obj["name"] = val;
          obj["income"] = incomeSum;
          obj["expenditure"] = expenditureSum;
          let filterData = data.filter((item) => {
            return item.name == val;
          });

          for (let j of filterData) {
            if (j.type == "1") {
              obj["income"] = incomeSum += j.amount;
            } else {
              obj["expenditure"] = expenditureSum += j.amount;
            }
          }
          filterArr.push(obj);
        }
        this.handleData(filterArr);
      },
    immediate:true
    },
  },
  filters: {},
  methods: {
    initEcharts() {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          axisLabel: {
            color: "#fff",
          },
        },
        yAxis: {
          type: "category",
          data: this.typeArr,
          axisLabel: {
            color: "#fff",
          },
        },
        series: [
          {
            name: "收入",
            type: "bar",
            label: {
              show: true,
              position: "right",
              fontSize: 10,
            },
            color: "#C09F80",
            data: this.incomeArr,
          },
          {
            name: "支出",
            type: "bar",
            label: {
              show: true,
              position: "right",
              fontSize: 10,
            },
            color: "#D7CEC7",
            data: this.expenditureArr,
          },
        ],
      };
      const setEchartWH = {
        //设置控制图表大小变量
        width: 600,
        height: 400,
      };
      const myChart = echarts.init(
        document.getElementById("mychart"),
        null,
        setEchartWH
      ); // 图标初始化
      myChart.setOption(option); // 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    handleData(filterArr) {
      let typeArr = [];
      let incomeArr = [];
      let expenditureArr = [];
      for (let i of filterArr) {
        typeArr.push(i.name);
        incomeArr.push(i.income);
        expenditureArr.push(i.expenditure);
      }
      this.typeArr = typeArr;
      this.incomeArr = incomeArr;
      this.expenditureArr = expenditureArr

      //重新渲染echar
      this.initEcharts()

    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chart-title {
  color: #fff;
  padding-left: 2rem;
}
</style>

<style>
</style>
