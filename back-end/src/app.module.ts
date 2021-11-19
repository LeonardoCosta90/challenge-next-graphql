import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as ormOptions from './config/orm'
import RepoModule from './repo.module';
import UserResolve from './resolvers/user.resolver'

const gqlImport = [
  UserResolve
]
@Module({
  imports: [TypeOrmModule.forRoot(ormOptions), RepoModule, ...gqlImport, GraphQLModule.forRoot({
    autoSchemaFile: 'schema.gql'
  })],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
