import React, { useContext } from 'react';
import "./ToolCharts.less";
import { Tabs, Icon, Select } from 'antd';
import { axios } from "@/services/axios";
//import echarts from 'echarts';
//import echarts from 'echarts/lib/echarts';
//import 'echarts/lib/component/title';
//import 'echarts/lib/chart/line';

//import ReactEachrts from 'echarts-for-react';

import imgpie from './imgs/fsux_图表_饼图.png';
import imgtable from './imgs/fsux_图表_表格.png';
import imgK from './imgs/fsux_图表_K线图.png';
import imgF from './imgs/fsux_图表_南丁玫瑰图.png';
import imgDZ from './imgs/fsux_图表_堆积柱状图.png';
import imgZD from './imgs/fsux_图表_子弹图.png';
import imgXR from './imgs/fsux_图表_旭日图.png';
import imgTX from './imgs/fsux_图表_条形图.png';
import imgZZ from './imgs/fsux_图表_柱状图.png';
import imgSJ from './imgs/fsux_图表_桑基图.png';
import imgQP from './imgs/fsux_图表_气泡图.png';
import imgLD from './imgs/fsux_图表_漏斗图.png';
import imgPB from './imgs/fsux_图表_瀑布图.png';
import imgRL from './imgs/fsux_图表_热力图.png';
import imgHT from './imgs/fsux_图表_环图.png';
import imgBFBDJ from './imgs/fsux_图表_百分比堆积条形图.png';
import imgZF from './imgs/fsux_图表_直方图.png';
import imgSK from './imgs/fsux_图表_色块图.png';
import imgLDT from './imgs/fsux_图表_雷达图.png';
import imgMJ from './imgs/fsux_图表_面积图.png';
import imgZXT from './imgs/折线图.png';
import { json } from 'd3';

//import Legend from '@redash/viz/lib/visualizations/choropleth/Renderer/Legend';

//import { Tab } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';




class ToolCharts extends React.Component {

  //componentDidMount() {
  //  // 基于准备好的dom，初始化echarts实例
  //  var myChart = echarts.init(document.getElementById('main-show'));

  //  const option = {
  //    title: {
  //      text: '折线图堆叠'
  //    },
  //    tooltip: {
  //      trigger: 'axis'
  //    },
  //    legend: {
  //      data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
  //    },
  //    grid: {
  //      left: '3%',
  //      right: '4%',
  //      bottom: '3%',
  //      containLabel: true
  //    },
  //    toolbox: {
  //      feature: {
  //        saveAsImage: {}
  //      }
  //    },
  //    xAxis: {
  //      type: 'category',
  //      boundaryGap: false,
  //      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  //    },
  //    yAxis: {
  //      type: 'value'
  //    },
  //    series: [
  //      {
  //        name: '邮件营销',
  //        type: 'line',
  //        stack: '总量',
  //        data: [120, 132, 101, 134, 90, 230, 210]
  //      },
  //      {
  //        name: '联盟广告',
  //        type: 'line',
  //        stack: '总量',
  //        data: [220, 182, 191, 234, 290, 330, 310]
  //      },
  //      {
  //        name: '视频广告',
  //        type: 'line',
  //        stack: '总量',
  //        data: [150, 232, 201, 154, 190, 330, 410]
  //      },
  //      {
  //        name: '直接访问',
  //        type: 'line',
  //        stack: '总量',
  //        data: [320, 332, 301, 334, 390, 330, 320]
  //      },
  //      {
  //        name: '搜索引擎',
  //        type: 'line',
  //        stack: '总量',
  //        data: [820, 932, 901, 934, 1290, 1330, 1320]
  //      }
  //    ]
  //  };
  //  // 绘制图表
  //  myChart.setOption(option, true);
  //  //myChart.setOption({ option });
  //  //title: { text: 'ECharts 入门示例' },
  //  //tooltip: {},
  //  //xAxis: {
  //  //  data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
  //  //},
  //  //yAxis: {},
  //  //series: [{
  //  //  name: '销量',
  //  //  type: 'bar',
  //  //  data: [5, 20, 36, 10, 10, 20]
  //  //}]
  //  //});
  //}


