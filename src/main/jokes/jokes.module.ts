import { Module } from '@nestjs/common'
import { JokesService } from './jokes.service'
import { JokesController } from './jokes.controller'

@Module({
  providers: [JokesService],
  controllers: [JokesController]
})
export class JokesModule {}
