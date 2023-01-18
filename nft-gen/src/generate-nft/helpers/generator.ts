import { writeFileSync } from 'fs';
import Jimp, { read } from 'jimp';
import { Readable } from 'stream';
import { ADJECTIVES, NAMES } from '../constants';
import { GenerateOptions, NftMetadata } from '../interfaces';
import { fetchTraits } from './traits';

/**
 *
 * @param assets the map of attributes to assets
 * @param generator the generation function that will be called on each iteration.
 * @param options Generate options passed from the command line.
 * @param uploadClients the upload clients for Firebase and Pinata. only used if the --upload flag is passed.
 */
export const generatorLoop = async (
  assets: Map<string, string[]>,
  generator: (...args: any[]) => void,
  options: GenerateOptions,
  uploadClients: { storageBucket: any; pinataClient: any },
) => {
  for (let i = 0; i < options.number; i++) {
    try {
      generator(i, assets, options, uploadClients);
      await sleep(20);
    } catch (e) {
      console.error(
        'Encountered error while generating NFT ',
        i,
        ' with error: ',
        e,
      );
      process.exit(1);
    }
  }
};

/**
 *
 * @param iteration the iteration number.
 * @param assets reference to the asset map that contain the layers.
 * @param param2 Generate options passed from the command line.
 * @param uploadClients the upload clients for Firebase and Pinata. only used if the --upload flag is passed.
 */
export const generator = async (
  iteration: number,
  assets: Map<string, string[]>,
  { assets: assetsPath, output }: GenerateOptions,
  uploadClients: { storageBucket: any; pinataClient: any },
): Promise<void> => {
  const _traits = fetchTraits(assets);
  console.log(_traits);
  const composedImage = await _traits.reduce<ReturnType<typeof read>>(
    async (canvas, trait) => {
      if (trait.trait_type === 'Background' || trait.layer === undefined) {
        return (await canvas).resize(3000, 3000);
      }
      (await canvas).blit(
        await read(`${assetsPath}/${trait.trait_type}/${trait.layer}`),
        0,
        0,
      );
      return canvas;
    },
    read(`${assetsPath}/Background/${_traits[0].layer}`),
  );

  const imageName = `${iteration}`;
  await composedImage.write(`${output}/${imageName}.png`);
  await sleep(20);
  if (uploadClients.storageBucket && uploadClients.pinataClient) {
    const imageFirebaseMetadata = await uploadToFirebase(
      `${output}/${imageName}.png`,
      uploadClients?.storageBucket,
    );
    composedImage.getBuffer('image/png', async (err, buffer) => {
      if (err) throw err;
      console.log('About to upload to Pinata');

      const metadata = createMetadata(_traits, imageName, {
        imageFirebaseMetadata,
      });
      const ipfsData = await uploadToPinata(
        Buffer.from(JSON.stringify(metadata)),
        imageName,
        uploadClients?.pinataClient,
      ).then((res) => {
        console.log('Finished uploading to Pinata', res);
        return res;
      });

      writeFileSync(
        `${output}/${imageName}.json`,
        JSON.stringify({ ...metadata, cid: ipfsData.IpfsHash }),
      );
      await uploadToFirebase(
        `${output}/${imageName}.json`,
        uploadClients?.storageBucket,
      );
    });
  }

  console.log(`Generated NFT ${output}/${imageName}.png successfully`);
};
/**
 *
 * @param ms the number of milliseconds to sleep for.
 * @returns a Promise that resolves after the specified number of milliseconds.
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 *
 * @param traits The traits of the NFT
 * @param name The NFT name
 * @param extraData Extra data to be added to the metadata, like the IPFS Hash
 * @returns NftMetadata
 */
export const createMetadata = (
  traits: ReturnType<typeof fetchTraits>,
  name: string,
  extraData: Record<string, any> = {},
): NftMetadata => {
  const _baseBucket =
    'https://firebasestorage.googleapis.com/v0/b/wow-antiafk.appspot.com/o/';
  return traits.reduce(
    (acc, trait) => {
      return trait.layer !== undefined
        ? {
            ...acc,
            attributes: [
              ...acc.attributes,
              {
                trait_type: trait.trait_type,
                value: trait.layer.slice(trait.layer.indexOf('#') + 1, -4),
              },
            ],
          }
        : acc;
    },
    {
      name,
      description: `The description of the NFT ${name}`,
      image: _baseBucket + name + '.png?alt=media',
      //https://gateway.pinata.cloud/ipfs/
      external_url: '',
      attributes: [],
    },
  );
};

const uploadToFirebase = async (
  imagePath: string,
  storageBucket: any,
  __metadata = false,
) => {
  return await storageBucket
    .upload(imagePath, {
      destination: __metadata
        ? `/metadata/${imagePath.slice(imagePath.lastIndexOf('/') + 1)}`
        : `${imagePath.slice(imagePath.lastIndexOf('/') + 1)}`,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    })
    .catch((e) => {
      console.error('Error while uploading to Firebase: ', e);
      process.exit(1);
    })
    .then((data) => {
      console.log('Uploaded to Firebase successfully');
    });
};
const uploadToPinata = async (
  imageBuffer: Buffer,
  imageName: string,
  pinataClient: any,
): Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }> => {
  return await pinataClient
    .pinFileToIPFS(Readable.from(imageBuffer), {
      pinataMetadata: {
        name: imageName,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    })
    .catch((e) => {
      console.error('Error while uploading to Pinata: ', e);
      process.exit(1);
    })
    .then((data) => {
      console.log('Uploaded to Pinata, data:', data);
      return data;
    });
};
