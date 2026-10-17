import React, { useState, useMemo } from 'react';
import { UNIQUE_ITEMS_DATA } from '../../data/uniqueItems';
import { SET_ITEMS_DATA } from '../../data/setItems';
import { HolyGrailState } from '../../types';
import { loadHolyGrailState, saveHolyGrailState, exportAllUserData, importUserData } from '../../utils/storage';
import { Trophy, CheckCircle2, Circle, Download, Upload } from 'lucide-react';

export const HolyGrailTracker: React.FC = () => {
  const [grailState, setGrailState] = useState<HolyGrailState>(loadHolyGrailState());
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'obtained'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all grail items
  const allGrailItems = useMemo(() => {
    const list: {
      id: string;
      name: string;
      nameEn: string;
      category: string;
      slot: string;
      isSet: boolean;
    }[] = [];

    // Unique Items
    UNIQUE_ITEMS_DATA.forEach((item) => {
      list.push({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        category: item.baseItem,
        slot: item.slot,
        isSet: false
      });
    });

    // Set Items
    SET_ITEMS_DATA.forEach((set) => {
      set.pieces.forEach((piece) => {
        list.push({
          id: piece.id,
          name: piece.name,
          nameEn: piece.nameEn,
          category: piece.baseItem,
          slot: piece.slot,
          isSet: true
        });
      });
    });

    return list;
  }, []);

  // Save changes
  const toggleObtained = (id: string) => {
    setGrailState((prev) => {
      const nextObtained = { ...prev.obtainedItemIds };
      if (nextObtained[id]) {
        delete nextObtained[id];
      } else {
        nextObtained[id] = true;
      }
      const updated = { ...prev, obtainedItemIds: nextObtained };
      saveHolyGrailState(updated);
      return updated;
    });
  };

  const toggleEthereal = (id: string) => {
    setGrailState((prev) => {
      const nextEth = { ...prev.etherealItemIds };
      if (nextEth[id]) {
        delete nextEth[id];
      } else {
        nextEth[id] = true;
      }
      const updated = { ...prev, etherealItemIds: nextEth };
      saveHolyGrailState(updated);
      return updated;
    });
  };

  // Stats calculation
  const totalCount = allGrailItems.length;
  const obtainedCount = Object.keys(grailState.obtainedItemIds).length;
  const ethCount = Object.keys(grailState.etherealItemIds).length;
  const progressPercent = totalCount > 0 ? ((obtainedCount / totalCount) * 100).toFixed(1) : '0';

  // Filter items
  const displayedItems = useMemo(() => {
    return allGrailItems.filter((item) => {
      const isObtained = Boolean(grailState.obtainedItemIds[item.id]);

      if (filterMode === 'missing' && isObtained) return false;
      if (filterMode === 'obtained' && !isObtained) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }

      return true;
    });
  }, [allGrailItems, grailState, filterMode, searchQuery]);

  // Export JSON
  const handleExport = () => {
    const json = exportAllUserData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `d2r-sanctuary-grail-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importUserData(content);
        if (success) {
          setGrailState(loadHolyGrailState());
          alert('打寶進度備份成功還原！');
        } else {
          alert('還原失敗：檔案格式不正確。');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-gold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-d2-gold" />
            <span>暗黑聖杯挑戰進度追蹤 (Holy Grail Tracker)</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            以純本地無痕方式紀錄遊戲內全數暗金與套裝裝備掉落收集，挑戰 100% 圓滿收藏！
          </p>
        </div>

        {/* Export / Import Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出備份 JSON</span>
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-white cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>匯入進度</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="p-6 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-sanctuary-400 font-medium">總體聖杯收集完成率</div>
            <div className="font-diablo text-3xl font-black text-d2-gold mt-1">
              {progressPercent}%
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-center p-2 rounded-lg bg-sanctuary-900 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[11px]">已收獲裝備</div>
              <div className="text-d2-set font-bold text-sm mt-0.5">{obtainedCount} / {totalCount}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-sanctuary-900 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[11px]">尚缺件數</div>
              <div className="text-d2-fire font-bold text-sm mt-0.5">{totalCount - obtainedCount} 件</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-sanctuary-900 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[11px]">無形 (ETH)</div>
              <div className="text-sanctuary-200 font-bold text-sm mt-0.5">{ethCount} 件</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-sanctuary-900 overflow-hidden border border-sanctuary-800">
          <div
            className="h-full bg-gradient-to-r from-d2-fire via-d2-gold to-d2-set transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜尋聖杯清單裝備名稱..."
          className="w-full sm:w-72 bg-sanctuary-950 border border-sanctuary-800 rounded-lg px-3 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none"
        />

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-sanctuary-900 border border-sanctuary-800 self-stretch sm:self-auto text-xs justify-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterMode === 'all' ? 'bg-sanctuary-800 text-d2-gold' : 'text-sanctuary-400'
            }`}
          >
            全部 ({allGrailItems.length})
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterMode === 'missing' ? 'bg-sanctuary-800 text-d2-fire' : 'text-sanctuary-400'
            }`}
          >
            未獲得 ({totalCount - obtainedCount})
          </button>
          <button
            onClick={() => setFilterMode('obtained')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterMode === 'obtained' ? 'bg-sanctuary-800 text-d2-set' : 'text-sanctuary-400'
            }`}
          >
            已收集 ({obtainedCount})
          </button>
        </div>
      </div>

      {/* Items Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedItems.map((item) => {
          const isObtained = Boolean(grailState.obtainedItemIds[item.id]);
          const isEth = Boolean(grailState.etherealItemIds[item.id]);

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                isObtained
                  ? 'bg-sanctuary-900/60 border-d2-set/30 shadow-sm'
                  : 'bg-sanctuary-950 border-sanctuary-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              <div
                onClick={() => toggleObtained(item.id)}
                className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
              >
                {isObtained ? (
                  <CheckCircle2 className="w-5 h-5 text-d2-set shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-sanctuary-600 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className={`font-bold text-xs truncate ${
                    item.isSet ? 'text-d2-set' : 'text-d2-unique'
                  } ${isObtained ? '' : 'line-through text-sanctuary-400'}`}>
                    {item.name}
                  </div>
                  <div className="text-[11px] text-sanctuary-400 truncate">
                    {item.category} • <span className="text-sanctuary-500 font-mono">{item.nameEn}</span>
                  </div>
                </div>
              </div>

              {/* ETH Pill */}
              <button
                onClick={() => toggleEthereal(item.id)}
                title="標記是否打到無形 (Ethereal) 版本"
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors shrink-0 ${
                  isEth
                    ? 'bg-sanctuary-750 text-white border-sanctuary-600 shadow'
                    : 'bg-sanctuary-900 text-sanctuary-600 border-sanctuary-800 hover:text-sanctuary-400'
                }`}
              >
                ETH
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
