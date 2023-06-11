import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { MongooseModule } from '@nestjs/mongoose';

// console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

const databaseString = process.env.DATABASE_URL;
// const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    CoffeesModule,
    // MongooseModule.forRoot(databaseUrl), // local
    MongooseModule.forRoot(databaseString), // Remote
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
