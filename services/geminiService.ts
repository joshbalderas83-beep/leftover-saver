import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppMode, UserInputs, RecipeData } from "../types";

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING, description: "菜品名称，朴实、通俗易懂，像家常菜或经典餐厅菜名，不要过于花哨或难懂" },
    visualPrompt: { type: Type.STRING, description: "用于AI生成的详细英文提示词 (Photorealistic food photography, 8k resolution, soft lighting, close up)" },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING, description: "例如：450 kcal" },
        protein: { type: Type.STRING, description: "例如：25 g" },
        carbs: { type: Type.STRING, description: "例如：30 g" },
        fat: { type: Type.STRING, description: "例如：15 g" },
        comment: { type: Type.STRING, description: "简短的营养点评" },
      },
      required: ["calories", "protein", "carbs", "fat", "comment"],
    },
    pairing: {
      type: Type.OBJECT,
      properties: {
        drink: { type: Type.STRING, description: "推荐的酒或饮料" },
        reason: { type: Type.STRING, description: "搭配理由" },
      },
      required: ["drink", "reason"],
    },
    chef: {
      type: Type.OBJECT,
      properties: {
        prepTime: { type: Type.STRING, description: "准备时间" },
        cookTime: { type: Type.STRING, description: "烹饪时间" },
        difficulty: { type: Type.INTEGER, description: "1 到 5 星" },
        ingredients: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "食材名称" },
              amount: { type: Type.STRING, description: "精确数量 (克/毫升/个)，禁止使用'适量'" },
            },
            required: ["name", "amount"],
          },
        },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timeRange: { type: Type.STRING, description: "时间范围，例如 00:00 - 05:00" },
              description: { type: Type.STRING, description: "步骤描述" },
            },
            required: ["timeRange", "description"],
          },
        },
        finishingTouch: { type: Type.STRING, description: "最后的摆盘或点缀" },
      },
      required: ["prepTime", "cookTime", "difficulty", "ingredients", "steps", "finishingTouch"],
    },
    metaphysical: {
      type: Type.OBJECT,
      properties: {
        analysis: { type: Type.STRING, description: "玄学分析 (星座/心情/数字)" },
      },
    },
  },
  required: ["dishName", "visualPrompt", "nutrition", "pairing", "chef"],
};

export const generateRecipe = async (mode: AppMode, inputs: UserInputs): Promise<RecipeData> => {
const apiKey = "AIzaSyBxBaQYAo6kY_7gLOXzruLV4PcEToUtxcs"; 
  if (!apiKey) throw new Error("API_KEY not found in environment variables");

  const ai = new GoogleGenAI({ apiKey });

  // 1. Generate Text Recipe
  let systemInstruction = `你是一个全能的“AI 烹饪超能中控台”。
  
  核心规则:
  1. 精准性: 使用精确的克(g)、毫升(ml)。
  2. 命名: 菜名必须朴实、亲切、让人一眼看懂（例如“香煎脆皮鸡”而不是“凤凰涅槃”）。
  3. 视觉: visualPrompt 必须是高质量的英文摄影提示词。
  4. 语言: 除 visualPrompt 外，所有内容使用简体中文。
  `;

  const parts: any[] = [];

  switch (mode) {
    case AppMode.LEFTOVERS:
      let promptText = `模式: [冰箱剩菜].`;
      
      if (inputs.ingredients) {
         promptText += ` 用户提供的文字食材描述: ${inputs.ingredients}.`;
      }
      
      if (inputs.ingredientImage) {
        promptText += ` 用户还提供了一张冰箱/食材的照片，请优先识别照片中的食材。`;
        
        // Handle image attachment
        const base64Data = inputs.ingredientImage.split(',')[1]; // Remove data URL prefix
        const mimeType = inputs.ingredientImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
        
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: base64Data
            }
        });
      }
      
      promptText += ` 菜系: ${inputs.cuisine || "家常"}. 请根据所有可用食材设计一道好吃又好做的菜。`;
      parts.push({ text: promptText });
      break;

    case AppMode.BLIND_BOX:
      parts.push({ text: `模式: [美食盲盒]. 忌口: ${inputs.dietaryRestrictions || "无"}. 给用户一个惊喜，做一道有趣但好吃的菜。` });
      break;

    case AppMode.METAPHYSICAL:
      parts.push({ text: `模式: [玄学推荐]. 星座: ${inputs.zodiac}. 心情: ${inputs.mood}. 幸运数字: ${inputs.luckyNumber}. 请根据这些元素推荐一道治愈系美食。` });
      break;
  }

  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      },
    });

    const text = textResponse.text;
    if (!text) throw new Error("No response from AI");
    
    const recipeData = JSON.parse(text) as RecipeData;

    // 2. Generate Image based on the visual prompt
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: recipeData.visualPrompt }]
        },
        config: {
          // No responseMimeType for image model
        }
      });

      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          recipeData.imageUrl = `data:image/png;base64,${base64String}`;
          break;
        }
      }
    } catch (imgError) {
      console.error("Image generation failed:", imgError);
      // Fallback: We just won't have an image, the UI should handle this.
    }

    return recipeData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
