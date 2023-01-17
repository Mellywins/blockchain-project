import { Attributes } from '../constants';

/**
 *
 * @param assetMap the map of attributes to assets
 * @returns Object[] of trait_type and layer
 */
export const fetchTraits = (
  assetMap: Map<string, string[]>,
): { trait_type: string; layer: string }[] => {
  return Object.values(Attributes).reduce((acc, value) => {
    acc.push({
      trait_type: value,
      layer:
        assetMap.get(value).length > 2
          ? assetMap
              .get(value)
              .at(Math.floor(Math.random() * assetMap.get(value).length))
          : Math.random() > 0.5
          ? assetMap
              .get(value)
              .at(Math.floor(Math.random() * assetMap.get(value).length))
          : undefined,
    });
    return acc;
  }, []);
};
