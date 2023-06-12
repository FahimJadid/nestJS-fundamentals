import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { Event, EventSchema } from './entities/event.entity';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// import { COFFEE_BRANDS } from './coffees.constants';

// class MockCoffeesService {}

// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeeSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    ConfigModule.forFeature(coffeesConfig),
  ],

  controllers: [CoffeesController],
  providers: [CoffeesService],
  // Mock value based provider
  // providers: [{ provide: CoffeesService, useValue: new MockCoffeesService() }],
  // Non classBased Provider
  // providers: [
  //   CoffeesService,
  //   { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
  // ],

  // UseClass Providers
  // providers: [
  //   CoffeesService,
  //   {
  //     provide: ConfigService,
  //     useClass:
  //       process.env.NODE_ENV === 'development'
  //         ? DevelopmentConfigService
  //         : ProductionConfigService,
  //   },
  // ],

  // Factory Providers
  // Non classBased Provider
  // providers: [
  //   CoffeesService,
  //   { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },
  // ],

  exports: [CoffeesService],
})
export class CoffeesModule {}
