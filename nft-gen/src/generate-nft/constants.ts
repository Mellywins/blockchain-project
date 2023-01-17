export const LAYERS_PREFIX = './dist/assets/Layers';
export const OUTPUT_PREFIX = './dist/assets/Output';
export const Rarity = {
  COMMON: 50,
  UNCOMMON: 75,
  RARE: 90,
  LEGENDARY: 100,
} as const;

// This is ordered according to the layers
export const Attributes = {
  BACKGROUND: 'Background',
  BODY: 'Body',
  OUTFITS: 'Outfits',
  EYES: 'Eyes',
  MOUTHS: 'Mouths',
  FACIAL: 'Facial',
  GLASSES: 'Glasses',
} as const;

export const ADJECTIVES =
  'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(
    ' ',
  );
export const NAMES =
  'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(
    ' ',
  );