  constructor(props) {

    super(props);

    //this.state = { hover: false, }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

  }
  onMouseEnter = (a) => {
    document.getElementsByClassName("imgTitleText")[0].innerHTML = a;
  }
  onMouseLeave = (b) => {
    document.getElementsByClassName("imgTitleText")[0].innerHTML = b;
  }
  //饼图
  //imgpieClick() {
  //  const option = {
  //    title: {
  //      text: '某站点用户访问来源',
  //      subtext: '纯属虚构',
  //      left: 'center'
  //    },
  //    tooltip: {
  //      trigger: 'item',
  //      formatter: '{a} <br/>{b} : {c} ({d}%)'
  //    },
  //    legend: {
  //      orient: 'vertical',
  //      left: 'left',
  //      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  //    },
  //    series: [
  //      {
  //        name: '访问来源',
  //        type: 'pie',
  //        radius: '55%',
  //        center: ['50%', '60%'],
  //        data: [
  //          { value: 335, name: '直接访问' },
  //          { value: 310, name: '邮件营销' },
  //          { value: 234, name: '联盟广告' },
  //          { value: 135, name: '视频广告' },
  //          { value: 1548, name: '搜索引擎' }
  //        ],
  //        emphasis: {
  //          itemStyle: {
  //            shadowBlur: 10,
  //            shadowOffsetX: 0,
  //            shadowColor: 'rgba(0, 0, 0, 0.5)'
  //          }
  //        }
  //      }
  //    ]
  //  };
  //  var myChart = echarts.init(document.getElementById('main-show'));
  //  myChart.setOption(option, true);
  //}

