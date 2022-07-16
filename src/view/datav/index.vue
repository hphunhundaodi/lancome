<template>
    <div class="datav">
        <div class="datav-container">
            <div class="datav-content">
                <el-breadcrumb class="content-bread" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{path: '/'}">互动活动</el-breadcrumb-item>
                    <el-breadcrumb-item>兰蔻会员抽奖</el-breadcrumb-item>
                    <el-breadcrumb-item>兰蔻双11 活动</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="datav-content">
                <div class="content-bigtitle">活动数据</div>
                <div class="content-time">
                    <div>同步时间：</div>
                    <el-date-picker
                        v-model="table_date"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="onPickerChange()"
                    ></el-date-picker>
                </div>
            </div>
            <div class="datav-content-title">
                <div class="content-title">数据概述</div>
                <div></div>
            </div>
            <div class="content-background">
                <div class="card-content">
                    <div class="card-info">
                        <div class="card-top">
                            <div>访问次数</div>
                            <el-tooltip effect="light" content="(前30天)访问次数" placement="top">
                                <div class="el-icon-warning-outline"></div>
                            </el-tooltip>
                        </div>
                        <div class="card-bot">
                            <div>昨日：{{ tableData[0] ? tableData[0].pv : "-" }}</div>
                            <div>累计：{{ sum_data.pv }}</div>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-top">
                            <div>访问人数</div>
                            <el-tooltip effect="light" content="(前30天)访问人数" placement="top">
                                <div class="el-icon-warning-outline"></div>
                            </el-tooltip>
                        </div>
                        <div class="card-bot">
                            <div>昨日：{{ tableData[0] ? tableData[0].uv : "-" }}</div>
                            <div>累计：{{ sum_data.uv }}</div>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-top">
                            <div>购买指定商品人数</div>
                            <el-tooltip effect="light" content="(前30天)购买指定商品人数" placement="top">
                                <div class="el-icon-warning-outline"></div>
                            </el-tooltip>
                        </div>
                        <div class="card-bot">
                            <div>昨日：{{ tableData[0] ? tableData[0].buy_good_user_num : "-" }}</div>
                            <div>累计：{{ sum_data.buy_good_user_num }}</div>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-top">
                            <div>抽奖人数</div>
                            <el-tooltip effect="light" content="(前30天)抽奖人数" placement="top">
                                <div class="el-icon-warning-outline"></div>
                            </el-tooltip>
                        </div>
                        <div class="card-bot">
                            <div>昨日：{{ tableData[0] ? tableData[0].take_prize_user_num : "-" }}</div>
                            <div>累计：{{ sum_data.take_prize_user_num }}</div>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-top">
                            <div>中奖人数</div>
                            <el-tooltip effect="light" content="(前30天)中奖人数" placement="top">
                                <div class="el-icon-warning-outline"></div>
                            </el-tooltip>
                        </div>
                        <div class="card-bot">
                            <div>昨日：{{ tableData[0] ? tableData[0].win_prize_user_num : "-" }}</div>
                            <div>累计：{{ sum_data.win_prize_user_num }}</div>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-top">
                            <div>推送订单人数</div>
                            <el-tooltip effect="light" content="(前30天)推送订单人数" placement="top">
                                <div class="el-icon-warning-outline"></div>
                            </el-tooltip>
                        </div>
                        <div class="card-bot">
                            <div>昨日：{{ tableData[0] ? tableData[0].push_order_user_num : "-" }}</div>
                            <div>累计：{{ sum_data.push_order_user_num }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="datav-content-title">
                <div class="content-title">数据趋势</div>
                <div></div>
            </div>
            <div class="content-background">
                <div class="echarts-content" ref="echartsContent"></div>
            </div>
            <div class="datav-content-title">
                <div class="content-title">数据明细</div>
                <el-button type="text" @click="download()">数据导出</el-button>
            </div>
            <div class="table-content">
                <el-table :data="tableData" border style="width: 80%">
                    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
                    <el-table-column prop="pv" label="访问次数" width="180"> </el-table-column>
                    <el-table-column prop="uv" label="访问人数"> </el-table-column>
                    <el-table-column prop="buy_good_user_num" label="购买指定商品人数"> </el-table-column>
                    <el-table-column prop="take_prize_user_num" label="抽奖人数"> </el-table-column>
                    <el-table-column prop="win_prize_user_num" label="中奖人数"> </el-table-column>
                    <el-table-column prop="push_order_user_num" label="推送订单人数"> </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import {getActStatistical} from "../../api/lankou";
export default {
    data() {
        return {
            // 活动数据
            formData: {
                pv: [],
                uv: [],
                buy_good_user_num: [],
                take_prize_user_num: [],
                win_prize_user_num: [],
                push_order_user_num: [],
                date: [],
            },
            // echarts数据, 不需要vue监听
            // myChart: null,
            // 表格筛选时间
            table_date: [moment().add(-14, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
            // table数据
            tableData: [],
            // 累计数据
            sum_data: {
                pv: 0,
                uv: 0,
                buy_good_user_num: 0,
                take_prize_user_num: 0,
                win_prize_user_num: 0,
                push_order_user_num: 0,
            },
            // 趋势图数据暂存用作导出
            option: {},
        };
    },
    methods: {
        initChart() {
            if (this.myChart) this.$delete(this.myChart), this.$delete(this.option);
            this.myChart = window.echarts.init(this.$refs.echartsContent);

            const getSeriesDefaultConfig = ({title, field}) => ({
                name: title,
                type: "line",
                stack: "Total",
                data: this.tableData.map((it) => it[field]),
            });

            let series = [];

            // 数据维度
            let data_maps = [
                {title: "访问次数", field: "pv"},
                {title: "访问人数", field: "uv"},
                {title: "购买指定商品人数", field: "buy_good_user_num"},
                {title: "抽奖人数", field: "take_prize_user_num"},
                {title: "中奖人数", field: "win_prize_user_num"},
                {title: "推送订单人数", field: "push_order_user_num"},
            ];

            data_maps.forEach((field) => series.push(getSeriesDefaultConfig(field)));

            //3.配置数据
            let option = {
                title: {
                    text: "活动每日数据变化趋势图",
                    textStyle: {
                        fontSize: 16,
                        fontWeight: "normal",
                    },
                    top: 0,
                    left: 0,
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: [],
                    right: 30,
                    top: 26,
                },
                grid: {
                    left: "5%",
                    right: "5%",
                    bottom: "2%",
                    top: 70,
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [],
                },
                yAxis: {
                    type: "value",
                    minInterval: 1,
                },
                series: series, //配置项
            };
            option.legend.data = option.series.map((item) => item.name);
            option.xAxis.data = this.formData.date;

            // 4.传入数据
            this.option = option;
            this.myChart.setOption(option);
            window.addEventListener("resize", function () {
                this.myChart.resize();
            });
        },
        download() {
            let str = "时间,";

            this.option.series.forEach((item) => {
                str = str + item.name + ",";
            });
            str += "\n";
            this.option.xAxis.data.forEach((item, index) => {
                str += `${item},`;
                this.option.series.forEach((e) => {
                    if (e.data[index] == undefined) {
                        str += `0,`;
                    } else {
                        str += `${e.data[index]},`;
                    }
                });
                str += "\n";
            });
            const uri = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(str)}`;
            const link = document.createElement("a");
            link.href = uri;
            link.download = `兰蔻双11_${moment(this.option.xAxis.data[0]).format("YYYY-MM-DD")}_${moment(
                this.option.xAxis.data[this.option.xAxis.data.length - 1]
            ).format("YYYY-MM-DD")}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onPickerChange() {
            this.getStatisticalData();
        },
        getStatisticalData() {
            getActStatistical({
                activity_id: this.$route.query.activity_id,
                start_date: this.table_date[0],
                end_date: this.table_date[1],
            })
                .then((res) => {
                    if (res.code) throw new Error(res.msg);
                    if (this.formData.date.length > 0) this.formData.date = [];
                    this.tableData = res.data;
                    this.tableData.forEach((el) => {
                        this.formData.pv.unshift(el.pv);
                        this.formData.uv.unshift(el.uv);
                        this.formData.buy_good_user_num.unshift(el.buy_good_user_num);
                        this.formData.take_prize_user_num.unshift(el.take_prize_user_num);
                        this.formData.win_prize_user_num.unshift(el.win_prize_user_num);
                        this.formData.push_order_user_num.unshift(el.push_order_user_num);
                        this.formData.date.unshift(el.date);
                    });

                    this.initChart();

                    res.data.forEach((el) => {
                        this.sum_data.pv += el.pv;
                        this.sum_data.uv += el.uv;
                        this.sum_data.buy_good_user_num += el.buy_good_user_num;
                        this.sum_data.take_prize_user_num += el.take_prize_user_num;
                        this.sum_data.win_prize_user_num += el.win_prize_user_num;
                        this.sum_data.push_order_user_num += el.push_order_user_num;
                    });
                })
                .catch((e) => {
                    this.$message.error(e.message);
                });
        },
    },
    mounted() {},
    created() {
        this.getStatisticalData();
    },
};
</script>

<style lang="less" scoped>
.datav {
    width: 100%;
    min-width: 1024px;
    height: 100%;
    .datav-container {
        padding: 20px;
        .table-content {
            background-color: #fff;
            padding: 30px;
        }
        .content-background {
            background-color: #ffffff;
            padding: 30px 0;
            .echarts-content {
                width: 100%;
                height: 500px;
            }
            .card-content {
                display: flex;
                justify-content: center;
                align-items: center;
                .card-info {
                    border: 1px solid #000000;
                    margin: 0 30px;
                    width: 200px;
                    height: 200px;
                    .card-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 10px;
                    }
                    .card-bot {
                        text-align: center;
                        margin: 0 auto;
                        padding: 58px 0;
                    }
                }
            }
        }
        .datav-content {
            display: flex;
            align-items: center;
            background-color: #fff;
            margin-top: 10px;
            .content-time {
                display: flex;
                align-items: center;
                margin-left: 100px;
            }
            .content-bread {
                padding: 20px;
            }
            .content-bigtitle {
                padding: 20px;
                font-size: 20px;
                font-weight: 600;
            }
        }
        .datav-content-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f7f7f7;
            margin-top: 5px;
            padding-right: 20px;
            .content-title {
                padding: 10px 20px;
            }
        }
        :first-child {
            margin-top: 0;
        }
    }
}
</style>