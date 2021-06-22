import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IPClass } from './core/ip.core';
import { xxlJobExcutorClass } from './core/xxljob.excutor';
async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  const ip = await IPClass.getIp('', '');
  console.log(ip);
  const xxlJobExcutor: xxlJobExcutorClass = new xxlJobExcutorClass();
  // const registryGroup = 'EXECUTOR';
  const registryKey = 'nodejstest';
  const registryValue = `http://${ip}:${port}/`;

  const xxlJobAdminUrl = `${process.env.xxljobadminurl}/api/registry`; //`http://pc.vanelink:8080/xxl-job-admin/api/registry`;
  xxlJobExcutor.registry(registryKey, registryValue, xxlJobAdminUrl, 3000);
}
bootstrap();
