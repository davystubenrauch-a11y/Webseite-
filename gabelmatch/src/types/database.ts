/**
 * Typen der Supabase-Datenbank (entsprechen supabase/migrations/*).
 * Kann später mit `npx supabase gen types typescript --linked > src/types/database.ts`
 * automatisch neu erzeugt werden.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Category =
  | 'pasta'
  | 'reis_getreide'
  | 'suppen_eintoepfe'
  | 'salate'
  | 'ofen_auflauf'
  | 'pfanne_wok'
  | 'kartoffeln'
  | 'brot_snacks'
  | 'fruehstueck_suesses';
export type Diet = 'vegan' | 'vegetarisch' | 'fisch' | 'fleisch';
export type DietFilter = 'vegetarisch' | 'vegan';
export type MaxMinutes = 15 | 30 | 60;
export type Locale = 'de' | 'en';

type Rel<Name extends string, Col extends string, Ref extends string> = {
  foreignKeyName: Name;
  columns: [Col];
  isOneToOne: false;
  referencedRelation: Ref;
  referencedColumns: ['id'];
};

type Table<Row, Insert, Update, Relationships extends unknown[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type ProfileRow = {
  id: string;
  display_name: string;
  avatar_emoji: string;
  locale: Locale;
  push_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type IngredientRow = {
  id: string;
  name_de: string;
  name_en: string;
  aisle: string;
  is_staple: boolean;
};

export type RecipeRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  diet: Diet;
  total_minutes: number;
  difficulty: 1 | 2 | 3;
  servings: number;
  image_url: string | null;
  steps: string[];
  translations: Json;
  created_at: string;
};

export type RecipeIngredientRow = {
  recipe_id: string;
  position: number;
  ingredient_id: string;
  amount: number | null;
  unit: string | null;
  note: string | null;
};

export type GroupRow = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
};

export type GroupMemberRow = {
  group_id: string;
  user_id: string;
  role: 'owner' | 'member';
  is_active: boolean;
  joined_at: string;
};

export type SessionRow = {
  id: string;
  group_id: string;
  status: 'active' | 'matched' | 'closed';
  max_minutes: MaxMinutes | null;
  diet: DietFilter | null;
  category: Category | null;
  created_by: string | null;
  created_at: string;
  matched_at: string | null;
};

export type SwipeRow = {
  session_id: string;
  user_id: string;
  recipe_id: string;
  group_id: string;
  liked: boolean;
  created_at: string;
};

export type MatchRow = {
  id: string;
  group_id: string;
  session_id: string;
  recipe_id: string;
  created_at: string;
};

export type PantryRow = {
  group_id: string;
  ingredient_id: string;
  added_by: string | null;
  created_at: string;
};

export type ShoppingItemRow = {
  id: string;
  group_id: string;
  ingredient_id: string | null;
  recipe_id: string | null;
  label: string;
  quantity: string | null;
  checked: boolean;
  added_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PushTokenRow = {
  token: string;
  user_id: string;
  platform: 'ios' | 'android' | 'web';
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Partial<ProfileRow> & { id: string }, Partial<ProfileRow>>;
      ingredients: Table<IngredientRow, IngredientRow, Partial<IngredientRow>>;
      recipes: Table<RecipeRow, Partial<RecipeRow>, Partial<RecipeRow>>;
      recipe_ingredients: Table<
        RecipeIngredientRow,
        RecipeIngredientRow,
        Partial<RecipeIngredientRow>,
        [
          Rel<'recipe_ingredients_recipe_id_fkey', 'recipe_id', 'recipes'>,
          Rel<'recipe_ingredients_ingredient_id_fkey', 'ingredient_id', 'ingredients'>,
        ]
      >;
      groups: Table<GroupRow, never, { name?: string }>;
      group_members: Table<
        GroupMemberRow,
        never,
        { is_active?: boolean },
        [
          Rel<'group_members_group_id_fkey', 'group_id', 'groups'>,
          Rel<'group_members_user_id_fkey', 'user_id', 'profiles'>,
        ]
      >;
      sessions: Table<
        SessionRow,
        never,
        Partial<Pick<SessionRow, 'max_minutes' | 'diet' | 'category'>>,
        [Rel<'sessions_group_id_fkey', 'group_id', 'groups'>]
      >;
      swipes: Table<
        SwipeRow,
        { session_id: string; user_id: string; recipe_id: string; liked: boolean },
        { liked?: boolean },
        [Rel<'swipes_session_id_fkey', 'session_id', 'sessions'>, Rel<'swipes_recipe_id_fkey', 'recipe_id', 'recipes'>]
      >;
      matches: Table<
        MatchRow,
        never,
        never,
        [Rel<'matches_recipe_id_fkey', 'recipe_id', 'recipes'>, Rel<'matches_group_id_fkey', 'group_id', 'groups'>]
      >;
      group_pantry: Table<PantryRow, { group_id: string; ingredient_id: string; added_by: string }, never>;
      shopping_items: Table<
        ShoppingItemRow,
        {
          group_id: string;
          label: string;
          added_by: string;
          ingredient_id?: string | null;
          recipe_id?: string | null;
          quantity?: string | null;
        },
        { label?: string; quantity?: string | null; checked?: boolean }
      >;
      push_tokens: Table<
        PushTokenRow,
        { token: string; user_id: string; platform: PushTokenRow['platform']; updated_at?: string },
        Partial<PushTokenRow>
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      create_group: { Args: { p_name: string }; Returns: GroupRow };
      join_group: { Args: { p_code: string }; Returns: GroupRow };
      leave_group: { Args: { p_group_id: string }; Returns: undefined };
      regenerate_invite_code: { Args: { p_group_id: string }; Returns: string };
      start_session: {
        Args: {
          p_group_id: string;
          p_max_minutes?: MaxMinutes | null;
          p_diet?: DietFilter | null;
          p_category?: Category | null;
        };
        Returns: SessionRow;
      };
      delete_account: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
