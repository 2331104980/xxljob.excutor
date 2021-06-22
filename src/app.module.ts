import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { xxlJobExcutorClass } from './core/xxljob.excutor';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, xxlJobExcutorClass],
})
export class AppModule { }
