import React from 'react';
import "./LeftDialog.less";
import { Tabs, Icon } from 'antd';

import echarts from 'echarts';
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


class LeftDialog extends React.Component {

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main-show'));

    const option = {
      title: {
        text: '折线图堆叠'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    // 绘制图表
    myChart.setOption(option, true);
      //myChart.setOption({ option });
      //title: { text: 'ECharts 入门示例' },
      //tooltip: {},
      //xAxis: {
      //  data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      //},
      //yAxis: {},
      //series: [{
      //  name: '销量',
      //  type: 'bar',
      //  data: [5, 20, 36, 10, 10, 20]
      //}]
    //});
  }

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
  imgpieClick() {
    const option = {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    var myChart = echarts.init(document.getElementById('main-show'));
    myChart.setOption(option, true);
  }

  render() {
    const { TabPane } = Tabs;

    //function callback(key) {
    //  console.log(key);
    //}


    return (
      <div className="big-style-test">
        <div className="index-right">
        </div>

        <div className="left-dialog-back">
          <div className="chart-type">
            <div className="chartstyle" >
              <img src={imgpie} onClick={this.imgpieClick} onMouseEnter={() => { this.onMouseEnter("饼状图") }} onMouseLeave={() => { this.onMouseLeave(" ") }} />
            </div>
            <div className="chartstyle">
              <img src={imgtable} onMouseEnter={() => { this.onMouseEnter("表格") }} onMouseLeave={() => { this.onMouseLeave(" ") }} />
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
            <div className="chartstyle" onMouseEnter={() => { this.onMouseEnter("柱状图") }} onMouseLeave={() => { this.onMouseLeave(" ") }}>
              <img src={imgZZ} />
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
            <Tabs defaultActiveKey="2">
              <TabPane tab={<span><Icon type="apple" />图形属性</span>} key="1">
                Tab 1
            </TabPane>
              <TabPane tab={<span> <Icon type="android" />组件样式</span>} key="2">
                Tab 2
            </TabPane>
            </Tabs>
          </div>
        </div>

        <div className="mid-style-div">
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
        </div>

      </div>
    )
  }
}


export default LeftDialog;
