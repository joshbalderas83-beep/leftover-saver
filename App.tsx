import React, { useState, useRef } from 'react';
import { AppMode, UserInputs, RecipeData } from './types';
import { generateRecipe } from './services/geminiService';
import RecipeCard from './components/RecipeCard';
import { Refrigerator, Gift, Sparkles, ChefHat, Loader2, Wand2, X, Search, ChevronRight, Camera, ImagePlus } from 'lucide-react';

const INITIAL_INPUTS: UserInputs = {
  ingredients: '',
  cuisine: '',
  dietaryRestrictions: '',
  zodiac: '白羊座',
  mood: '开心',
  luckyNumber: '7',
  ingredientImage: undefined,
};

// Data Constants
const CUISINE_OPTIONS = [
  '川湘麻辣', '粤式清淡', '东北酱香', '江浙鲜甜', 
  '西北面食', '云贵酸辣', '鲁菜咸鲜', '东南亚风', 
  '日式和风', '西式简餐', '韩式辛辣', '减脂轻食'
];

const ZODIAC_SIGNS = [
  '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', 
  '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'
];

const MOODS = [
  '开心 😄', '压力大 😫', '精力充沛 ⚡', '忧郁 🌧️', '想发疯 🤪', '佛系 🧘'
];

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.LEFTOVERS);
  const [inputs, setInputs] = useState<UserInputs>(INITIAL_INPUTS);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSelection = (key: keyof UserInputs, value: string) => {
    setInputs(prev => ({
        ...prev,
        [key]: prev[key] === value ? '' : value // Toggle
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs(prev => ({ ...prev, ingredientImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setInputs(prev => ({ ...prev, ingredientImage: undefined }));
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);

    const finalInputs = { ...inputs };
    if (mode === AppMode.LEFTOVERS && !finalInputs.cuisine) finalInputs.cuisine = "家常口味";
    
    try {
      const data = await generateRecipe(mode, finalInputs);
      setRecipe(data);
    } catch (err: any) {
      setError("主厨此刻太忙了，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Brand Header */}
      <header className="flex flex-col items-center mb-12 mt-6 text-center w-full max-w-lg">
        <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl text-[#5D5A53] mb-2 font-display tracking-wider relative z-10">
                五行缺吃
            </h1>
            <div className="absolute -top-4 -right-8 bg-[#FFD1BA] text-[#5D5A53] px-3 py-1 rounded-full text-sm font-bold shadow-sm rotate-12">
                v2.0 Lite
            </div>
             <div className="absolute bottom-2 left-0 w-full h-3 bg-[#C1E1C1]/50 -z-0 rounded-full"></div>
        </div>
        <p className="text-lg text-stone-400 mt-2 font-medium tracking-widest">
           小卷的 AI 剩菜拯救专家
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl relative pb-20">
        
        {/* Input Screen */}
        {!recipe && (
          <div className="space-y-10 animate-fade-in-up">
            
            {/* 3D Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setMode(AppMode.LEFTOVERS)}
                className={`mode-card relative h-48 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden group text-left ${
                    mode === AppMode.LEFTOVERS ? 'active bg-[#F0F9F0]' : 'bg-white'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-8 -mt-8 transition-colors ${
                     mode === AppMode.LEFTOVERS ? 'bg-[#C1E1C1]' : 'bg-stone-100 group-hover:bg-[#C1E1C1]/50'
                }`}></div>
                <div className="relative z-10 p-3 bg-white rounded-2xl w-fit shadow-sm">
                    <Refrigerator size={28} className={mode === AppMode.LEFTOVERS ? 'text-[#8FB58F]' : 'text-stone-400'} />
                </div>
                <div className="relative z-10">
                    <h3 className={`text-2xl font-display mb-1 ${mode === AppMode.LEFTOVERS ? 'text-[#5D5A53]' : 'text-stone-400'}`}>冰箱剩菜</h3>
                    <p className={`text-xs font-bold ${mode === AppMode.LEFTOVERS ? 'text-[#8FB58F]' : 'text-stone-300'}`}>LEFTOVER SAVER</p>
                </div>
              </button>

              <button
                onClick={() => setMode(AppMode.BLIND_BOX)}
                className={`mode-card relative h-48 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden group text-left ${
                    mode === AppMode.BLIND_BOX ? 'active bg-[#FFF5F0]' : 'bg-white'
                }`}
              >
                 <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-8 -mt-8 transition-colors ${
                     mode === AppMode.BLIND_BOX ? 'bg-[#FFD1BA]' : 'bg-stone-100 group-hover:bg-[#FFD1BA]/50'
                }`}></div>
                <div className="relative z-10 p-3 bg-white rounded-2xl w-fit shadow-sm">
                    <Gift size={28} className={mode === AppMode.BLIND_BOX ? 'text-[#E8A88A]' : 'text-stone-400'} />
                </div>
                 <div className="relative z-10">
                    <h3 className={`text-2xl font-display mb-1 ${mode === AppMode.BLIND_BOX ? 'text-[#5D5A53]' : 'text-stone-400'}`}>美食盲盒</h3>
                    <p className={`text-xs font-bold ${mode === AppMode.BLIND_BOX ? 'text-[#E8A88A]' : 'text-stone-300'}`}>MYSTERY BOX</p>
                </div>
              </button>

              <button
                onClick={() => setMode(AppMode.METAPHYSICAL)}
                className={`mode-card relative h-48 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden group text-left ${
                    mode === AppMode.METAPHYSICAL ? 'active bg-[#F8F8FF]' : 'bg-white'
                }`}
              >
                 <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-8 -mt-8 transition-colors ${
                     mode === AppMode.METAPHYSICAL ? 'bg-[#E6E6FA]' : 'bg-stone-100 group-hover:bg-[#E6E6FA]/50'
                }`}></div>
                <div className="relative z-10 p-3 bg-white rounded-2xl w-fit shadow-sm">
                    <Sparkles size={28} className={mode === AppMode.METAPHYSICAL ? 'text-[#B8B8E0]' : 'text-stone-400'} />
                </div>
                 <div className="relative z-10">
                    <h3 className={`text-2xl font-display mb-1 ${mode === AppMode.METAPHYSICAL ? 'text-[#5D5A53]' : 'text-stone-400'}`}>玄学推荐</h3>
                    <p className={`text-xs font-bold ${mode === AppMode.METAPHYSICAL ? 'text-[#B8B8E0]' : 'text-stone-300'}`}>FORTUNE FOOD</p>
                </div>
              </button>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="soft-panel p-8 md:p-12 space-y-10 relative">
              
              {mode === AppMode.LEFTOVERS && (
                <>
                  <div className="space-y-4">
                    <label className="text-xl text-stone-600 font-bold flex items-center gap-3">
                         <span className="bg-[#C1E1C1] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">1</span>
                         冰箱里有什么？
                    </label>
                    
                    <div className="space-y-4">
                        {/* Image Upload Area */}
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                            
                            {!inputs.ingredientImage ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 border-2 border-dashed border-[#C1E1C1] rounded-2xl bg-[#F0F9F0]/50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F9F0] transition-colors group"
                                >
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <Camera className="text-[#8FB58F]" size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-[#8FB58F]">拍个照 / 上传图片</span>
                                    <span className="text-xs text-[#8FB58F]/70 mt-1">AI 自动识别食材</span>
                                </div>
                            ) : (
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md border-2 border-white group">
                                    <img 
                                        src={inputs.ingredientImage} 
                                        alt="Uploaded Ingredients" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-white/90 text-rose-500 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                                        >
                                            <X size={18} /> 删除照片
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Text Area */}
                        <div className="relative">
                            <textarea
                            name="ingredients"
                            value={inputs.ingredients}
                            onChange={handleInputChange}
                            placeholder={inputs.ingredientImage ? "还有什么照片里没拍到的吗？(可选)" : "例如：3个鸡蛋，半袋吐司，一个番茄..."}
                            className="w-full input-soft p-5 text-lg text-stone-600 placeholder-stone-300 h-24 resize-none"
                            required={!inputs.ingredientImage} // Required only if no image is uploaded
                            />
                        </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xl text-stone-600 font-bold flex items-center gap-3">
                        <span className="bg-[#C1E1C1] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">2</span>
                        想吃什么味儿？
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CUISINE_OPTIONS.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelection('cuisine', opt)}
                                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
                                    inputs.cuisine === opt 
                                    ? 'bg-[#FFD1BA] text-white shadow-md transform -translate-y-1' 
                                    : 'bg-white text-stone-400 hover:bg-stone-50'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {mode === AppMode.BLIND_BOX && (
                <div className="space-y-8 py-4">
                  <div className="space-y-4">
                    <label className="text-xl text-stone-600 font-bold flex items-center gap-3">
                        <span className="bg-[#FFD1BA] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">!</span>
                        有什么绝对不吃的？
                    </label>
                    <input
                        type="text"
                        name="dietaryRestrictions"
                        value={inputs.dietaryRestrictions}
                        onChange={handleInputChange}
                        placeholder="例如：香菜达咩，海鲜过敏..."
                        className="w-full input-soft p-5 text-lg text-stone-600 placeholder-stone-300"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-[#FFF5F0] to-white border border-[#FFD1BA]/30 p-8 rounded-[2rem] flex items-center gap-6">
                      <div className="text-5xl animate-float filter drop-shadow-sm">🎁</div>
                      <div>
                          <h3 className="text-lg font-bold text-stone-700 mb-2">未知的味蕾冒险</h3>
                          <p className="text-stone-400 text-sm leading-relaxed">点击生成，获取今日份的盲盒惊喜。可能是惊喜，也可能是惊吓，但一定好吃！</p>
                      </div>
                  </div>
                </div>
              )}

              {mode === AppMode.METAPHYSICAL && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xl text-stone-600 font-bold flex items-center gap-3">🌌 你的星座</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {ZODIAC_SIGNS.map(z => (
                             <button
                             key={z}
                             type="button"
                             onClick={() => handleSelection('zodiac', z)}
                             className={`py-2 px-1 rounded-xl text-sm font-bold transition-all ${
                                 inputs.zodiac === z 
                                 ? 'bg-[#E6E6FA] text-[#5D5A53] shadow-md transform -translate-y-1 ring-2 ring-[#B8B8E0]' 
                                 : 'bg-white text-stone-400 hover:bg-stone-50'
                             }`}
                         >
                             {z}
                         </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xl text-stone-600 font-bold flex items-center gap-3">💭 今日心情</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {MOODS.map(m => (
                             <button
                             key={m}
                             type="button"
                             onClick={() => handleSelection('mood', m)}
                             className={`py-3 px-2 rounded-xl text-sm font-bold transition-all ${
                                 inputs.mood === m 
                                 ? 'bg-[#E6E6FA] text-[#5D5A53] shadow-md transform -translate-y-1 ring-2 ring-[#B8B8E0]' 
                                 : 'bg-white text-stone-400 hover:bg-stone-50'
                             }`}
                         >
                             {m}
                         </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xl text-stone-600 font-bold flex items-center gap-3">🍀 幸运数字</label>
                    <input
                      type="number"
                      name="luckyNumber"
                      value={inputs.luckyNumber}
                      onChange={handleInputChange}
                      className="w-full input-soft p-4 text-xl font-display text-stone-600"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-display text-2xl tracking-widest flex items-center justify-center gap-3 transition-all text-white mt-8 shadow-xl ${
                    mode === AppMode.LEFTOVERS ? 'bg-gradient-to-r from-[#C1E1C1] to-[#8FB58F] shadow-[#C1E1C1]/50' :
                    mode === AppMode.BLIND_BOX ? 'bg-gradient-to-r from-[#FFD1BA] to-[#E8A88A] shadow-[#FFD1BA]/50' :
                    'bg-gradient-to-r from-[#E6E6FA] to-[#B8B8E0] text-stone-600 shadow-[#E6E6FA]/50'
                } hover:scale-[1.01] hover:-translate-y-1 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:translate-y-0`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={28}/> 
                    正在疯狂计算...
                  </>
                ) : (
                  <>
                    <Wand2 size={28} /> 
                    {mode === AppMode.LEFTOVERS ? '拯救我的食材' : mode === AppMode.BLIND_BOX ? '开启美味盲盒' : '获取灵魂食谱'}
                  </>
                )}
              </button>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-500 p-4 rounded-xl text-sm font-bold text-center animate-pulse">
                  {error}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Results Screen */}
        {recipe && (
            <div className="relative animate-fade-in-up">
                <div className="flex justify-center mb-8">
                     <button 
                        onClick={() => setRecipe(null)}
                        className="bg-white text-stone-500 px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg font-bold flex items-center gap-2 border border-stone-100"
                    >
                        <X size={20} /> 再来一道
                    </button>
                </div>
               
                <RecipeCard data={recipe} />
            </div>
        )}
      </main>
    </div>
  );
}

export default App;