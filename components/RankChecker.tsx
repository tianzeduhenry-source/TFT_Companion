
import React, { useState } from 'react';
import { fetchPlayerRank } from '../services/geminiService';
import { Search, Globe, Trophy, Activity, ExternalLink, Loader2, User, History } from 'lucide-react';
import { PlayerRankInfo } from '../types';

const SERVERS = [
  { id: 'KR', name: '韩国 (KR)' },
  { id: 'NA', name: '北美 (NA)' },
  { id: 'EUW', name: '西欧 (EUW)' },
  { id: 'CN', name: '中国 (CN/腾讯)' },
  { id: 'JP', name: '日本 (JP)' },
  { id: 'VN', name: '越南 (VN)' },
  { id: 'TW', name: '台湾 (TW)' },
];

const RankChecker: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [region, setRegion] = useState('KR');
  const [isLoading, setIsLoading] = useState(false);
  const [rankData, setRankData] = useState<PlayerRankInfo | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    setError('');
    setRankData(null);

    try {
      const result = await fetchPlayerRank(playerName, region);
      if (result) {
        setRankData(result);
      } else {
        setError('未找到该玩家的公开战绩，请确保 ID 和服务器正确。');
      }
    } catch (err) {
      setError('查询出错，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          全球战绩查询
        </h2>
        <p className="text-xs text-zinc-400">输入 Riot ID 或 游戏名，实时获取段位与胜率。</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="玩家名称 (例如: Hide on bush)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !playerName.trim()}
            className="bg-yellow-500 text-black px-4 rounded-xl font-bold flex items-center justify-center disabled:bg-zinc-800 disabled:text-zinc-600 active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {SERVERS.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => setRegion(srv.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                region === srv.id 
                  ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              {srv.name}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      {rankData && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 rounded-2xl border border-zinc-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-black text-white">{rankData.playerName}</h3>
                <span className="text-xs text-zinc-500 uppercase tracking-tighter">{rankData.region} SERVER</span>
              </div>
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl border border-zinc-700 flex items-center justify-center text-3xl">
                🏆
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-zinc-800 pt-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">当前段位</p>
                <p className="text-xl font-bold text-yellow-500">{rankData.rank}</p>
                <p className="text-sm text-zinc-300">{rankData.lp} LP</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">胜率 / 前四率</p>
                <p className="text-lg font-bold text-white">{rankData.winRate || '--'} / {rankData.top4Rate || '--'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Activity size={14} />
                <span className="text-[10px] font-bold uppercase">最近战绩</span>
              </div>
              <div className="flex gap-1">
                {rankData.recentGames?.map((pos, i) => (
                  <div key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    parseInt(pos) <= 4 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {pos}
                  </div>
                )) || <span className="text-zinc-600 text-[10px]">无记录</span>}
              </div>
            </div>
            <button 
              onClick={() => window.open(rankData.sourceUrl, '_blank')}
              className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col justify-center items-center gap-1 hover:bg-zinc-800 transition-colors"
            >
              <ExternalLink size={16} className="text-zinc-500" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase">查看详情</span>
            </button>
          </div>
        </div>
      )}

      {!rankData && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 opacity-50">
          <Globe size={64} className="mb-4" />
          <p className="text-sm">支持多服查询，数据同步自 LoLChess 等平台</p>
        </div>
      )}
    </div>
  );
};

export default RankChecker;
