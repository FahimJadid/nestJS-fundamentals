import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { CoffeesModule } from './coffees/coffees.module';
import appConfig from './config/app.config';
// console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

// const databaseString = process.env.DATABASE_URL;
// const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     DB_TYPE: Joi.string().required(),
    //     DB_USERNAME: Joi.string().required(),
    //     DB_PASSWORD: Joi.string().required(),
    //     DB_HOST: Joi.string().required(),
    //     DB_NAME: Joi.string().required(),
    //     DB_OPTIONS: Joi.string().required(),
    //   }),
    // }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    CoffeesModule,
    // MongooseModule.forRoot(databaseUrl), // local
    // MongooseModule.forRoot(databaseString), // remote
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.DB_TYPE}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?${process.env.DB_OPTIONS}`,
      }),
    }),
    CoffeeRatingModule, // Remote
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
