//域名地址
// var url = '182.61.60.63';
//var url = '127.0.0.1:8603'
// var url = "106.12.100.188"
 var url = "106.12.113.221"
//var url = "sys.hwger.cn"
// var url = "sys.1483439826.com"

//var prefix = 'https://';
var prefix = 'http://';

// 修改QQ的URL
var qq_url = prefix + url + '/ums/api/user/change_user_qq'
// 加载用户信息的url
var user_url = prefix + url + '/pbs/api/promoter/load_promoter_info'
// 获取token的url
// var token_url = prefix + url + '/ums/jwt/password'/jwt/refresh
// var token_url = prefix + url + '/ums/jwt/refresh'
var token_url = prefix + url + '/ums/pub/user/refresh_token'

var money_url = prefix + url + '/pbs/api/finance/get_finance_account'

var find_message_url = prefix + url + '/ums/api/message/query_user_message'

var get_user_message_url = prefix + url + '/ums/api/message/get_user_message'

var query_system_message_url = prefix + url + '/ums/api/message/query_system_message'

var get_system_message_url = prefix + url + '/ums/api/message/get_system_message'

var send_mobile_message_url = prefix + url + '/ums/pub/user/send_mobile_message'

var change_user_mobile_url = prefix + url + '/ums/api/user/change_user_mobile'
//注册的url
var register_promoter_url = prefix + url + '/ums/pub/user/register_promoter'
//登录的url
var login_by_mobile_url = prefix + url + '/ums/pub/user/login_by_mobile'

var wechat_url = prefix + url + '/ums/api/user/change_user_wechat'

var check_promoter_code_url = prefix + url + '/ums/pub/user/check_promoter_code'

var get_promoter_config_url = prefix + url + '/pbs/api/promoter/get_promoter_config'

var create_promoter_code_url = prefix + url + '/pbs/api/promoter/create_promoter_code'

var save_promoter_config_url = prefix + url + '/pbs/api/promoter/save_promoter_config'

var promoter_last_code_url = prefix + url + '/pbs/api/promoter/promoter_last_code'

var promoter_code_count_url = prefix + url + '/pbs/api/promoter/promoter_code_count'

var change_user_bank_number_url = prefix + url + '/pbs/api/promoter/change_bank_number'

var promoter_withdraw_url = prefix + url + '/pbs/api/finance/promoter_withdraw'

var query_promoter_code_url = prefix + url + '/pbs/api/promoter/query_promoter_code'

var get_withdraw_fee_url = prefix + url + '/pbs/api/finance/get_withdraw_fee'

var change_id_card_info_url = prefix + url + '/pbs/api/promoter/change_id_card_info'

var get_ocr_id_card_url = prefix + url + '/pbs/api/promoter/get_ocr_id_card'

var grab_task_url = prefix + url + '/pbs/api/promote_task/grab_task'
//判断手机号是否可用
var check_mobile_url = prefix + url + '/ums/pub/user/check_mobile'

var query_promoter_finance_cert_url = prefix + url + '/pbs/api/finance/query_promoter_finance_cert'

var query_promoter_finance_url = prefix + url + '/pbs/api/finance/query_promoter_finance'

var query_promoter_finance_url_new = prefix + url + '/pbs/api/finance/query_promoter_finance_new'

var count_enable_withdraw_coin_url = prefix + url + '/pbs/api/finance/count_enable_withdraw_coin'

var get_merchant_finance_url = prefix + url + '/pbs/api/finance/get_merchant_finance'

var my_recommends_url = prefix + url + '/pbs/api/promoter/my_recommends'

var delete_my_recommends_url = prefix + url + '/pbs/api/promoter/delete_my_recommends'

var pushOrder_url = prefix + url + '/pbs/api/promoter/pushOrderAudit'

var getOrders_url = prefix + url + '/pbs/api/promote_task/get_promote_tasks'

var get_tao_token_url = prefix + url + '/pbs/api/promoter/get_tao_token'

var get_task_detail_url = prefix + url + '/pbs/api/promote_task/get_task_detail'

var pushOrder2_url = prefix + url + '/pbs/api/promote_task/submit_result'

//var upload_file_url = 'https://' + url + '/pbs/api/promoter/upload_file'
var upload_file_url = prefix + url + '/file/pub/upload'

var check_wechat_openid_url = prefix + url + '/ums/pub/user/check_wxopenid'

var wechat_auth_url = prefix + url + '/pbs/api/promoter/wechat_auth'

