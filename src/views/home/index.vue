<template>
  <div id="home">
    <div class="panelGroup">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <el-icon class="iconfont icon-zuji01"></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">Daily Pv</div>
              <count-to :start-val="0" :end-val="count.newVisits" :duration="2600" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <el-icon class="iconfont icon-zuji02"></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">Daily Ip</div>
              <count-to :start-val="0" :end-val="count.newIp" :duration="3000" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <el-icon class="iconfont icon-zuji01"></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">Weekly Pv</div>
              <count-to :start-val="0" :end-val="count.recentVisits" :duration="3200" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <el-icon class="iconfont icon-zuji02"></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">Weekly Ip</div>
              <count-to :start-val="0" :end-val="count.recentIp" :duration="3600" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="lineChart">
      <ve-line ref="lineChart" v-if="lineFlag" :data="lineData" :settings="lineSettings"></ve-line>
    </div>
    <div class="threeChart">
      <el-row v-if="threeFlag" :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="8">
          <div class="charts">
            <ve-pie ref="pieChart" :data="chartData" :settings="chartSettings"></ve-pie>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8">
          <div class="charts">
            <ve-funnel ref="funnelChart" :data="chartData2" :settings="chartSettings2"></ve-funnel>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8">
          <div class="charts">
            <ve-histogram ref="histogramChart" :data="chartData3" :settings="chartSettings3"></ve-histogram>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import VeLine from 'v-charts/lib/line.common'
  import VePie from 'v-charts/lib/pie.common'
  import VeHistogram from 'v-charts/lib/histogram.common'
  import VeFunnel from 'v-charts/lib/funnel.common'
  import {getVisitsApi, getLineApi} from "../../api/home";

  const elementResizeDetectorMaker = require("element-resize-detector");
  let erd = null;
  erd = elementResizeDetectorMaker();

  export default {
    data() {
      this.lineSettings = {
        area: true
      };
      this.chartSettings = {
        roseType: 'radius'
      };
      this.chartSettings2 = {
        sequence: ['订单', '点击', '访问', '展示']
      };
      this.chartSettings3 = {
        stack: {'用户': ['访问用户', '下单用户']}
      };
      return {
        count: {newIp: 0, newVisits: 0, recentIp: 0, recentVisits: 0},
        lineData: {
          columns: ['date', 'pv', 'ip'],
          rows: []
        },
        setTime: null,
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            {'日期': '1/1', '访问用户': 1393},
            {'日期': '1/2', '访问用户': 3530},
            {'日期': '1/3', '访问用户': 2923},
            {'日期': '1/4', '访问用户': 1723},
            {'日期': '1/5', '访问用户': 3792},
            {'日期': '1/6', '访问用户': 4593}
          ]
        },
        chartData2: {
          columns: ['状态', '数值'],
          rows: [
            {'状态': '展示', '数值': 900},
            {'状态': '访问', '数值': 600},
            {'状态': '点击', '数值': 300},
            {'状态': '订单', '数值': 100}
          ]
        },
        chartData3: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            {'日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32},
            {'日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26},
            {'日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76},
            {'日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49},
            {'日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323},
            {'日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78}
          ]
        },
        lineFlag: false,
        threeFlag: false
      }
    },
    components: {CountTo, VeLine, VePie, VeHistogram, VeFunnel},
    mounted() {
      getVisitsApi().then(result => {
        let data = result.data;
        for (let key in this.count) {
          this.count[key] = data[key]
        }
      });
      getLineApi().then(result => {
        let data = result.data;
        for (let index = 0; index < 7; index++) {
          let obj = {
            date: data.weekDays[index],
            ip: data.ipData[index],
            pv: data.visitsData[index]
          };
          this.lineData.rows.push(obj)
        }
        setTimeout(() => {
          this.lineFlag = true
        }, 250);
        setTimeout(() => {
          this.threeFlag = true
        }, 500);
        this.setTime = setTimeout(() => {
          this.addListen()
        }, 1000)
      })
    },
    methods: {
      addListen() {
        erd.listenTo(document.getElementById("home"), () => {
          this.$nextTick(() => {
            this.$refs['lineChart'].echarts.resize();
            this.$refs['pieChart'].echarts.resize();
            this.$refs['funnelChart'].echarts.resize();
            this.$refs['histogramChart'].echarts.resize()
          })
        })
      }
    },
    destroyed() {
      erd.uninstall(document.getElementById("home"));
      this.lineData.rows = []
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panelGroup {
    .iconfont {
      font-size: 48px;
    }
    .panel-group {
      margin-top: 18px;
      .card-panel-col {
        margin-bottom: 32px;
      }
      .card-panel {
        height: 108px;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .05);
        .icon-people {
          color: #40c9c6;
        }
        .icon-message {
          color: #36a3f7;
        }
        .icon-money {
          color: #f4516c;
        }
        .icon-shopping {
          color: #34bfa3
        }
        .card-panel-icon-wrapper {
          float: left;
          margin: 14px 0 0 14px;
          padding: 16px;
          transition: all 0.38s ease-out;
          border-radius: 6px;
        }
        .card-panel-icon {
          float: left;
          font-size: 48px;
        }
        .card-panel-description {
          float: right;
          font-weight: bold;
          margin: 26px 26px 26px 0;
          .card-panel-text {
            line-height: 18px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 16px;
            margin-bottom: 12px;
          }
          .card-panel-num {
            font-size: 20px;
          }
        }
      }
    }
  }

  .lineChart {
    background-color: white;
  }

  .threeChart {
    .charts {
      background-color: #fff;
      margin-top: 10px;
    }
  }
</style>
