import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

const Validate = createParamDecorator((dtoClass: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const body = request.body

  const dtoInstance = plainToInstance(dtoClass, body)
  const errors = validateSync(dtoInstance, { whitelist: true })

  if (errors.length > 0) {
    const missingProperties = errors.map(err => err.property)
    throw new BadRequestException(`Missing required properties: ${missingProperties.join(', ')}`)
  }

  return body
})

export default Validate
