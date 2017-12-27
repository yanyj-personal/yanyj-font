import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Modal, Button, Icon, Dropdown, Menu, Avatar, TimePicker, Popconfirm, message, Tag  } from 'antd';
// import { NumbericInput } from '../../components/BasicComponents'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';
import ProfitFrom from '../Forms/ProfitForm';
import {
  Form, DatePicker, Select, InputNumber, Tooltip,
} from 'antd';

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
        page: 1,
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

  submitNewProfit() {
    let dateInputValue = ReactDom.findDOMNode(this.refs.dateInput).getElementsByTagName('input')[0].value;
    let timeInputValue = ReactDom.findDOMNode(this.refs.timeInput).getElementsByTagName('input')[0].value;
    let time = `${dateInputValue} ${timeInputValue}`;
    let principalInput = ReactDom.findDOMNode(this.refs.principalInput);
    let principal = parseFloat(principalInput.getElementsByTagName('input')[0].value);

    this.props.dispatch({
      type: 'TicketProfitListState/submitNewProfit',
      payload: {
        time,
        principal
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

  handleAddModalVisible(visible) {
    this.props.dispatch({
      type: 'TicketProfitListState/changeAddModalVisible',
      payload: {
        visible: visible,
      },
    });
    let dateInput =  ReactDom.findDOMNode(this.refs.dateInput);
    dateInput.getElementsByTagName('input')[0].value = moment().format('YYYY-MM-DD');
    ReactDom.findDOMNode(this.refs.timeInput).getElementsByTagName('input')[0].value = moment().format('HH:mm:ss');

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

  handlePrincipalLoss(id) {
     this.props.dispatch({
       type: 'TicketProfitListState/submitPrincipalLoss',
       payload: {
         id,
         principalLoss: true,
       },
     })
  }

  filterList(filter) {
    this.props.dispatch({
      type: 'TicketProfitListState/filterList',
      payload: filter,
    })
  }

  //delete
  deleteConfirm(id) {
    this.props.dispatch({
      type: 'TicketProfitListState/deleteTicketProfit',
      payload: {
        id
      },
    });
    message.success('删除成功');
  }

  changePage(page, pageSize) {
    this.props.dispatch({
      type: 'TicketProfitListState/filterList',
      payload: {
       page,
      },
    });
  }

  render() {
    const { list: { list, loading, withdrawVisible, withdrawLoading, withdrawNumber, addModalVisible , pagination, totalMonth, profit, amount, momentTime} } = this.props;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const GetTag = ({item: { principalLoss, occupancy}}) => {

      if(principalLoss) {
        if(occupancy >= 100) {
          return (<Tag color="red">已盈利 </Tag>);
        } else {
          return (<Tag color="black"> 已亏损 </Tag>);
        }
      } else {
        return (<Tag color="green">进行中</Tag>);
      }
    };
    //添加Modal
    const AddModal = ({addModalVisible}) => (
      <Modal
        title="添加"
        visible={addModalVisible}
        onOk={this.handleSubMitWithDraOk.bind(this)}
        confirmLoading={withdrawLoading}
        onCancel={this.handleAddModalVisible.bind(this, false)}>
        {
          React.Children.map(this.props.children, function (child) {
            return <li>{child}</li>;
          })
        }

        </Modal>
    )

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all" onClick={this.filterList.bind(this, {})}>全部</RadioButton>
          <RadioButton value="progress" onClick={this.filterList.bind(this, {principalLoss: false})}>进行中</RadioButton>
          <RadioButton value="waiting" onClick={this.filterList.bind(this, {principalLoss: true, occupancy: 1})}>已盈利</RadioButton>
          <RadioButton value="sh" onClick={this.filterList.bind(this, {principalLoss: true, occupancy: -1})}>已亏损</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const ProgressMore = ({progress}) => {
      if (progress <= 100) {
        return (<Progress percent={progress} strokeWidth={6} />);
      } else {
        return (<p> {progress + '%'} </p>);
      }
    };

    const paginationProps = {
        ...pagination,
      onChange: this.changePage.bind(this)
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
          <span>本金是否损失</span><p>￥{principalLoss ? '是' : '否'}</p>
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

    const menu =(id) => (
      <Menu>
        <Menu.Item>
          <Popconfirm title="确定本金损失?" onConfirm={this.handlePrincipalLoss.bind(this, id)} okText="确定" cancelText="取消">
            <a>本金损失</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm title="确定要删除该子项?" onConfirm={this.deleteConfirm.bind(this, id)} okText="确定" cancelText="取消">
            <a>删除</a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = ({item}) => {
      if (item.principalLoss) {
        return (<Tag color='blue'>已终结</Tag>)
      } else {
        return (
          <div>
            <a onClick={this.handleWithDraOk.bind(this, item)}>提现</a>&nbsp;
            <Dropdown overlay={menu(item._id)}>
              <a>
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </div>

        )
      }
    };

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="本月充值笔数" value={totalMonth} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本月充值总金额" value={amount} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本月盈利" value={profit} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="Profit 列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button type="dashed" onClick={this.handleAddModalVisible.bind(this, true)} style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加
            </Button>
            <Modal
              title="添加"
              visible={addModalVisible}
              onOk={this.submitNewProfit.bind(this)}
              confirmLoading={withdrawLoading}
              onCancel={this.handleAddModalVisible.bind(this, false)}>
              <ul>
                  <div className={styles.formItem}>
                    <label>时间：</label> <DatePicker ref='dateInput' defaultValue={momentTime}/> <TimePicker ref='timeInput'  defaultValue={momentTime}/>
                  </div>
                  <div className={styles.formItem}>
                    <label>本金：</label> <InputNumber ref='principalInput' placeholder="0.0"/>
                  </div>
              </ul>

            </Modal>

            <List
              size="large"
              rowKey="_id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[<MoreBtn  item={item}/>]}
                >
                  <List.Item.Meta
                    avatar={<GetTag item={item}/>}
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
          <Input size="large" ref='withDrawNumberInput' placeholder="0.0" />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
