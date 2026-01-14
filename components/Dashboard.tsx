
import React from 'react';
import { TFT_SITES } from '../constants';
import { ExternalLink, TrendingUp, Info } from 'lucide-react';

const Dashboard: React.FC = () => {
  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Featured Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-700 p-6 mb-8 shadow-xl shadow-yellow-900/20">
        <div className="relative z-10">
          <span className="inline-block px-2 py-1 bg-black/30 rounded text-[10px] font-bold uppercase tracking-wider text-white mb-2">当前推荐</span>
          <h2 className="text-2xl font-bold text-white mb-1">版本上分攻略</h2>
          <p className="text-white/80 text-sm mb-4">掌握最新的阵容梯队，轻松冲击王者。</p>
          <button 
            onClick={() => openUrl('https://www.metatft.com/comps')}
            className="bg-white text-amber-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-zinc-100 active:scale-95 transition-all"
          >
            立即查看 MetaTFT <ExternalLink size={14} />
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp size={18} className="text-yellow-500" />
        常用数据中心
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {TFT_SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => openUrl(site.url)}
            className="group flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 flex-shrink-0 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {site.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-zinc-100">{site.name}</span>
                <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded uppercase">{site.category}</span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {site.description}
              </p>
            </div>
            <div className="self-center p-2 text-zinc-600">
              <ExternalLink size={18} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-start gap-3">
        <Info className="text-blue-500 mt-0.5" size={18} />
        <p className="text-xs text-blue-200/70 leading-relaxed">
          提示：本应用通过外部浏览器打开数据网站以确保最佳兼容性。您可以将常用网站收藏以备快速访问。
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
