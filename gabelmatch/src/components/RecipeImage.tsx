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
  const remote = !!imageUrl && !failed;
  return (
    <Image
      source={remote ? { uri: imageUrl } : placeholder}
      placeholder={remote ? placeholder : undefined}
      contentFit="cover"
      transition={remote ? 200 : 0}
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
      accessible={false}
      style={style}
    />
  );
}
