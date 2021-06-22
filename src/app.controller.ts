import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { xxlJobExcutorClass } from './core/xxljob.excutor';
@Controller()
export class AppController {
  @Inject()
  private xxljobExcutor: xxlJobExcutorClass;
  @Inject()
  private readonly appService: AppService;
  constructor() {
    //
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  /**
   * {
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
   * @returns 
   */
  @HttpCode(200)
  @Post('/run')
  run(@Body() body: any) {
    const data = [
      {
        logId: body.logId, // 本次调度日志ID
        logDateTim: body.logDateTime, // 本次调度日志时间
        handle_code: 500,
        handle_message: 'success',
      },
    ];
    const callbackUrl = `${process.env.xxljobadminurl}/api/callback`;
    this.xxljobExcutor.callback(callbackUrl, data).then((data) => {
      console.log(data);
    });
    return { code: 200, msg: 'success' };
  }
}
