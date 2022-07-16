<template>
    <div>
        <el-button style="padding: 0; margin-right: 0.5em" type="text" :disabled="row.status == 5" @click="editor(row)">编辑</el-button>
        <!-- 1 未发布，2 暂停，3 发布，4 结束 0 创建中 5 进行中 这是哪一个坑货写的注释？-->
        <!-- 1未发布 2未开始 3暂停 4进行中 5已结束 0 删除 6已发布（包含未开始和进行中的） -->
        <el-dropdown>
            <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="row.status == 1" @click.native="goRecord(row)"> 查看互动记录 </el-dropdown-item>
                <el-dropdown-item :disabled="row.status == 1" @click.native="goGiftSendRecord(row)"> 中奖记录 </el-dropdown-item>
                <el-dropdown-item :disabled="row.status == 1" @click.native="datav(row)"> 活动数据 </el-dropdown-item>
                <el-dropdown-item v-if="row.status == 1" @click.native="editor(row, 'send')"> 发布活动 </el-dropdown-item>
                <el-dropdown-item v-if="row.status == 4" @click.native="pauseAct(row)"> 暂停活动 </el-dropdown-item>
                <el-dropdown-item v-if="row.status == 3" @click.native="startAct(row)"> 启用活动 </el-dropdown-item>
                <el-dropdown-item v-if="row.status != 1 && row.status != 5" @click.native="stopAct(row)"> 结束活动 </el-dropdown-item>
                <el-dropdown-item v-if="row.status == 5 || row.status == 1" @click.native="delAct(row)"> 删除活动 </el-dropdown-item>
                <!-- [TODO] 上线前需要删除 ↓ -->
                <el-dropdown-item style="display: none" @click.native="updateOMS(row)">同步OMS</el-dropdown-item>
                <!-- 投放链接url_type = 1;装修链接url_type = 2 -->
                <!-- <el-dropdown-item
					v-if="row.scence_id != 41"
					@click.native="copyUrl(row, 2)"
					:disabled="row.status == 1"
					>复制装修链接</el-dropdown-item
				> -->
                <el-dropdown-item :disabled="row.status == 1" @click.native="copyActUrl(row)"> 复制活动链接 </el-dropdown-item>

                <!-- <el-dropdown-item v-if="row.status != 1" @click.native="copyAct(row)">
          复制活动
        </el-dropdown-item> -->
            </el-dropdown-menu>
        </el-dropdown>

        <!-- 配置自己的dialog -->
    </div>
</template>

<script>
import {changeStatus, synchronousOms} from "./api/lankou";
import modalLoader from "@jifenn/enbrands-interaction-tools/utils/modalLoader";
import delAct from "./service/operation/delAct.vue";
import pushAct from "./service/operation/pushAct.vue";
import startAct from "./service/operation/startAct.vue";
import stopAct from "./service/operation/stopAct.vue";
import pauseAct from "./service/operation/pauseAct.vue";
import copyUrl from "./service/operation/copyUrl.vue";

export default {
    props: {
        row: Object,
        updateInteractionList: Function,
        load: Object,
    },
    methods: {
        // 同步OMS 只在测试环境和开发环境显示
        updateOMS(item) {
            this.$message("正在同步OMS...");
            synchronousOms({activity_id: item.id})
                .then((res) => {
                    if (res.code) return new Error(res.msg);
                    this.$message.success("同步OMS成功!");
                    console.log(res);
                })
                .catch((e) => this.$message.error(`同步OMS失败!，${e.message}`))
                .finally(() => {
                    this.$message.success("同步OMS结束。");
                });
        },
        datav(item) {
            this.$router.push({
                path: "/datav",
                query: {
                    activity_name: item.name,
                    activity_id: item.id,
                },
            });
        },
        goRecord(item) {
            try {
                // eslint-disable-next-line
                $location.url(
                    "/operations/interaction/log?id=" +
                        item.id +
                        "&name=" +
                        encodeURIComponent(item.name) +
                        "&scenario_predef_id=" +
                        item.scenario_predef_id +
                        "&begin_at=" +
                        encodeURIComponent(item.begin_at) +
                        "&end_at=" +
                        encodeURIComponent(item.end_at)
                );
                // eslint-disable-next-line
                $rootScope.$apply();
            } catch (e) {
                this.$message.error(e.message);
            }
        },
        goGiftSendRecord(item) {
            this.$router.push({
                path: "/giftSendRecord",
                query: {
                    activity_id: item.id,
                    activity_name: item.name,
                },
            });
        },
        async editor(item, send) {
            this.$router.push({
                path: "/edit",
                query: {
                    activity_id: item.id,
                    send: send == "send" ? send : null,
                },
            });
            // if (item.status == "4") {
            // try {
            //   // 进行中的需要先暂停
            //   await this.pauseAct(item, "编辑");
            // } catch (err) {
            //   this.$message.error(err.msg);
            //   return;
            // }
            // }
        },
        async delAct(item) {
            await modalLoader(delAct, {data: {name: item.name}});
            try {
                this.load.loading();
                await changeStatus({
                    id: item.id,
                    merchantNum: item.merchant_num,
                    status: 0,
                });
                this.$message({message: "删除成功", type: "success"});
                this.updateInteractionList();
            } catch (e) {
                this.$message.error(e.message || e.msg || JSON.stringify(e));
            } finally {
                this.load.loaded();
            }
        },
        async pushAct(item) {
            await modalLoader(pushAct, {data: {name: item.name}});
            try {
                this.load.loading();
                await changeStatus({
                    id: item.id,
                    merchantNum: item.merchant_num,
                    status: 3,
                });
                this.$message({message: "发布成功", type: "success"});
                this.updateInteractionList();
            } catch (e) {
                this.$message.error(e.message || e.msg || JSON.stringify(e));
            } finally {
                this.load.loaded();
            }
        },
        async startAct(item) {
            await modalLoader(startAct, {data: {name: item.name}});
            try {
                this.load.loading();
                await changeStatus({
                    id: item.id,
                    merchantNum: item.merchant_num,
                    status: 3,
                });
                this.$message({message: "重启成功", type: "success"});
                this.updateInteractionList();
            } catch (e) {
                this.$message.error(e.message || e.msg || JSON.stringify(e));
            } finally {
                this.load.loaded();
            }
        },
        async pauseAct(item) {
            await modalLoader(pauseAct, {data: {name: item.name}});
            try {
                this.load.loading();
                await changeStatus({
                    id: item.id,
                    merchantNum: item.merchant_num,
                    status: 2,
                });
                this.$message({message: "暂停成功", type: "success"});
                this.updateInteractionList();
            } catch (e) {
                this.$message.error(e.message || e.msg || JSON.stringify(e));
            } finally {
                this.load.loaded();
            }
        },
        async stopAct(item) {
            await modalLoader(stopAct, {data: {name: item.name}});
            try {
                this.load.loading();
                await changeStatus({
                    id: item.id,
                    merchantNum: item.merchant_num,
                    status: 4,
                });
                this.$message({message: "结束成功", type: "success"});
                this.updateInteractionList();
            } catch (e) {
                this.$message.error(e.message || e.msg || JSON.stringify(e));
            } finally {
                this.load.loaded();
            }
        },
        async copyActUrl(item) {
            await modalLoader(copyUrl, {
                data: item,
            });
        },
    },
};
</script>

<style>
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
</style>
