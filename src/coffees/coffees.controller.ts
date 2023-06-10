import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees') //the coffees string passes the Metadata needed for Nest to create a routing map. Tying incoming reqs to this corresponding controller.
export class CoffeesController {
  // to inject a provider we can use constructors!
  constructor(private readonly coffeesService: CoffeesService) {}

  // New method called findAll()
  // Recommended Get response
  //   @Get('flavours')
  //   findAll() {
  //     return 'This action returns all coffees flavours';
  //   }

  // Not Recommended Get response

  //   @Get()
  //   findAll(@Res() response) {
  //     response.status(200).send('This action returns all coffees flavours');
  //   }

  //   Pagination Query
  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;

    return this.coffeesService.findAll();
    // return `This action returns all limit: ${limit} and offset: ${offset}`;
  }

  // Routes with static paths won't work when you need to accept dynamic data as part of your request.
  // New method called findOne()
  @Get(':id') // ":id" this signifies that we're expecting a dynamic route parameter named "id"
  findOne(@Param('id') id: string) {
    // findOne(@Param() params) { // for entire parameters
    // @Param decorator lets us grab all incoming request parameters and use them inside of the function body of our method. When we don't pass anything inside of the @Param() decorator, we receive all req parameters, letting us access params.id from the object. But sometimes we don't want to access the entire params object. With the @Param() decorator, we have the option of passing in a string inside of it to access a specific portion of the params.
    // return `This action return #${id} coffee`;
    return this.coffeesService.findOne(id);
  }

  @Post()
  //   @HttpCode(HttpStatus.GONE)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    // create(@Body('name') body) { // only name value
    // create(@Body() body) { // for entire body
    // return body;
    return this.coffeesService.create(createCoffeeDto);
  }

  //   Patch for partial update of a single resource. Requires both Id and payload of the all values of the given resource
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    // return `This action updates #${id} coffee`;
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return `This action removes #${id} coffee`;
    return this.coffeesService.remove(id);
  }
}
