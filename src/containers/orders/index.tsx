import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Col, message, Popconfirm, Row, Table, Tabs } from 'antd'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { IMobileComponent } from '../../models/ContainerProps'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'
import ErrorRetry from '../global/ErrorRetry'
import ConfirmModal from './confirmModal'
// import User from './add'
// change colomn name to suit the orders

class UsersTable extends ApiComponent<
    {
        emitRootKeyChanged: Function
        isMobile: boolean
    },
    {
        searchTerm: string
        apiData: any
        isLoading: boolean
        confirmOrder: boolean
        movingOrders: any
        deliveryOrders: any
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchTerm: '',
            apiData: undefined,
            isLoading: false,
            confirmOrder: false,
            movingOrders: undefined,
            deliveryOrders: undefined,
        }
    }

    onSearchUser(input: any, option: any) {
        let regEx = new RegExp(input, 'ig')
        return regEx.test(option.type)
    }

    reFetchData(isLoading: boolean) {
        this.setState({ isLoading }, () => {
            this.getPathData({ path: '/browse/movingOrders' })
                .then(({ items }: any) => {
                    console.log(items, 'items')
                    this.setState({
                        isLoading: false,
                        apiData: items,
                        movingOrders: items,
                    })

                    this.getPathData({ path: '/browse/deliveryOrders' })
                        .then(({ items }: any) => {
                            console.log(items, 'items')
                            this.setState({
                                isLoading: false,
                                apiData: items,
                                deliveryOrders: items,
                            })
                        })
                        .catch(() => this.setState({ isLoading: false }))

                    // this.props.emitRootKeyChanged()
                })
                .catch(() => this.setState({ isLoading: false }))
        })
    }

    componentDidMount() {
        this.reFetchData(true)
        // setInterval(() => {
        //     this.reFetchData(false)
        // }, 5000)
    }

    render() {
        if (this.state.isLoading) return <CenteredSpinner />

        if (!this.state.apiData) {
            return <ErrorRetry reloadCallBack={this.reFetchData.bind(this)} />
        }

        // const data = this.state.apiData.filter((user: any) => {
        //     if (!this.state.searchTerm) return true
        //     return this.onSearchUser(this.state.searchTerm, user)
        // })

        // const searchAppInput = (
        //     <Input
        //         placeholder="Search"
        //         type="text"
        //         onChange={(event) =>
        //             this.setState({
        //                 searchTerm: (event.target.value || '').trim(),
        //             })
        //         }
        //     />
        // )

        return (
            <div>
                <Row justify="center">
                    <Col
                        xs={{ span: 23 }}
                        lg={{ span: 23 }}
                        style={{ paddingBottom: 300 }}
                    >
                        <Card
                            // extra={!this.props.isMobile && searchAppInput}
                            title={
                                <React.Fragment>
                                    <span>
                                        <ShoppingCartOutlined />
                                        {`  `} ORDERS
                                    </span>
                                    <br />
                                    {this.props.isMobile && (
                                        <div style={{ marginTop: 8 }}>
                                            {/* {searchAppInput} */}
                                        </div>
                                    )}
                                </React.Fragment>
                            }
                        >
                            <Tabs
                                onChange={(activeKey: any) => {
                                    // console.log(activeKey)
                                    this.getPathData({
                                        path: `/browse/${activeKey}`,
                                    })
                                        .then(({ items }: any) => {
                                            // console.log(items, 'items')
                                            this.setState({
                                                isLoading: false,
                                                apiData: items,
                                                deliveryOrders: items,
                                            })
                                        })
                                        .catch(() =>
                                            this.setState({ isLoading: false })
                                        )
                                }}
                            >
                                <Tabs.TabPane tab="Moving" key="movingOrders">
                                    <Table
                                        rowKey={(record) => record.id}
                                        pagination={{
                                            defaultPageSize: 5,
                                            hideOnSinglePage: true,
                                            showSizeChanger: false,
                                        }}
                                        columns={[
                                            {
                                                title: 'Shift Need',
                                                dataIndex: 'shiftNeed',
                                            },
                                            {
                                                title: 'From',
                                                dataIndex: 'pickUpAddressName',
                                            },
                                            {
                                                title: 'To',
                                                dataIndex:
                                                    'destinationAddressName',
                                            },
                                            {
                                                title: 'User',
                                                dataIndex: 'user.username',
                                                render: (_, record: any) =>
                                                    record.user.username,
                                            },
                                            {
                                                title: 'Phone',
                                                dataIndex: 'user.username',
                                                render: (_, record: any) =>
                                                    record.user.phone,
                                            },
                                            {
                                                title: 'Created at',
                                                dataIndex: 'createdAt',
                                                render: (createdAt) => (
                                                    <>
                                                        {moment(
                                                            createdAt
                                                        ).format('DD-MM-YYYY')}
                                                    </>
                                                ),
                                            },
                                            {
                                                title: 'Schedule Date',
                                                dataIndex: 'scheduleDate',
                                            },
                                            {
                                                title: 'Status',
                                                dataIndex: 'status',
                                            },
                                            {
                                                title: 'Action',
                                                dataIndex: 'actions',
                                                render: (_, record) => (
                                                    <span>
                                                        {/* <User data={record}>
                                                <Button
                                                    shape="circle"
                                                    type="primary"
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </User> */}
                                                        <Popconfirm
                                                            title="Sure to delete?"
                                                            onConfirm={() =>
                                                                this.deletePathData(
                                                                    {
                                                                        path: `/orders/${record.id}`,
                                                                    }
                                                                ).then(() =>
                                                                    this.props.emitRootKeyChanged()
                                                                )
                                                            }
                                                        >
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                shape="circle"
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                            />
                                                        </Popconfirm>
                                                        <Popconfirm
                                                            title="sure to approve?"
                                                            onConfirm={() => {
                                                                console.log(
                                                                    record
                                                                )

                                                                this.updatePathData(
                                                                    {
                                                                        path: `/orders/${record.id}`,
                                                                        data: {
                                                                            status:
                                                                                'APPROVED',
                                                                            confirmedAt: new Date(),
                                                                        },
                                                                    }
                                                                )
                                                                    .then(
                                                                        () => {
                                                                            this.props.emitRootKeyChanged()
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (e) => {
                                                                            message.error(
                                                                                e.message
                                                                            )
                                                                        }
                                                                    )
                                                            }}
                                                        ></Popconfirm>

                                                        {/* <Button
                                                    type="primary"
                                                    shape="circle"
                                                    style={{
                                                        marginLeft: '10px',
                                                    }}
                                                    onClick={() => {
                                                        this.setState({
                                                            confirmOrder: true,
                                                        })
                                                    }}
                                                    icon={<CheckOutlined />}
                                                /> */}
                                                        <ConfirmModal
                                                            order={record}
                                                        />
                                                    </span>
                                                ),
                                            },
                                        ]}
                                        dataSource={this.state.movingOrders}
                                        size="small"
                                    />
                                </Tabs.TabPane>
                                <Tabs.TabPane
                                    tab="Delivery"
                                    key="deliveryOrders"
                                >
                                    <Table
                                        rowKey={(record) => record.id}
                                        pagination={{
                                            defaultPageSize: 5,
                                            hideOnSinglePage: true,
                                            showSizeChanger: false,
                                        }}
                                        columns={[
                                            {
                                                title: 'What',
                                                dataIndex: 'what',
                                            },
                                            {
                                                title: 'Instructions',
                                                dataIndex: 'instructions',
                                            },
                                            {
                                                title: 'Recipient',
                                                dataIndex: 'recipient',
                                            },
                                            {
                                                title: 'From',
                                                dataIndex: 'pickUpAddressName',
                                            },
                                            {
                                                title: 'To',
                                                dataIndex:
                                                    'destinationAddressName',
                                            },
                                            {
                                                title: 'User',
                                                dataIndex: 'user.username',
                                                render: (_, record: any) =>
                                                    record.user.username,
                                            },
                                            {
                                                title: 'Phone',
                                                dataIndex: 'user.username',
                                                render: (_, record: any) =>
                                                    record.user.phone,
                                            },
                                            {
                                                title: 'Created at',
                                                dataIndex: 'createdAt',
                                                render: (createdAt) => (
                                                    <>
                                                        {moment(
                                                            createdAt
                                                        ).format('DD-MM-YYYY')}
                                                    </>
                                                ),
                                            },

                                            {
                                                title: 'Status',
                                                dataIndex: 'status',
                                            },
                                            {
                                                title: 'Action',
                                                dataIndex: 'actions',
                                                render: (_, record) => (
                                                    <span>
                                                        {/* <User data={record}>
                                                <Button
                                                    shape="circle"
                                                    type="primary"
                                                >
                                                    <EditOutlined />
                                                </Button>
                                            </User> */}
                                                        <Popconfirm
                                                            title="Sure to delete?"
                                                            onConfirm={() =>
                                                                this.deletePathData(
                                                                    {
                                                                        path: `/delivery/${record.id}`,
                                                                    }
                                                                ).then(() =>
                                                                    this.props.emitRootKeyChanged()
                                                                )
                                                            }
                                                        >
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                shape="circle"
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                            />
                                                        </Popconfirm>
                                                        <Popconfirm
                                                            title="sure to approve?"
                                                            onConfirm={() => {
                                                                console.log(
                                                                    record
                                                                )

                                                                this.updatePathData(
                                                                    {
                                                                        path: `/delivery/${record.id}`,
                                                                        data: {
                                                                            status:
                                                                                'APPROVED',
                                                                            confirmedAt: new Date(),
                                                                        },
                                                                    }
                                                                )
                                                                    .then(
                                                                        () => {
                                                                            this.props.emitRootKeyChanged()
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (e) => {
                                                                            message.error(
                                                                                e.message
                                                                            )
                                                                        }
                                                                    )
                                                            }}
                                                        ></Popconfirm>

                                                        {/* <Button
                                                    type="primary"
                                                    shape="circle"
                                                    style={{
                                                        marginLeft: '10px',
                                                    }}
                                                    onClick={() => {
                                                        this.setState({
                                                            confirmOrder: true,
                                                        })
                                                    }}
                                                    icon={<CheckOutlined />}
                                                /> */}
                                                        <ConfirmModal
                                                            order={record}
                                                        />
                                                    </span>
                                                ),
                                            },
                                        ]}
                                        dataSource={this.state.deliveryOrders}
                                        size="small"
                                    />
                                </Tabs.TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        isMobile: state.globalReducer.isMobile,
    }
}

export default connect<IMobileComponent, any, any>(mapStateToProps, {
    emitRootKeyChanged: emitRootKeyChanged,
})(UsersTable)
