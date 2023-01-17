import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerateNftCommand } from './generate-nft/generate-nft.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [GenerateNftCommand],
})
export class AppModule {}
