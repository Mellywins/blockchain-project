import { ConfigService } from '@nestjs/config';
import { readdirSync } from 'fs';
import { LAYERS_PREFIX } from '../constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinataSDK = require('@pinata/sdk');
import admin from 'firebase-admin';

/**
 *  performs cartesian product of the provided asset arrays per each trait/attribute.
 * @returns The maximum number of NFTs that can be generated from the provided layers.
 */
export const calculateMaxCollectionSize = (): number =>
  readdirSync(LAYERS_PREFIX).reduce((acc, dir) => {
    if (dir && dir[0] !== '.') {
      return readdirSync(`${LAYERS_PREFIX}/${dir}`).length * acc;
    }
    return acc;
  }, 1);

/**
 *
 * @param map reference to the asset map that contain the layers.
 * @param assetsPath path to the assets directory.
 */
export const populateAssetMap = (
  map: Map<string, string[]>,
  assetsPath: string,
): void => {
  readdirSync(assetsPath).forEach((dir) => {
    if (dir && dir[0] !== '.') {
      map.set(dir, readdirSync(`${assetsPath}/${dir}`));
    }
  });
};

/**
 *
 * @param config instance of the config service.
 * @returns A configured instance of the PINATA SDK Client.
 */
export const pinataSetupGuard = async (config: ConfigService) => {
  const pinataApiKey = config.get('API_Key');
  const pinataSecretApiKey = config.get('API_Secret');
  if (!pinataApiKey || !pinataSecretApiKey) {
    throw new Error('Pinata API key or secret not found');
  }
  const pinata = new pinataSDK({
    pinataApiKey,
    pinataSecretApiKey,
  });
  await pinata.testAuthentication().catch((err) => {
    console.error('Pinata authentication failed with error: ', err);
    process.exit(1);
  });
  return pinata;
};
/**
 *
 * @returns A configured instance of the Firebase Admin SDK.
 */
export const firebaseSetupGuard = () => {
  admin.initializeApp({
    credential: admin.credential.cert(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../firebase-service-account.json'),
    ),
    storageBucket: 'wow-antiafk.appspot.com',
  });
  return admin.storage().bucket();
};
