import * as request from 'request';
export class xxlJobExcutorClass {
    //registry
    /**
                                     * 说明：执行器注册时使用，调度中心会实时感知注册成功的执行器并发起任务调度
                                    ------
                                
                                    地址格式：{调度中心跟地址}/registry
                                
                                    Header：
                                        XXL-JOB-ACCESS-TOKEN : {请求令牌}
                                    
                                    请求数据格式如下，放置在 RequestBody 中，JSON格式：
                                        {
                                            "registryGroup":"EXECUTOR",                     // 固定值
                                            "registryKey":"xxl-job-executor-example",       // 执行器AppName
                                            "registryValue":"http://127.0.0.1:9999/"        // 执行器地址，内置服务跟地址
                                        }
                                
                                    响应数据格式：
                                        {
                                        "code": 200,      // 200 表示正常、其他失败
                                        "msg": null      // 错误提示消息
                                        }
                                    ————————————————
                                    版权声明：本文为CSDN博主「cwl_java」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
                                    原文链接：https://blog.csdn.net/weixin_42528266/article/details/108622226
                                     */
    public async registry(
        registryKey: string,
        registryValue: string,
        xxljobAdminUrl,
        timeout = 30000,
    ) {
        const options = {
            method: 'POST',
            url: xxljobAdminUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
            body: {
                registryGroup: 'EXECUTOR', // 固定值
                registryKey: registryKey, // 执行器AppName
                registryValue: registryValue, // 执行器地址，内置服务跟地址
            },
        };
        setInterval(() => {
            this.httpRequest(options).then((data) => {
                console.log(data);
            });
        }, timeout);
    }
    //run
    /**
                                     说明：触发任务执行
                                        ------
                                        地址格式：{执行器内嵌服务跟地址}/run
                                        Header：
                                            XXL-JOB-ACCESS-TOKEN : {请求令牌}
                                        请求数据格式如下，放置在 RequestBody 中，JSON格式：
                                            {
                                                "jobId":1,                                  // 任务ID
                                                "executorHandler":"demoJobHandler",         // 任务标识
                                                "executorParams":"demoJobHandler",          // 任务参数
                                                "executorBlockStrategy":"COVER_EARLY",      // 任务阻塞策略，可选值参考 com.xxl.job.core.enums.ExecutorBlockStrategyEnum
                                                "executorTimeout":0,                        // 任务超时时间，单位秒，大于零时生效
                                                "logId":1,                                  // 本次调度日志ID
                                                "logDateTime":1586629003729,                // 本次调度日志时间
                                                "glueType":"BEAN",                          // 任务模式，可选值参考 com.xxl.job.core.glue.GlueTypeEnum
                                                "glueSource":"xxx",                         // GLUE脚本代码
                                                "glueUpdatetime":1586629003727,             // GLUE脚本更新时间，用于判定脚本是否变更以及是否需要刷新
                                                "broadcastIndex":0,                         // 分片参数：当前分片
                                                "broadcastTotal":0                          // 分片参数：总分片
                                            }
                                        响应数据格式：
                                            {
                                            "code": 200,      // 200 表示正常、其他失败
                                            "msg": null       // 错误提示消息
                                            }
                                     */

    //callback
    /**
                                     * 说明：执行器执行完任务后，回调任务结果时使用
                                    ------
                                    地址格式：{调度中心跟地址}/callback
                                    Header：
                                        XXL-JOB-ACCESS-TOKEN : {请求令牌}
                                    请求数据格式如下，放置在 RequestBody 中，JSON格式：
                                        [{
                                            "logId":1,              // 本次调度日志ID
                                            "logDateTim":0,         // 本次调度日志时间
                                            "handle_code":200,
                                            "handle_message":"success",
                                            "executeResult":{
                                                "code": 200,        // 200 表示任务执行正常，500表示失败
                                                "msg": null
                                            }
                                        }]
                                    响应数据格式：
                                        {
                                        "code": 200,      // 200 表示正常、其他失败
                                        "msg": null      // 错误提示消息
                                        }
                                     */
    public async callback(url, body: any): Promise<any> {
        const options = {
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
            body: body,
        };
        const result = await this.httpRequest(options);
        return result;
    }

    private async httpRequest(options): Promise<any> {
        return new Promise((resolve, reject) => {
            request(options, (error: any, data: any) => {
                if (error) {
                    console.log(`=========请求失败·==========`);
                    console.log(error);
                    resolve(null);
                } else {
                    if (data.statusCode === 200) {
                        resolve(data.body);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
}
//docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://apollo-db:13306/xxl-job?Unicode=true&characterEncoding=UTF-8 --spring.datasource.username=root --spring.datasource.password=" -p 8080:8080 -v /tmp:/data/applogs --name xxl-job-admin
//--spring.datasource.url=jdbc:mysql://apollo-db:13306/xxl-job?Unicode=true&characterEncoding=UTF-8 --spring.datasource.username=root --spring.datasource.password=  --xxl.job.login.username=admin --xxl.job.login.password=admin
//docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://apollo-db:13306/xxl-job?Unicode=true&characterEncoding=UTF-8 --spring.datasource.username=root --spring.datasource.password=" -p 8080:8080 -v /tmp:/data/applogs --name xxljobadmin --link apollo-db:apollo-db training/xxl-job-admin

//sudo docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://172.17.0.6:3306/xxl_job?Unicode=true&characterEncoding=UTF-8 --spring.datasource.username=xxljobadmin  --spring.datasource.password=123456" -p 8080:8080 -v /tmp:/data/applogs --name xxl-job-admin  --privileged=true -d 24cc0d9dcf54
