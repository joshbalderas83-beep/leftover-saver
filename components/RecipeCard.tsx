import React from 'react';
import { RecipeData } from '../types';
import { Utensils, Flame, Wine, Sparkles, ChefHat, Clock, Activity, Image as ImageIcon, Heart } from 'lucide-react';

interface RecipeCardProps {
  data: RecipeData;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Hero Section with Image */}
      <div className="soft-panel overflow-hidden p-4 bg-white/60">
        <div className="relative h-72 md:h-[32rem] w-full rounded-[1.5rem] overflow-hidden bg-orange-50 flex items-center justify-center group shadow-sm">
            {data.imageUrl ? (
                 <img 
                 src={data.imageUrl} 
                 alt={data.dishName} 
                 className="w-full h-full object-cover animate-fade-in transition-transform duration-700 group-hover:scale-105"
               />
            ) : (
                <div className="text-stone-300 flex flex-col items-center gap-3">
                    <div className="p-6 bg-white rounded-full shadow-lg animate-pulse">
                         <ImageIcon size={48} className="opacity-40 text-stone-400" />
                    </div>
                    <span className="text-lg font-display text-stone-400 tracking-wider">AI 正在绘制美味...</span>
                </div>
            )}
           
            <div className="absolute top-4 right-4">
                 <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-rose-400">
                     <Heart className="fill-current" size={24}/>
                 </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/60 via-stone-800/20 to-transparent p-8 pt-32">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-stone-800 rounded-xl text-sm font-bold shadow-sm">
                                AI 严选
                            </span>
                            <span className="px-3 py-1 bg-[#FFD1BA]/90 backdrop-blur-md text-stone-800 rounded-xl text-sm font-bold shadow-sm">
                                {"⭐".repeat(data.chef.difficulty)} 难度
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl text-white mb-2 font-display tracking-wide drop-shadow-md">
                            {data.dishName}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Nutrition & Sommelier */}
        <div className="md:col-span-5 space-y-6">
            {/* Nutrition */}
            <div className="soft-panel p-8 bg-white/80">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#C1E1C1] rounded-xl text-stone-700">
                        <Activity size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-700">健康指数</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#F0F9F0] p-4 rounded-2xl text-center border border-[#C1E1C1]/30">
                        <div className="text-[#6B8E6B] text-xs font-bold mb-1 uppercase tracking-wider">热量</div>
                        <div className="text-lg font-bold text-[#4A6B4A]">{data.nutrition.calories}</div>
                    </div>
                     <div className="bg-[#F0F9F0] p-4 rounded-2xl text-center border border-[#C1E1C1]/30">
                        <div className="text-[#6B8E6B] text-xs font-bold mb-1 uppercase tracking-wider">蛋白质</div>
                        <div className="text-lg font-bold text-[#4A6B4A]">{data.nutrition.protein}</div>
                    </div>
                     <div className="bg-[#F0F9F0] p-4 rounded-2xl text-center border border-[#C1E1C1]/30">
                        <div className="text-[#6B8E6B] text-xs font-bold mb-1 uppercase tracking-wider">碳水</div>
                        <div className="text-lg font-bold text-[#4A6B4A]">{data.nutrition.carbs}</div>
                    </div>
                     <div className="bg-[#F0F9F0] p-4 rounded-2xl text-center border border-[#C1E1C1]/30">
                        <div className="text-[#6B8E6B] text-xs font-bold mb-1 uppercase tracking-wider">脂肪</div>
                        <div className="text-lg font-bold text-[#4A6B4A]">{data.nutrition.fat}</div>
                    </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <p className="text-sm text-stone-600 leading-relaxed">
                        <span className="mr-2">💡</span>{data.nutrition.comment}
                    </p>
                </div>
            </div>

            {/* Sommelier */}
            <div className="soft-panel p-8 bg-white/80">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-100 rounded-xl text-rose-500">
                        <Wine size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-700">佐餐推荐</h3>
                </div>
                <div className="flex gap-5 items-start">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center shrink-0 text-3xl shadow-inner">
                        🍷
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-stone-800 mb-2">{data.pairing.drink}</h4>
                        <p className="text-sm text-stone-500 leading-relaxed">
                            {data.pairing.reason}
                        </p>
                    </div>
                </div>
            </div>

            {/* Metaphysical (if active) */}
            {data.metaphysical && (
                <div className="soft-panel p-8 bg-gradient-to-br from-[#E6E6FA] to-white border-none">
                     <div className="flex items-center gap-3 mb-4 text-violet-500">
                        <Sparkles size={20} />
                        <h3 className="text-xl font-bold text-violet-800">今日玄学</h3>
                    </div>
                    <p className="text-stone-600 font-medium italic leading-relaxed">
                        “{data.metaphysical.analysis}”
                    </p>
                </div>
            )}
        </div>

        {/* Right Column: Recipe Steps */}
        <div className="md:col-span-7">
            <div className="soft-panel p-8 md:p-10 bg-white/90 h-full">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-[#FFD1BA] rounded-xl text-orange-800">
                            <ChefHat size={24} />
                         </div>
                         <h3 className="text-2xl font-bold text-stone-800">主厨料理台</h3>
                    </div>
                    <div className="flex gap-3 text-sm font-semibold text-stone-500">
                        <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full"><Clock size={14}/> {data.chef.prepTime}</span>
                        <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full"><Flame size={14}/> {data.chef.cookTime}</span>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mb-10">
                    <h4 className="text-sm font-bold text-stone-400 mb-5 uppercase tracking-wider flex items-center gap-2">
                        食材清单
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {data.chef.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#FDFCF8] border border-stone-100 px-4 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-[#FFD1BA] transition-all cursor-default">
                            <span className="font-display text-lg text-stone-700">{ing.name}</span>
                            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                            <span className="text-stone-500 text-sm font-semibold">{ing.amount}</span>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div>
                    <h4 className="text-sm font-bold text-stone-400 mb-6 uppercase tracking-wider">
                        制作步骤
                    </h4>
                    <div className="space-y-0 relative pl-4">
                        {/* Vertical Line */}
                        <div className="absolute left-[20px] top-4 bottom-8 w-0.5 bg-stone-100"></div>

                        {data.chef.steps.map((step, idx) => (
                            <div key={idx} className="relative flex gap-6 mb-10 group">
                                <div className="z-10 w-10 h-10 rounded-full bg-white border-4 border-[#FDFCF8] shadow-md flex items-center justify-center shrink-0 group-hover:bg-[#FFD1BA] group-hover:text-white transition-colors text-stone-300 font-bold font-display text-lg">
                                    {idx + 1}
                                </div>
                                <div className="pt-1">
                                    <span className="inline-block bg-[#E1F0E1] text-[#4A6B4A] text-xs font-bold px-2 py-0.5 rounded-lg mb-2">
                                        {step.timeRange}
                                    </span>
                                    <p className="text-stone-600 text-lg leading-relaxed font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                        
                        {/* Finishing Touch */}
                         <div className="relative flex gap-6 mt-4">
                            <div className="z-10 w-10 h-10 rounded-full bg-yellow-300 shadow-lg shadow-yellow-200 flex items-center justify-center shrink-0 animate-float">
                                <Sparkles size={18} className="text-yellow-700" />
                            </div>
                            <div className="pt-2 bg-gradient-to-r from-yellow-50 to-transparent p-6 rounded-2xl w-full border border-yellow-100">
                                <p className="text-stone-700 text-lg font-display tracking-wide italic">
                                    “{data.chef.finishingTouch}”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;