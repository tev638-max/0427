/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Settings2, 
  Shuffle, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  LayoutGrid,
  Maximize2,
  Share2,
  Upload,
  Download,
  FileText
} from 'lucide-react';

type GroupingMode = 'count' | 'size';

export default function App() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<GroupingMode>('count');
  const [value, setValue] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useState<HTMLInputElement | null>(null);

  const CHINESE_EXAMPLES = [
    '王小明', '李美玲', '張博文', '陳雅婷', '黃俊傑', 
    '林志豪', '吳欣怡', '周子傑', '徐若瑄', '蔡依林',
    '楊丞琳', '郭雪芙', '潘瑋柏', '蕭敬騰', '盧廣仲',
    '田馥甄', '林宥嘉', '韋禮安', '徐佳瑩', '趙又廷'
  ];

  const members = useMemo(() => {
    return input
      .split(/[\n,，\s\t]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
  }, [input]);

  const fireworks = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  const sakura = useCallback(() => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FFF0F5'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const triggerCelebration = useCallback(() => {
    fireworks();
    sakura();
  }, [fireworks, sakura]);

  const shuffle = useCallback((array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const handleGroup = () => {
    if (members.length === 0) return;

    const shuffled = shuffle(members);
    const result: string[][] = [];

    if (mode === 'count') {
      const targetCount = Math.max(1, Math.min(value, members.length));
      for (let i = 0; i < targetCount; i++) {
        result.push([]);
      }
      shuffled.forEach((member, index) => {
        result[index % targetCount].push(member);
      });
    } else {
      const targetSize = Math.max(1, value);
      for (let i = 0; i < shuffled.length; i += targetSize) {
        result.push(shuffled.slice(i, i + targetSize));
      }
    }

    setGroups(result);
    triggerCelebration();
  };

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== undefined) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const formatAllGroups = () => {
    return groups
      .map((group, idx) => `第 ${idx + 1} 組：${group.join(', ')}`)
      .join('\n');
  };

  const handleExportFile = () => {
    const content = formatAllGroups();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `分組結果_${new Date().toLocaleDateString()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      setGroups([]);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const loadExample = () => {
    setInput(CHINESE_EXAMPLES.join('\n'));
    setGroups([]);
  };

  const clearInput = () => {
    setInput('');
    setGroups([]);
  };

  const cardColors = [
    'bg-cyan-200',
    'bg-yellow-200',
    'bg-indigo-200',
    'bg-rose-200',
    'bg-emerald-200',
    'bg-orange-200',
    'bg-purple-200',
    'bg-blue-200'
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-sans selection:bg-rose-400 selection:text-white flex flex-col">
      {/* Hidden File Input */}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".txt,.csv"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <header className="h-20 bg-white border-b-4 border-slate-900 flex items-center justify-between px-6 md:px-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white font-black text-xl">
            師
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
            分組大師 GROUP MIXER
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => document.getElementById('fileInput')?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 rounded-full font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-xs md:text-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline">匯入檔案</span>
          </button>
          <button
            onClick={() => copyToClipboard(formatAllGroups())}
            disabled={groups.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 border-2 border-slate-900 rounded-full font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xs md:text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden md:inline">複製全部</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 md:p-8 gap-8 overflow-y-auto">
        {/* Sidebar: Inputs */}
        <section className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] inline-block"></span>
                參與者 ({members.length})
              </h2>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入姓名，以逗號、換行或空格分隔..."
              className="w-full h-64 bg-slate-50 border-2 border-slate-900 rounded-xl p-4 font-mono text-sm focus:ring-4 focus:ring-cyan-200 outline-none resize-none transition-all"
            />
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={loadExample}
                className="flex items-center justify-center gap-1 py-2 bg-indigo-200 border-2 border-slate-900 rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-xs"
              >
                <FileText className="w-3 h-3" />
                帶入範例
              </button>
              <button
                onClick={clearInput}
                className="flex items-center justify-center gap-1 py-2 bg-rose-200 border-2 border-slate-900 rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-xs"
              >
                <Trash2 className="w-3 h-3" />
                清空列表
              </button>
            </div>
          </div>

          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-500">
              <Settings2 className="w-4 h-4" />
              分組設定
            </h2>
            
            <div className="flex p-1 bg-slate-100 border-2 border-slate-900 rounded-xl mb-4">
              <button
                onClick={() => setMode('count')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                  mode === 'count' 
                    ? 'bg-rose-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                分組數量
              </button>
              <button
                onClick={() => setMode('size')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                  mode === 'size' 
                    ? 'bg-rose-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                每組人數
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">
                  目標{mode === 'count' ? '組數' : '每組人數'}：
                </span>
                <span className="text-2xl font-black">{value}</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.max(1, members.length)}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 border-2 border-slate-900 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <button
              onClick={handleGroup}
              disabled={members.length === 0}
              className="mt-6 w-full py-4 bg-yellow-400 border-4 border-slate-900 rounded-2xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <Shuffle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              開始攪拌
            </button>
          </div>
        </section>

        {/* Results Board */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900">分組結果</h2>
              <p className="text-slate-500 font-bold">
                {groups.length > 0 
                  ? `${groups.length} 組 • 每組約 ${Math.round(members.length / groups.length)} 人`
                  : '尚未進行分組'}
              </p>
            </div>
            {groups.length > 0 && (
              <button
                onClick={handleExportFile}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-500 text-white border-2 border-slate-900 rounded-full font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                匯出結果
              </button>
            )}
          </div>

          <div className="relative flex-1">
            <AnimatePresence mode="popLayout text-xs">
              {groups.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="empty-state"
                  className="h-full bg-white/50 border-4 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
                >
                  <Plus className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black text-lg">
                    在左側輸入名單或匯入檔案，點擊「開始攪拌」<br />
                    來生成隨機分組
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groups.map((group, idx) => (
                    <motion.div
                      key={`${idx}-${groups.length}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`${cardColors[idx % cardColors.length]} border-4 border-slate-900 rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group relative`}
                    >
                      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-3">
                        <h3 className="font-black text-lg tracking-wide uppercase">
                          第 {idx + 1} 組
                        </h3>
                        <button
                          onClick={() => copyToClipboard(group.join(', '), idx)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <ul className="space-y-2">
                        {group.map((name, nameIdx) => (
                          <li key={nameIdx} className="flex items-center gap-2 font-bold text-slate-800">
                            <span className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></span>
                            {name}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-12 bg-slate-900 text-slate-400 text-[10px] px-8 flex items-center justify-between font-mono font-bold uppercase tracking-widest">
        <div className="flex gap-4">
          <span>狀態: {groups.length > 0 ? '完成分組' : '等待輸入'}</span>
          <span className="hidden md:inline">人數: {members.length}</span>
        </div>
        <span>© 2024 GROUPMIXER SYSTEM V2.0</span>
      </footer>
    </div>
  );
}
