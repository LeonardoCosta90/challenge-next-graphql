import {
   Args,
   Mutation,
   Query,
   Resolver,
   Parent,
   ResolveField,
   Subscription,
   Context,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import RepoService from '../repo.service';
import Message from '../db/models/message.entity';
import MessageInput from './input/message.input';
import User from '../db/models/user.entity';
import { context } from 'src/db/loaders';

export const pubSub = new PubSub();

@Resolver(() => Message)
export default class MessageResolver {
   constructor(private readonly repoService: RepoService) { }

   @Query(() => [Message])
   public async getMessages(): Promise<Message[]> {
      return this.repoService.messageRepo.find();
   }

   @Query(() => [Message])
   public async getMessagesFromUser(
      @Args('userId') userId: number,
   ): Promise<Message[]> {
      return this.repoService.messageRepo.find({
         where: { userId },
      });
   }

   @Query(() => Message, { nullable: true })
   public async getMessage(@Args('id') id: number): Promise<Message> {
      return this.repoService.messageRepo.findOne(id);
   }

   @Mutation(() => Message)
   public async createMessage(
      @Args('data') input: MessageInput,
   ): Promise<Message> {
      const message = this.repoService.messageRepo.create({
         userId: input.userId,
         content: input.content
      });

      return await this.repoService.messageRepo.save(message);

   }


   @Subscription(() => Message)
   messageAdded() {
      return pubSub.asyncIterator('messageAdded');
   }

   @ResolveField(() => User, { name: 'user' })
   public async getUser(
      @Parent() parent: Message,
      @Context() { UserLoader }: typeof context,
   ): Promise<User> {
      return UserLoader.load(parent.userId); // With DataLoader
      // return this.repoService.userRepo.findOne(parent.userId); // Without DataLoader
   }
}