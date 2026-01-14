
import React, { useState } from 'react';
import { AppTab } from './types';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import CheatSheet from './components/CheatSheet';
import RankChecker from './components/RankChecker';
import { LayoutGrid, Bot, ScrollText, Settings, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard />;
      case AppTab.AI_ASSISTANT:
        return <AIAssistant />;
      case AppTab.RANK_CHECK:
        return <RankChecker />;
      case AppTab.CHEATSHEET:
        return <CheatSheet />;
      case AppTab.SETTINGS:
        return (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold mb-4">设置 (Settings)</h2>
            <p className="text-zinc-400 mb-8">在这里配置您的个人偏好和 API 密钥。</p>
            <div className="bg-zinc-900 w-full p-4 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-500">版本: 1.1.0 (Player Search Update)</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden select-none">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            T
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">TFT Companion</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full uppercase tracking-widest font-bold">PRO Edition</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 px-6 flex items-center justify-between pb-4">
        <NavButton 
          active={activeTab === AppTab.DASHBOARD} 
          onClick={() => setActiveTab(AppTab.DASHBOARD)} 
          icon={<LayoutGrid size={22} />} 
          label="主页" 
        />
        <NavButton 
          active={activeTab === AppTab.RANK_CHECK} 
          onClick={() => setActiveTab(AppTab.RANK_CHECK)} 
          icon={<Search size={22} />} 
          label="查战绩" 
        />
        <NavButton 
          active={activeTab === AppTab.AI_ASSISTANT} 
          onClick={() => setActiveTab(AppTab.AI_ASSISTANT)} 
          icon={<Bot size={22} />} 
          label="AI 解读" 
        />
        <NavButton 
          active={activeTab === AppTab.CHEATSHEET} 
          onClick={() => setActiveTab(AppTab.CHEATSHEET)} 
          icon={<ScrollText size={22} />} 
          label="速查" 
        />
        <NavButton 
          active={activeTab === AppTab.SETTINGS} 
          onClick={() => setActiveTab(AppTab.SETTINGS)} 
          icon={<Settings size={22} />} 
          label="设置" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-yellow-500/10' : ''}`}>
      {icon}
    </div>
    <span className="text-[9px] font-bold tracking-tight uppercase">{label}</span>
  </button>
);

export default App;
