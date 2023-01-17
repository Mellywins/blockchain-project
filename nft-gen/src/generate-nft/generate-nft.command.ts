import { ConfigService } from '@nestjs/config';
import { Command, CommandRunner, Option } from 'nest-commander';
import { LAYERS_PREFIX, OUTPUT_PREFIX } from './constants';
import { generator, generatorLoop } from './helpers/generator';
import {
  calculateMaxCollectionSize,
  firebaseSetupGuard,
  pinataSetupGuard,
  populateAssetMap,
} from './helpers/helpers';
import { GenerateOptions } from './interfaces';
@Command({
  name: 'generate',
  description: 'Generates a collection of NFTs from the provided layers.',
  options: {
    isDefault: true,
  },
})
export class GenerateNftCommand extends CommandRunner {
  private assetMap: Map<string, string[]> = new Map();
  private storageBucket;
  private pinataClient;
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(passedParam: string[], options?: GenerateOptions): Promise<void> {
    // This function will read png images from the provided directory and generate a collection of unique NFTs.
    console.log('Generating NFTs');
    console.log(`Max collection size: ${calculateMaxCollectionSize()}`);
    console.log(`Number of NFTs to generate: ${options.number}`);
    populateAssetMap(this.assetMap, options.assets);
    if (options.upload) {
      console.log(
        '--upload flag detected, initializing Firebase & Pinata connectors...',
      );
      this.pinataClient = await pinataSetupGuard(this.configService);
      this.storageBucket = firebaseSetupGuard();
    }
    generatorLoop(this.assetMap, generator, options, {
      storageBucket: this.storageBucket,
      pinataClient: this.pinataClient,
    });
  }
  @Option({
    flags: '-n, --number [number]',
    description: 'number of NFTs to generate',
    defaultValue: 1,
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-assets, --assets [assets]',
    description: 'assets to use for generation',
    defaultValue: LAYERS_PREFIX,
  })
  parseAssets(val: string): string {
    return val;
  }

  @Option({
    flags: '-o, --output [output]',
    description: 'output directory',
    defaultValue: OUTPUT_PREFIX,
  })
  parseOutput(val: string): string {
    return val;
  }

  @Option({
    flags: '-upload, --upload [upload]',
    description: 'Include this flag to upload to Pinata',
    defaultValue: false,
  })
  parseUpload(val: string): boolean {
    return val === 'true';
  }
}
