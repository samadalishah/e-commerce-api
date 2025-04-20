import { Controller, Get } from '@nestjs/common'
import { JokesService } from './jokes.service'

@Controller('jokes')
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  @Get()
  async getUser(): Promise<string> {
    return this.jokesService.generateText()
  }
}
