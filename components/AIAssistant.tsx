
import React, { useState, useRef, useEffect } from 'react';
import { analyzePatchNotes, chatWithCoach, fetchAndAnalyzeOfficialPatch, getRecentVersionsList } from '../services/geminiService';
import { Send, Bot, Sparkles, Loader2, ClipboardList, History, Globe, ChevronRight, ExternalLink } from 'lucide-react';
import { PatchVersion } from '../types';

const AIAssistant: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [historyVersions, setHistoryVersions] = useState<PatchVersion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch of version history
    const loadHistory = async () => {
      const versions = await getRecentVersionsList();
      setHistoryVersions(versions);
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, analysis]);

  const handleFetchOfficial = async (version?: string) => {
    setIsLoading(true);
    setLoadingStep(version ? `正在从官网抓取 v${version} 补丁...` : '正在寻找最新官网补丁...');
    try {
      const result = await fetchAndAnalyzeOfficialPatch(version);
      if (result) setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleManualAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setLoadingStep('AI 正在深度解析您提供的文本...');
    const result = await analyzePatchNotes(inputText);
    setAnalysis(result);
    setIsLoading(false);
    setLoadingStep('');
    setInputText('');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsLoading(true);
    
    try {
      const response = await chatWithCoach(userMsg, []);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，教练累了，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Tab Switcher */}
      <div className="flex bg-zinc-900 p-1 rounded-xl mb-2 mt-4 self-center sticky top-2 z-20">
        <button 
          onClick={() => {setChatMode(false);}}
          className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${!chatMode ? 'bg-zinc-800 text-yellow-500 shadow-sm' : 'text-zinc-500'}`}
        >
          补丁库
        </button>
        <button 
          onClick={() => setChatMode(true)}
          className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${chatMode ? 'bg-zinc-800 text-yellow-500 shadow-sm' : 'text-zinc-500'}`}
        >
          弈客教练
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6" ref={scrollRef}>
        {!chatMode && !analysis && (
          <div className="space-y-6">
            <div className="text-center py-6 px-6">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">全自动版本分析</h3>
              <p className="text-sm text-zinc-400">点击下方按钮自动从官网爬取并解读最新改动。</p>
              
              <button 
                onClick={() => handleFetchOfficial()}
                disabled={isLoading}
                className="mt-6 w-full py-4 bg-yellow-500 text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                获取全网最新补丁解读
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 px-2 mb-3">
                <History size={16} className="text-zinc-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase">历史更新记录</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {historyVersions.map((v, i) => (
                  <button 
                    key={i}
                    onClick={() => handleFetchOfficial(v.version)}
                    disabled={isLoading}
                    className="flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 group-hover:text-yellow-500">
                        {v.version}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-zinc-200">{v.title}</div>
                        <div className="text-[10px] text-zinc-500">{v.date}</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-zinc-700 group-hover:text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <details className="group">
                <summary className="list-none flex items-center justify-center gap-2 text-xs text-zinc-600 cursor-pointer hover:text-zinc-400">
                  <ClipboardList size={14} />
                  <span>手动粘贴文本分析 (备选)</span>
                </summary>
                <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="在此粘贴版本公告内容..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                  <button 
                    onClick={handleManualAnalyze}
                    className="mt-2 w-full py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-700"
                  >
                    立即分析文本
                  </button>
                </div>
              </details>
            </div>
          </div>
        )}

        {analysis && !chatMode && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between px-2">
                <button onClick={() => setAnalysis(null)} className="text-xs text-zinc-500 hover:text-yellow-500 flex items-center gap-1">
                   ← 返回列表
                </button>
                <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                  版本: {analysis.version || '最新'}
                </span>
             </div>

            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3 text-yellow-500 relative z-10">
                <Sparkles size={18} />
                <span className="font-bold text-sm">官方解读 & 总结</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed relative z-10">{analysis.summary}</p>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/20">
                <span className="text-xs font-bold text-green-400 mb-2 block uppercase tracking-wider">强势加强</span>
                <ul className="text-[11px] text-zinc-400 space-y-2">
                  {analysis.buffs.map((item: string, i: number) => <li key={i} className="flex gap-2"><span>•</span> {item}</li>)}
                </ul>
              </div>
              <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20">
                <span className="text-xs font-bold text-red-400 mb-2 block uppercase tracking-wider">重大削弱</span>
                <ul className="text-[11px] text-zinc-400 space-y-2">
                  {analysis.nerfs.map((item: string, i: number) => <li key={i} className="flex gap-2"><span>•</span> {item}</li>)}
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
              <span className="text-xs font-bold text-blue-400 mb-3 block uppercase tracking-widest">推荐上分阵容</span>
              <div className="space-y-2">
                {analysis.topComps.map((comp: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800/50 hover:border-blue-500/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                      {i+1}
                    </div>
                    <span className="text-sm text-zinc-200 font-medium">{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {analysis.officialUrl && (
              <button 
                onClick={() => window.open(analysis.officialUrl, '_blank')}
                className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                <ExternalLink size={14} /> 查看官网原文
              </button>
            )}
          </div>
        )}

        {chatMode && messages.length === 0 && (
          <div className="text-center py-10 px-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="text-blue-500" size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">AI 弈客教练</h3>
            <p className="text-sm text-zinc-400">您可以询问任何关于云顶之弈的问题。</p>
          </div>
        )}

        {chatMode && messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-yellow-500 text-black font-medium rounded-tr-none' 
                : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
             <div className="w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
             <p className="text-xs text-yellow-500 font-medium">{loadingStep || '正在处理数据...'}</p>
          </div>
        )}
      </div>

      {/* Input Area (Chat Only) */}
      {chatMode && (
        <div className="p-4 border-t border-zinc-900 bg-zinc-950">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入您的问题..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 pr-14 text-sm focus:outline-none focus:border-yellow-500 transition-colors text-zinc-100"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 text-black rounded-xl disabled:bg-zinc-800 disabled:text-zinc-600 transition-all hover:scale-105 active:scale-95"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
