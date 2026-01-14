
import React from 'react';
import { Search, Hammer, ShieldAlert } from 'lucide-react';

const CheatSheet: React.FC = () => {
  return (
    <div className="p-5 space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="搜索英雄、装备或羁绊..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
        />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Hammer size={18} className="text-yellow-500" />
          <h3 className="font-bold text-zinc-100">核心装备库</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
              <img src={`https://picsum.photos/seed/${i + 100}/100/100`} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-[10px] font-bold">Item {i}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={18} className="text-yellow-500" />
          <h3 className="font-bold text-zinc-100">羁绊数据 (预览)</h3>
        </div>
        <div className="space-y-3">
          {['魔法师', '咖啡甜心', '重装战士', '学者'].map((trait, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">
                  {['🧙', '☕', '🛡️', '📖'][i]}
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-100">{trait}</div>
                  <div className="text-[10px] text-zinc-500">2 / 4 / 6 / 8</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3].map(dot => <div key={dot} className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>)}
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 text-center py-6 border-t border-dashed border-zinc-800">
        <p className="text-xs text-zinc-500">本页面为本地缓存数据，数据随版本自动更新。</p>
      </div>
    </div>
  );
};

export default CheatSheet;