var withdraw_wechat_url = prefix + url + '/pbs/api/promoter/withdraw_wechat'

var withdraw_wechat_task_url = prefix + url + '/pbs/api/promoter/withdraw_wechat_task'

var taobao_links_check_url = prefix + url + '/pbs/api/promote_task/taobao_links_check'

var get_reward_money_url = prefix + url + '/pbs/api/finance/get_reward_money'

var get_task_success_rate_url = prefix + url + '/pbs/api/promote_task/get_task_success_rate'

var getOrders_count_url = prefix + url + '/pbs/api/promote_task/get_promote_tasks_count'

var save_gps_day_url = prefix + url + '/pbs/api/gps_history/save_day'

var get_invite_codes_url = prefix + url + '/pbs/api/promoter/query_invite_code'

var count_execute_task_url = prefix + url +'/pbs/api/executeTask/countPromoterExecuteTasks'

var update_promoter_info_url = prefix + url + '/pbs/api/promoter/update_promoter_info'

var qeury_bank_url = prefix + url + '/pbs/api/account/query_bank'

var query_withdraw_endTime_url = prefix + url + '/pbs/api/miniAppNotice/get_miniapps_notice'
//查询小程序AppId
var getAppId_url = prefix + url + '/pbs/api/promoter/get_promoter_miniapp_appId'

//查询推手任务列表
var query_task_url = prefix + url + '/pbs/api/executeTask/queryMini'

//统计页面列表
var count_referee_url = prefix + url + '/pbs/api/promoter/count_referee_invate_task'
//查询佣金笔数和金额
var count_referee_money_url = prefix + url + '/pbs/api/promoter/count_referee_invate_task_data'
//首页banner获取
var get_banner_url = prefix + url + '/pbs/api/banner/getBanner'
var get_bannerRel_url=prefix + url + '/file/pub/getFileUrl'
var get_banner_flag = prefix + url + '/pbs/api/banner/get_banner_flag'
//获取id水印背景图
var get_bgmark_url = prefix + url + '/pbs/api/promoter/get_bgmark_url'

var get_prop = prefix + url + '/ums/api/prop/get_prop'
var remind_url = prefix + url + '/pbs/api/execute_task_remind/create_remind'
var hurry_order_url = prefix + url + '/pbs/api/execute_task_remind/query_remind_task_ids'
var check_withdraw_status = prefix + url + '/pbs/api/promoter/check_wechat_withdraw_status'
var count_promoter_reward_money = prefix + url + '/pbs/api/promoter/count_promoter_reward_money'

//三码合一
var promoter_oauth = prefix + url + '/pbs/api/promoter/promoter_oauth'
//师傅统计——流量任务总数
var countFlowTaskData = prefix + url + '/pbs/api/promoter/count_flow_task_data'
//师傅统计——流量任务徒弟单数列表
var countApprenticeFlowTask = prefix + url + '/pbs/api/promoter/count_apprentice_flow_task'
//徒弟流量任务统计详情
var flowQueryMini = prefix + url + '/pbs/api/executeTaskFlow/queryMini'

var get_task_flow_detail = prefix + url + '/pbs/api/executeTaskFlow/get_flow_task_detail'

var push_flow_order = prefix + url + '/pbs/api/executeTaskFlow/submitTask'

var check_flow_linkAddress = prefix + url + '/pbs/api/executeTaskFlow/taobaolinkCheck'

var cancle_task_flow = prefix + url + '/pbs/api/executeTaskFlow/cancelTask'
//流量任务接单
var grab_flow_task_url = prefix + url + '/pbs/api/promote_task/grab_flow_task'

var query_promoter_flow_task_url = prefix + url + '/pbs/api/executeTaskFlow/queryPromoterTask'

var get_flow_task_count_url = prefix + url + '/pbs/api/executeTaskFlow/getPromoteFlowTasksCount'

var count_execute_task_flow_url = prefix + url + '/pbs/api/executeTaskFlow/count_execute_task_flow'

//查询流量任务流水
var queryFlowFinanceRecord = prefix + url + '/pbs/api/flowfinance/query_promoter_flow_finance_record'
//统计推手今天累计佣金
var get_promoter_today_coin_url = prefix + url + '/pbs/api/finance/get_promoter_today_coin'
//统计推手所有累计的佣金
var get_promoter_total_coin_url = prefix + url + '/pbs/api/finance/get_promoter_total_coin'
//查询流量财务详情
var get_merchant_finance = prefix + url + '/pbs/api/flowfinance/get_merchant_finance'