  /* 折线图 */
  imgZXTClick = () => {
    var visId = localStorage.getItem("visId");
    var widId = localStorage.getItem("widId");
    if (visId != undefined && widId != undefined) {
      var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
      sql += " where t1.id = " + visId + " and t2.id = " + widId;
      axios.get('/api/select?sql=' + sql).then(function (response) {
        console.log(response.data);
        switch (response.data[0]["t1.type"]) {
          case "CHART":
            console.log(response.data[0]["t1.options as VisualizationsJson"]);
            console.log(response.data[0]["t2.options as WidgetJson"]);
            var Visualizations = response.data[0]["t1.options as VisualizationsJson"];

            var VisualizationsJson = JSON.parse(Visualizations);
            console.log(VisualizationsJson);
            console.log(VisualizationsJson.globalSeriesType);

            //var legendJson = '{"enabled":true, "placement":"auto"}';
            //var globalSeriesTypeJson = "globalSeriesType":"line";
            VisualizationsJson.globalSeriesType = "line";
            //VisualizationsJson.globalSeriesType = JSON.parse(globalSeriesTypeJson);

            //console.log(VisualizationsJson.legend);
            //console.log(VisualizationsJson);

            var seriesOptionsJson = '{"count":{"yAxis": 0,"type": "line","color": "#A55F2A","name": "count"}}';
            VisualizationsJson.seriesOptions = JSON.parse(seriesOptionsJson);

            var VisualizationsJsonResult = JSON.stringify(VisualizationsJson);

            var VisUpdateResult = VisualizationsJsonResult.replace(/#/g, '%23');

            console.log(VisUpdateResult);
            var sqlup = "update public.visualizations set options='" + VisUpdateResult + "' where id=" + visId;
            console.log('sqlup', sqlup);
            axios.get('/api/update?sql=' + sqlup).then(function (res) {
              console.log(res);
            });
            break;
          case "TABLE":
            console.log(response.data[0]["t1.type"]);
            break;
          case "FUNNEL":
            console.log(response.data[0]["t1.type"]);
            break;
          case "MAP":
            console.log(response.data[0]["t1.type"]);
            break;
          default:
            break;
        }
      }).catch(function (error) {
        console.log(error);
      });
      this.props.ParentsOnload(visId, widId);
    } else {
      alert("未找到要修改的图表！");
    }
  }
  /* 柱状图 */
  imgZZClick() {
    var visId = localStorage.getItem("visId");
    var widId = localStorage.getItem("widId");
    if (visId != undefined && widId != undefined) {
      var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
      sql += " where t1.id = " + visId + " and t2.id = " + widId;
      axios.get('/api/select?sql=' + sql).then(function (response) {
        console.log(response.data);
        switch (response.data[0]["t1.type"]) {
          case "CHART":
            console.log(response.data[0]["t1.options as VisualizationsJson"]);
            console.log(response.data[0]["t2.options as WidgetJson"]);
            var Visualizations = response.data[0]["t1.options as VisualizationsJson"];

            var VisualizationsJson = JSON.parse(Visualizations);
            console.log(VisualizationsJson);
            console.log(VisualizationsJson.globalSeriesType);

            //var legendJson = '{"enabled":true, "placement":"auto"}';
            //var globalSeriesTypeJson = "globalSeriesType":"line";
            VisualizationsJson.globalSeriesType = "column";
            //VisualizationsJson.globalSeriesType = JSON.parse(globalSeriesTypeJson);

            //console.log(VisualizationsJson.legend);
            //console.log(VisualizationsJson);

            var seriesOptionsJson = '{"count":{"yAxis": 0,"type": "column","color": "#A55F2A","name": "count"}}';
            VisualizationsJson.seriesOptions = JSON.parse(seriesOptionsJson);

            var VisualizationsJsonResult = JSON.stringify(VisualizationsJson);

            var VisUpdateResult = VisualizationsJsonResult.replace(/#/g, '%23');

            console.log(VisUpdateResult);
            var sqlup = "update public.visualizations set options='" + VisUpdateResult + "' where id=" + visId;
            console.log('sqlup', sqlup);
            axios.get('/api/update?sql=' + sqlup).then(function (res) {
              console.log(res);
            });
            break;
          case "TABLE":
            console.log(response.data[0]["t1.type"]);
            break;
          case "FUNNEL":
            console.log(response.data[0]["t1.type"]);
            break;
          case "MAP":
            console.log(response.data[0]["t1.type"]);
            break;
          default:
            break;
        }
      }).catch(function (error) {
        console.log(error);
      });
    } else {
      alert("未找到要修改的图表！");
    }
  }
  /* 饼状图 */
  imgpieClick() {
    var visId = localStorage.getItem("visId");
    var widId = localStorage.getItem("widId");
    if (visId != undefined && widId != undefined) {
      var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
      sql += " where t1.id = " + visId + " and t2.id = " + widId;
      axios.get('/api/select?sql=' + sql).then(function (response) {
        console.log(response.data);
        switch (response.data[0]["t1.type"]) {
          case "CHART":
            console.log(response.data[0]["t1.options as VisualizationsJson"]);
            console.log(response.data[0]["t2.options as WidgetJson"]);
            var Visualizations = response.data[0]["t1.options as VisualizationsJson"];

            var VisualizationsJson = JSON.parse(Visualizations);
            console.log(VisualizationsJson);
            console.log(VisualizationsJson.globalSeriesType);

            //var legendJson = '{"enabled":true, "placement":"auto"}';
            //var globalSeriesTypeJson = "globalSeriesType":"line";
            VisualizationsJson.globalSeriesType = "pie";
            //VisualizationsJson.globalSeriesType = JSON.parse(globalSeriesTypeJson);

            //console.log(VisualizationsJson.legend);
            //console.log(VisualizationsJson);

            var seriesOptionsJson = '{"count":{"yAxis": 0,"type": "pie","color": "#A55F2A","name": "count"}}';
            VisualizationsJson.seriesOptions = JSON.parse(seriesOptionsJson);

            var VisualizationsJsonResult = JSON.stringify(VisualizationsJson);

            var VisUpdateResult = VisualizationsJsonResult.replace(/#/g, '%23');

            console.log(VisUpdateResult);
            var sqlup = "update public.visualizations set options='" + VisUpdateResult + "' where id=" + visId;
            console.log('sqlup', sqlup);
            axios.get('/api/update?sql=' + sqlup).then(function (res) {
              console.log(res);
            });
            break;
          case "TABLE":
            console.log(response.data[0]["t1.type"]);
            break;
          case "FUNNEL":
            console.log(response.data[0]["t1.type"]);
            break;
          case "MAP":
            console.log(response.data[0]["t1.type"]);
            break;
          default:
            break;
        }
      }).catch(function (error) {
        console.log(error);
      });
    } else {
      alert("未找到要修改的图表！");
    }
  }
  render() {
    const { TabPane } = Tabs;

    //function callback(key) {
    //  console.log(key);
    //}
    function LegendPosition(value) {
      switch (value) {
        case "hidden":
          console.log("隐藏");
          var visId = localStorage.getItem("visId");
          var widId = localStorage.getItem("widId");
          if (visId != undefined && widId != undefined) {

            var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
            sql += " where t1.id = " + visId + " and t2.id = " + widId;
            axios.get('/api/select?sql=' + sql).then(function (response) {
              console.log(response.data);
              switch (response.data[0]["t1.type"]) {
                case "CHART":
                  console.log(response.data[0]["t1.options as VisualizationsJson"]);
                  console.log(response.data[0]["t2.options as WidgetJson"]);
                  var Visualizations = response.data[0]["t1.options as VisualizationsJson"];

                  var VisualizationsJson = JSON.parse(Visualizations);
                  console.log(VisualizationsJson);
                  console.log(VisualizationsJson.legend);

                  //var legendJson = '{"enabled":true, "placement":"auto"}';
                  var legendJson = '{"enabled":false, "placement":"auto"}';

                  VisualizationsJson.legend = JSON.parse(legendJson);

                  //console.log(VisualizationsJson.legend);
                  //console.log(VisualizationsJson);
                  var VisualizationsJsonResult = JSON.stringify(VisualizationsJson);

                  var VisUpdateResult = VisualizationsJsonResult.replace(/#/g, '%23');

                  console.log(VisUpdateResult);
                  var sqlup = "update public.visualizations set options='" + VisUpdateResult + "' where id=" + visId;
                  console.log('sqlup', sqlup);
                  axios.get('/api/update?sql=' + sqlup).then(function (res) {
                    console.log(res);
                  });
                  break;
                case "TABLE":
                  console.log(response.data[0]["t1.type"]);
                  break;
                case "FUNNEL":
                  console.log(response.data[0]["t1.type"]);
                  break;
                case "MAP":
                  console.log(response.data[0]["t1.type"]);
                  break;
                default:
                  break;
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
          break;
        case "auto":
          console.log("自动");
          var visId = localStorage.getItem("visId");
          var widId = localStorage.getItem("widId");
          if (visId != undefined && widId != undefined) {

            var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
            sql += " where t1.id = " + visId + " and t2.id = " + widId;
            axios.get('/api/select?sql=' + sql).then(function (response) {
              console.log(response.data);
              switch (response.data[0]["t1.type"]) {
                case "CHART":
                  console.log(response.data[0]["t1.options as VisualizationsJson"]);
                  console.log(response.data[0]["t2.options as WidgetJson"]);
                  var Visualizations = response.data[0]["t1.options as VisualizationsJson"];

                  var VisualizationsJson = JSON.parse(Visualizations);
                  console.log(VisualizationsJson);
                  console.log(VisualizationsJson.legend);

                  var legendJson = '{"enabled":true, "placement":"auto"}';


                  VisualizationsJson.legend = JSON.parse(legendJson);

                  var VisualizationsJsonResult = JSON.stringify(VisualizationsJson);

                  var VisUpdateResult = VisualizationsJsonResult.replace(/#/g, '%23');

                  console.log(VisUpdateResult);
                  var sqlup = "update public.visualizations set options='" + VisUpdateResult + "' where id=" + visId;
                  console.log('sqlup', sqlup);
                  axios.get('/api/update?sql=' + sqlup).then(function (res) {
                    console.log(res);
                  });
                  break;
                case "TABLE":
                  console.log(response.data[0]["t1.type"]);
                  break;
                case "FUNNEL":
                  console.log(response.data[0]["t1.type"]);
                  break;
                case "MAP":
                  console.log(response.data[0]["t1.type"]);
                  break;
                default:
                  break;
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
          break;
        case "below":
          console.log("底部");
          var visId = localStorage.getItem("visId");
          var widId = localStorage.getItem("widId");
          if (visId != undefined && widId != undefined) {

            var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
            sql += " where t1.id = " + visId + " and t2.id = " + widId;
            axios.get('/api/select?sql=' + sql).then(function (response) {
              console.log(response.data);
              switch (response.data[0]["t1.type"]) {
                case "CHART":
                  console.log(response.data[0]["t1.options as VisualizationsJson"]);
                  console.log(response.data[0]["t2.options as WidgetJson"]);
                  var Visualizations = response.data[0]["t1.options as VisualizationsJson"];

                  var VisualizationsJson = JSON.parse(Visualizations);
                  console.log(VisualizationsJson);
                  console.log(VisualizationsJson.legend);

                  var legendJson = '{"enabled":true, "placement":"below"}';


                  VisualizationsJson.legend = JSON.parse(legendJson);

                  var VisualizationsJsonResult = JSON.stringify(VisualizationsJson);

                  var VisUpdateResult = VisualizationsJsonResult.replace(/#/g, '%23');

                  console.log(VisUpdateResult);
                  var sqlup = "update public.visualizations set options='" + VisUpdateResult + "' where id=" + visId;
                  console.log('sqlup', sqlup);
                  axios.get('/api/update?sql=' + sqlup).then(function (res) {
                    console.log(res);
                  });
                  break;
                case "TABLE":
                  console.log(response.data[0]["t1.type"]);
                  break;
                case "FUNNEL":
                  console.log(response.data[0]["t1.type"]);
                  break;
                case "MAP":
                  console.log(response.data[0]["t1.type"]);
                  break;
                default:
                  break;
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
          break;
        default:
          break;
      }
    }


    return (

      <div className="big-style">
        <div className="left-dialog-back">
          <div className="chart-type">
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("折线图") }} onMouseLeave={() => { this.onMouseLeave(" ") }} >
              <img src={imgZXT} onClick={this.imgZXTClick} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("柱状图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgZZ} onClick={this.imgZZClick} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("饼状图") }} onMouseLeave={() => { this.onMouseLeave(" ") }} >
              <img src={imgpie} onClick={this.imgpieClick} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("表格") }} onMouseLeave={() => { this.onMouseLeave(" ") }} >
              <img src={imgtable} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("K线图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgK} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("南丁玫瑰图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgF} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("堆积柱状图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgDZ} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("子弹图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgZD} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("旭日图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgXR} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("条形图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgTX} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("桑基图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgSJ} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("气泡图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgQP} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("漏斗图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgLD} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("瀑布图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgPB} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("热力图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgRL} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("环图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgHT} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("百分比堆积条形图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgBFBDJ} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("直方图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgZF} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("色块图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgSK} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("雷达图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgLDT} />
            </div>
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("面积图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgMJ} />
            </div>
          </div>
          <div className="imgTitleText"></div>
          <div>
            {/*<ul id="myTab" class="nav nav-tabs">
              <li class="active">
                <a href="#home" data-toggle="tab">
                  菜鸟教程
		            </a>
              </li>
              <li><a href="#ios" data-toggle="tab">iOS</a></li>
              <li class="dropdown">
                <a href="#" id="myTabDrop1" class="dropdown-toggle"
                  data-toggle="dropdown">Java
			          <b class="caret"></b>
                </a>
                <ul class="dropdown-menu" role="menu" aria-labelledby="myTabDrop1">
                  <li><a href="#jmeter" tabindex="-1" data-toggle="tab">jmeter</a></li>
                  <li><a href="#ejb" tabindex="-1" data-toggle="tab">ejb</a></li>
                </ul>
              </li>
            </ul>
            <div id="myTabContent" class="tab-content">
              <div class="tab-pane fade in active" id="home">
                <p>菜鸟教程是一个提供最新的web技术站点，本站免费提供了建站相关的技术文档，帮助广大web技术爱好者快速入门并建立自己的网站。菜鸟先飞早入行——学的不仅是技术，更是梦想。</p>
              </div>
              <div class="tab-pane fade" id="ios">
                <p>iOS 是一个由苹果公司开发和发布的手机操作系统。最初是于 2007 年首次发布 iPhone、iPod Touch 和 Apple
            TV。iOS 派生自 OS X，它们共享 Darwin 基础。OS X 操作系统是用在苹果电脑上，iOS 是苹果的移动版本。</p>
              </div>
              <div class="tab-pane fade" id="jmeter">
                <p>jMeter 是一款开源的测试软件。它是 100% 纯 Java 应用程序，用于负载和性能测试。</p>
              </div>
              <div class="tab-pane fade" id="ejb">
                <p>Enterprise Java Beans（EJB）是一个创建高度可扩展性和强大企业级应用程序的开发架构，部署在兼容应用程序服务器（比如 JBOSS、Web Logic 等）的 J2EE 上。
              </p>
              </div>
            </div>*/}
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon type="apple" />图形属性</span>} key="1">
                <div>
                  <table className="tb-po">
                    <tr>
                      <td className="lf-td">图例位置</td>
                      <td className="rt-td">
                        <Select label="图例位置" onChange={LegendPosition} className="sel-left">
                          <option value="hidden">隐藏</option>
                          <option value="auto">右侧</option>
                          <option value="below">底部</option>
                        </Select>
                      </td>
                    </tr>
                    <tr>
                      <td className="lf-td">图例位置</td>
                      <td className="rt-td">
                        <Select label="图例位置" onChange={LegendPosition} className="sel-left">
                          <option value="hidden">隐藏</option>
                          <option value="auto">右侧</option>
                          <option value="below">底部</option>
                        </Select>
                      </td>
                    </tr>
                    <tr>
                      <td className="lf-td">图例位置</td>
                      <td className="rt-td">
                        <Select label="图例位置" onChange={LegendPosition} className="sel-left">
                          <option value="hidden">隐藏</option>
                          <option value="auto">右侧</option>
                          <option value="below">底部</option>
                        </Select>
                      </td>
                    </tr>
                  </table>

                </div>
              </TabPane>
              <TabPane tab={<span> <Icon type="android" />组件样式</span>} key="2">
                Tab 2
            </TabPane>
            </Tabs>
          </div>
        </div>

        {/*<div className="mid-style-div">
          <div className="mid-top-conds">
            <div className="x_style">
              <div className="x-left-style">横轴</div>
              <div className="x-right-style"></div>
            </div>
            <div className="y_style">
              <div className="x-left-style">纵轴</div>
              <div className="x-right-style"></div>
            </div>
          </div>
          <div className="charts-show-div" id="main-show"></div>
        </div>*/}

      </div>
    )
  }
}


export default ToolCharts;
