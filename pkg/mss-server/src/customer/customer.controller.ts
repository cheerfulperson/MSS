import { Body, Controller, Get, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('hello')
  getHello(@Req() req: Request): string {
    return this.customerService.getHello();
  }
}