var setUrl = function (app) {
  app.globalData.all_url = {
    location_url: prefix + url,
    qq_url: qq_url,
    token_url: token_url,
    user_url: user_url,
    money_url: money_url,
    find_message_url: find_message_url,
    send_mobile_message_url: send_mobile_message_url,
    change_user_mobile_url: change_user_mobile_url,
    register_promoter_url: register_promoter_url,
    login_by_mobile_url: login_by_mobile_url,
    wechat_url: wechat_url,
    check_promoter_code_url: check_promoter_code_url,
    get_promoter_config_url: get_promoter_config_url,
    create_promoter_code_url: create_promoter_code_url,
    save_promoter_config_url: save_promoter_config_url,
    promoter_last_code_url: promoter_last_code_url,
    promoter_code_count_url: promoter_code_count_url,
    change_user_bank_number_url: change_user_bank_number_url,
    promoter_withdraw_url: promoter_withdraw_url,
    query_promoter_code_url: query_promoter_code_url,
    get_withdraw_fee_url: get_withdraw_fee_url,
    change_id_card_info_url: change_id_card_info_url,
    get_ocr_id_card_url: get_ocr_id_card_url,
    query_system_message_url: query_system_message_url,
    grab_task_url: grab_task_url,
    check_mobile_url: check_mobile_url,
    get_system_message_url: get_system_message_url,
    get_user_message_url: get_user_message_url,
    query_promoter_finance_cert_url: query_promoter_finance_cert_url,
    query_promoter_finance_url: query_promoter_finance_url,
    query_promoter_finance_url_new: query_promoter_finance_url_new,
    count_enable_withdraw_coin_url: count_enable_withdraw_coin_url,
    get_merchant_finance_url: get_merchant_finance_url,
    my_recommends_url: my_recommends_url,
    delete_my_recommends_url: delete_my_recommends_url,
    pushOrder_url: pushOrder_url,
    getOrders_url: getOrders_url,
    get_tao_token_url: get_tao_token_url,
    get_task_detail_url: get_task_detail_url,
    pushOrder2_url: pushOrder2_url,
    upload_file_url: upload_file_url,
    wechat_auth_url: wechat_auth_url,
    check_wechat_openid_url: check_wechat_openid_url,
    withdraw_wechat_url: withdraw_wechat_url,
    withdraw_wechat_task_url: withdraw_wechat_task_url,
    taobao_links_check_url: taobao_links_check_url,
    get_reward_money_url: get_reward_money_url,
    get_task_success_rate_url: get_task_success_rate_url,
    getOrders_count_url: getOrders_count_url,
    save_gps_day_url: save_gps_day_url,
    get_invite_codes_url: get_invite_codes_url,
    count_execute_task_url: count_execute_task_url,
    update_promoter_info_url: update_promoter_info_url,
    qeury_bank_url: qeury_bank_url,
    query_withdraw_endTime_url: query_withdraw_endTime_url,
    getAppId_url: getAppId_url,
    query_task_url: query_task_url,
    count_referee_url:count_referee_url,
    count_referee_money_url:count_referee_money_url,
    get_bannerCode_url:get_banner_url,
    get_bannerRel_url:get_bannerRel_url,
    get_bgmark_url:get_bgmark_url,
    get_banner_flag: get_banner_flag,
    get_prop: get_prop,
    remind_url: remind_url,
    hurry_order_url: hurry_order_url,
    check_withdraw_status: check_withdraw_status,
    count_promoter_reward_money: count_promoter_reward_money,
    promoter_oauth: promoter_oauth,
    get_task_flow_detail: get_task_flow_detail,
    push_flow_order: push_flow_order,
    promoter_oauth: promoter_oauth,
    countFlowTaskData: countFlowTaskData,
    countApprenticeFlowTask: countApprenticeFlowTask,
    flowQueryMini: flowQueryMini,
    check_flow_linkAddress: check_flow_linkAddress,
    cancle_task_flow: cancle_task_flow,
    grab_flow_task: grab_flow_task_url,
    queryPromoterFlowTask: query_promoter_flow_task_url,
    getFlowTaskCount: get_flow_task_count_url,
    count_execute_task_flow: count_execute_task_flow_url,
    queryFlowFinanceRecord: queryFlowFinanceRecord,
    get_promoter_today_coin: get_promoter_today_coin_url,
    get_promoter_total_coin: get_promoter_total_coin_url,
    get_merchant_finance: get_merchant_finance
  }
}
module.exports = {
  setUrl: setUrl
}