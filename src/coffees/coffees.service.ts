import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Coffee } from './entities/coffee.entity';
import { Connection, Model, ObjectId } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { Event } from './entities/event.entity';
// import { COFFEE_BRANDS } from './coffees.constants';

// Sample implementation without a real database
// Services hold the meat of our business logic along with interactions with data sources

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>, // Non ClassBased Provider
    // private readonly configService: ConfigService, // @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    // console.log(coffeeBrands);
    // const databaseHost = this.configService.get('database.host');
    // console.log(databaseHost);
    // console.log(coffeesConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  // async findOne(id: string) {
  //   try {
  //     const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
  //     return coffee;
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   // if (!coffee) {
  //   //   // throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
  //   //   throw new NotFoundException(`Coffee #${id} not found`);
  //   // }
  // }

  // async findOne(id: string) {
  //   try {
  //     const coffee = await this.coffeeModel.findOne({ _id: id }).exec();

  //     if (!coffee) {
  //       throw new NotFoundException(`Coffee with ID ${id} not found`);
  //     }

  //     return coffee;
  //   } catch (err) {
  //     console.log(err);
  //     throw new NotFoundException(`Coffee with ID ${id} not found`);
  //   }
  // }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existingCoffee;
  }
  async remove(id: string) {
    const coffee = await this.findOne(id);
    return coffee.deleteOne();
  }

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
