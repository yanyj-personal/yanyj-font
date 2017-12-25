import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Modal, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
// import { NumbericInput } from '../../components/BasicComponents'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(state => ({
  list: state.TicketProfitListState,
}))
export default class TicketProfitList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'TicketProfitListState/fetch',
      payload: {
        count: 5,
      },
    });
  }

  handleWithDrawCancel() {
    this.props.dispatch({
      type: 'TicketProfitListState/changeWithDrawModal',
      payload: {
        visible: false,
      },
    });
  }

  handleWithDraOk(item) {
    this._submitId = item._id;
    this._submitItem = item;
    this.props.dispatch({
      type: 'TicketProfitListState/changeWithDrawModal',
      payload: {
        visible: true,
      },
    });
  }

  handleSubMitWithDraOk(item, id) {
    let input = ReactDom.findDOMNode(this.refs.withDrawNumberInput);
    let extractRecords = this._submitItem.extractRecords;
    extractRecords.push({
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      amount: parseFloat(input.value),
    });
    this.props.dispatch({
      type: 'TicketProfitListState/submitWithDraw',
      payload: {
        id: this._submitId,
        count: 5,
        extractRecords: extractRecords
      },
    });
  }

  onWithDrawNumberChange(value) {
    this.props.dispatch({
      type: 'TicketProfitListState/changeWithDraNumberA',
      payload: {
        value: value,
      },
    });
  }

  render() {
    const { list: { list, loading, withdrawVisible, withdrawLoading, withdrawNumber } } = this.props;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const ProgressMore = ({progress}) => {
      if(progress <= 100) {
        return (<Progress percent={progress} strokeWidth={6} />);
      } else {
        return (<p> {progress + '%'} </p>);
      }
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { time, principal, principalLoss, extractAmount, occupancy, _id } }) => (
      <div className={styles.listContent}>
        <div>
          <span>时间</span><p>{time}</p>
        </div>
        <div>
          <span>本金</span><p>￥{parseFloat(principal).toFixed(2)}</p>
        </div>
        <div>
          <span>本金是否损失</span><p>￥{principalLoss ? '否' : '是'}</p>
        </div>
        <div>
          <span>提现总额</span><p>￥{parseFloat(extractAmount).toFixed(2)}</p>
        </div>
        <div>
          <span>提现占本金比例</span>
          <ProgressMore progress={occupancy}/>
        </div>
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );


    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的待办" value="8个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均处理时间" value="32分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周完成任务数" value="24个任务" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="标准列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加
            </Button>
            <List
              size="large"
              rowKey="_id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[<a onClick={this.handleWithDraOk.bind(this, item)}>提现</a>, <MoreBtn />]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title="提现"
          visible={withdrawVisible}
          onOk={this.handleSubMitWithDraOk.bind(this)}
          confirmLoading={withdrawLoading}
          onCancel={this.handleWithDrawCancel.bind(this)}
        >
          <Input size="large" ref='withDrawNumberInput' placeholder="0.0" onChange={this.onWithDrawNumberChange.bind(this, this.value)}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
