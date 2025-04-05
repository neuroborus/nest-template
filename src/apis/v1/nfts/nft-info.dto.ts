import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { NftInfo } from '@/entities/nft';

@Exclude()
export class NftInfoDto implements NftInfo {
  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: 'PudgyPenguins' })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '8888' })
  totalMint: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, example: '8888' })
  totalSupply: string;

  @Expose()
  @IsString()
  @ApiProperty({
    type: String,
    example:
      'ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/',
  })
  baseTokenURI: string;
}
