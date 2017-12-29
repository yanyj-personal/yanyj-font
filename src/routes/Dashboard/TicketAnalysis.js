import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Select, Tooltip, Carousel } from 'antd';
import moment from 'moment';
import createG2 from 'g2-react';
import { Stat } from 'g2';


import {
  ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,
} from '../../components/Charts';
import styles from './TicketAnalysis.less';

@connect(state => ({
  list: state.ticketAnalysis,
}))



export default class TicketAnalysis extends Component {


  componentDidMount() {
    this.props.dispatch({
      type: 'ticketAnalysis/getAnalysis',
      payload: {
        page: 1,
      },
    });
  }

  render() {




    console.log(this.props);
    const {list: { selectType, incomeStat, incomeTrendYear, incomeTrendMonth, incomeTrendDate }} = this.props;

    const LineChart = createG2(chart => {
      chart.col('x', {
        alias: '日期'
      });
      chart.col('y', {
        alias: '利润'
      });
      chart.line().position('x*y').size(2);
      let data = chart._attrs.data.data;
      if(data.length > 2 ) {
        chart.guide().line([data[0].x,0],[data[data.length - 1].x,0]);
      }

      // chart.guide().line({
      //   start:{
      //     x:'2017-12-11', y:-24.6
      //   }, // 使用数组格式
      //   end: {
      //     x:'2017-12-28', y:-24.6
      //   }
      // });
      chart.render();
    });


    return (
      <div>
        <Card title="本年收益统计" bordered={false}>

          <Row gutter={16}>
            <Col span={8}>
              <Card style={{textAlign:'center'}} title="本年收益额" bordered={false}>{`￥ ${incomeStat.year}`}</Card>
            </Col>
            <Col span={8}>
              <Card style={{textAlign:'center'}} title="本月收益额" bordered={false}>{`￥ ${incomeStat.month}`}</Card>
            </Col>
            <Col span={8}>
              <Card style={{textAlign:'center'}} title="本周收益额" bordered={false}>{`￥ ${incomeStat.week}`}</Card>
            </Col>
          </Row>
        </Card>

        {/*<Card title="收益趋势分析" width={1000} height={500}  bordered={true} style={{'marginTop': '10px'}}>*/}

            {/*<Carousel className={styles["ant-carousel"]}  height={500} autoplay dots={false}>*/}
              <div style={{'marginTop': '10px'}}>
                <ChartCard
                  title="近5年收益总额"
                  action={<Tooltip title="指标说明: 年：只统计近5年"><Icon type="info-circle-o" /></Tooltip>}
                  total={incomeTrendYear.amount}
                  footer={<Field label="年平均收益" value={incomeTrendYear.average} />}
                  contentHeight={46}
                >
                  <MiniBar
                    height={46}
                    width={1000}
                    data={incomeTrendYear.data}
                  />

                </ChartCard>
              </div>
              <div style={{'marginTop': '10px'}}>
                <ChartCard
                  title="本年收益总额 - 月趋势"
                  action={<Tooltip title="指标说明: 月：只统计当年"><Icon type="info-circle-o" /></Tooltip>}
                  total={incomeTrendMonth.amount}
                  footer={<Field label="月平均收益" value={incomeTrendMonth.average} />}
                  contentHeight={46}>
                  <MiniBar
                    height={46}
                    data={incomeTrendMonth.data}
                  />

                </ChartCard>
              </div>
              <div style={{'marginTop': '10px'}}>
                <ChartCard
                  title="本年收益总额 - 日趋势"
                  action={<Tooltip title="指标说明: 日：只统计当年"><Icon type="info-circle-o" /></Tooltip>}
                  total={incomeTrendDate.amount}
                  footer={<Field label="日平均收益" value={incomeTrendDate.average} />}
                  contentHeight={300}
                >
                  <LineChart
                    height={300}
                    width={1000}
                    forceFit={true}
                    data={incomeTrendDate.data}
                  />

                </ChartCard>
              </div>
        {/*//     </Carousel>*/}
        {/*// </Card>*/}
      </div>

    );
  };
}
