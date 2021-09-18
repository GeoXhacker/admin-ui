import { Card, Col, Row } from 'antd'
import ReactECharts from 'echarts-for-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import ApiComponent from './global/ApiComponent'

export default class Dashboard extends ApiComponent<
    RouteComponentProps<any>,
    any
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            stats: {},
        }
    }

    getOptions(data: any) {
        return {
            color: '#1b8ad3',
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                    ],
                },
            ],
            yAxis: [
                {
                    type: 'value',
                },
            ],
            series: [
                {
                    type: 'bar',
                    barWidth: '60%',
                    data,
                },
            ],
        }
    }

    fetchStats() {
        this.getPathData({ path: '/statistics/monthly' })
            .then((stats: any) => {
                this.setState({ stats })
            })
            .catch(() => {})
    }

    componentDidMount() {
        this.fetchStats()
    }

    render() {
        return (
            <Row justify="center" gutter={20}>
                <Col
                    style={{ marginBottom: 20 }}
                    lg={{ span: 10 }}
                    xs={{ span: 23 }}
                >
                    <Card>
                        <ReactECharts
                            option={{
                                ...this.getOptions(this.state.stats.users),
                                title: {
                                    text: 'USERS',
                                },
                            }}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: '220px', width: '100%' }}
                        />
                    </Card>
                </Col>
                <Col
                    style={{ marginBottom: 20 }}
                    lg={{ span: 10 }}
                    xs={{ span: 23 }}
                >
                    <Card>
                        <ReactECharts
                            option={{
                                ...this.getOptions(this.state.stats.orders),
                                title: {
                                    text: 'ORDERS',
                                },
                            }}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: '220px', width: '100%' }}
                        />
                    </Card>
                </Col>
            </Row>
        )
    }
}
