import { Image, type ImageStyle } from 'expo-image';
import { useState } from 'react';
import type { StyleProp } from 'react-native';

import { CATEGORY_IMAGES } from '@/features/recipes/categories';
import type { Category } from '@/types/database';

type Props = { imageUrl: string | null; category: Category; style?: StyleProp<ImageStyle> };

/** Zeigt das Rezeptfoto – oder die Kategorie-Illustration, falls (noch) keins existiert oder es nicht lädt. */
export function RecipeImage({ imageUrl, category, style }: Props) {
  const [failed, setFailed] = useState(false);
  const placeholder = CATEGORY_IMAGES[category];
  const source = imageUrl && !failed ? { uri: imageUrl } : placeholder;
  return (
    <Image
      source={source}
      placeholder={placeholder}
      contentFit="cover"
      transition={200}
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
      accessible={false}
      style={style}
    />
  );
}
