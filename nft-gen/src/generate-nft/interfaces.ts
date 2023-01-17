export interface GenerateOptions {
  number?: number;
  assets?: string;
  output?: string;
  upload?: boolean;
}

/**
 * {
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
  "external_url": "https://openseacreatures.io/3", 
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
  "name": "Dave Starbelly",
  "attributes": [ ... ]
}
 */
export interface NftMetadata {
  description: string;
  external_url?: string;
  image: string;
  name: string;
  attributes: NftAttribute[];
}

export interface NftAttribute {
  trait_type: string;
  value: string;
}
