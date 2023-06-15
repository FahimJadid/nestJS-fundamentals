import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from './../common/pipes/parse-int/parse-int.pipe';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees') //the coffees string passes the Metadata needed for Nest to create a routing map. Tying incoming reqs to this corresponding controller.
export class CoffeesController {
  // to inject a provider we can use constructors!
  constructor(private readonly coffeesService: CoffeesService) {}

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UsePipes(ValidationPipe)
  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.coffeesService.findOne(id);
  }

  @Public()
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
