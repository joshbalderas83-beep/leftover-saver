export enum AppMode {
  LEFTOVERS = 'LEFTOVERS',
  BLIND_BOX = 'BLIND_BOX',
  METAPHYSICAL = 'METAPHYSICAL',
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface CookingStep {
  timeRange: string;
  description: string;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  comment: string;
}

export interface RecipeData {
  dishName: string;
  visualPrompt: string;
  imageUrl?: string; // Added field for the generated image
  nutrition: NutritionInfo;
  pairing: {
    drink: string;
    reason: string;
  };
  chef: {
    prepTime: string;
    cookTime: string;
    difficulty: number;
    ingredients: Ingredient[];
    steps: CookingStep[];
    finishingTouch: string;
  };
  metaphysical?: {
    analysis: string;
  };
}

export interface UserInputs {
  ingredients: string;
  ingredientImage?: string; // Base64 string for the uploaded fridge photo
  cuisine: string;
  dietaryRestrictions: string;
  zodiac: string;
  mood: string;
  luckyNumber: string;
}