
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, Settings, Trash2, Cpu, Key, Globe, Box } from 'lucide-react';
import { AIConfig, AIProvider, Language } from '../types';
import { getStoredConfigs, saveStoredConfigs, getSelectedConfigId, setSelectedConfigId, PROVIDER_DEFAULTS } from '../services/geminiService';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const TEXT = {
  en: {
    title: 'SYSTEM_CONFIG // AI_MODELS',
    sidebarTitle: 'Available Profiles',
    add: 'New',
    delete: 'Delete',
    save: 'Save & Close',
    cancel: 'Cancel',
    editTitle: 'Configure Model',
    labelName: 'Configuration Name',
    labelProvider: 'Provider',
    labelKey: 'API Key',
    labelUrl: 'API Base URL',
    labelModel: 'Model Name',
    placeholderKey: 'Leave empty to use default env',
    placeholderUrl: 'e.g. https://api.openai.com/v1',
    helperKey: 'Keys are stored locally in your browser.',
    selectPrompt: 'Select a configuration to edit',
  },
  zh: {
    title: '系统配置 // AI 模型',
    sidebarTitle: '可用配置',
    add: '新建',
    delete: '删除',
    save: '保存并关闭',
    cancel: '取消',
    editTitle: '配置模型参数',
    labelName: '配置名称',
    labelProvider: '服务商',
    labelKey: 'API 密钥',
    labelUrl: 'API 地址 (Base URL)',
    labelModel: '模型名称',
    placeholderKey: '留空使用默认环境变量 (若已配置)',
    placeholderUrl: '例如 https://api.openai.com/v1',
    helperKey: '密钥仅存储在您的本地浏览器中。',
    selectPrompt: '请从左侧选择一个配置进行编辑',
  }
};

const PROVIDERS: { id: AIProvider; label: string }[] = [
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'moonshot', label: 'Moonshot (Kimi)' },
  { id: 'qwen', label: 'Alibaba Qwen' },
  { id: 'ollama', label: 'Ollama' },
  { id: 'custom', label: 'Custom' },
];

const AIConfigModal: React.FC<AIConfigModalProps> = ({ isOpen, onClose, language }) => {
  const [configs, setConfigs] = useState<AIConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string>('default');
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);

  const t = TEXT[language];

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredConfigs();
      setConfigs(stored);
      const active = getSelectedConfigId();
      setSelectedId(active);
      
      const current = stored.find(c => c.id === active) || stored[0];
      setEditingConfig({ ...current });
    }
  }, [isOpen]);

  const handleSelect = (config: AIConfig) => {
    setSelectedId(config.id);
    setEditingConfig({ ...config });
  };

  const handleAdd = () => {
    const newConfig: AIConfig = {
      id: `custom-${Date.now()}`,
      name: language === 'en' ? 'New Configuration' : '新配置',
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      model: 'gpt-4o-mini'
    };
    setConfigs([...configs, newConfig]);
    setSelectedId(newConfig.id);
    setEditingConfig(newConfig);
  };

  const handleDelete = (id: string) => {
    if (configs.length <= 1) return;
    const newConfigs = configs.filter(c => c.id !== id);
    setConfigs(newConfigs);
    if (selectedId === id) {
      const first = newConfigs[0];
      setSelectedId(first.id);
      setEditingConfig({ ...first });
    }
  };

  const handleSave = () => {
    if (!editingConfig) return;
    
    const updatedConfigs = configs.map(c => 
      c.id === editingConfig.id ? editingConfig : c
    );
    
    setConfigs(updatedConfigs);
    saveStoredConfigs(updatedConfigs);
    setSelectedConfigId(selectedId);
    onClose();
  };

  const updateEditField = (field: keyof AIConfig, value: string) => {
    if (!editingConfig) return;
    setEditingConfig({ ...editingConfig, [field]: value });
  };

  const handleProviderChange = (provider: AIProvider) => {
    if (!editingConfig) return;
    
    const defaults = PROVIDER_DEFAULTS[provider];
    
    setEditingConfig({
      ...editingConfig,
      provider: provider,
      baseUrl: defaults.baseUrl,
      model: defaults.model,
      name: editingConfig.name === 'New Configuration' || editingConfig.name === '新配置' ? defaults.name : editingConfig.name
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl h-[700px] bg-black border border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden relative"
          >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00f0ff]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00f0ff]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00f0ff]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00f0ff]" />

            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="text-xl font-heading font-bold text-white tracking-wide">{t.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar List */}
              <div className="w-1/3 md:w-1/4 bg-[#0a0a0a] border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                   <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.sidebarTitle}</span>
                   <button 
                     onClick={handleAdd}
                     className="p-1 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] transition-colors"
                     title={t.add}
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {configs.map(config => (
                    <button
                      key={config.id}
                      onClick={() => handleSelect(config)}
                      className={`w-full text-left p-3 flex items-center gap-3 border transition-all ${
                        selectedId === config.id 
                          ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-white' 
                          : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-1 h-8 ${selectedId === config.id ? 'bg-[#00f0ff]' : 'bg-gray-700'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate text-sm">{config.name}</div>
                        <div className="text-[10px] font-mono uppercase opacity-70">{config.provider}</div>
                      </div>
                      {selectedId === config.id && <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Form */}
              <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto">
                {editingConfig ? (
                  <div className="space-y-8 max-w-2xl mx-auto">
                    
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                       <h3 className="text-lg font-bold text-white flex items-center gap-2">
                         <Cpu className="w-5 h-5 text-[#00f0ff]" /> 
                         {t.editTitle}
                       </h3>
                       {configs.length > 1 && (
                         <button 
                           onClick={() => handleDelete(editingConfig.id)}
                           className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 uppercase font-mono tracking-wider px-2 py-1 border border-red-500/30 hover:bg-red-500/10"
                         >
                           <Trash2 className="w-3 h-3" /> {t.delete}
                         </button>
                       )}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">{t.labelName}</label>
                      <input 
                        type="text" 
                        value={editingConfig.name}
                        onChange={(e) => updateEditField('name', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/20 p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors placeholder-gray-700 font-mono text-sm"
                      />
                    </div>

                    {/* Provider Grid */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">{t.labelProvider}</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PROVIDERS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleProviderChange(p.id)}
                            className={`p-2 text-[10px] md:text-xs font-mono uppercase border transition-all truncate ${
                              editingConfig.provider === p.id
                                ? 'bg-[#00f0ff] text-black border-[#00f0ff] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                                : 'bg-transparent text-gray-500 border-white/20 hover:border-white/50 hover:text-white'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase flex items-center gap-2">
                        <Key className="w-3 h-3" /> {t.labelKey}
                      </label>
                      <input 
                        type="password" 
                        value={editingConfig.apiKey}
                        onChange={(e) => updateEditField('apiKey', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/20 p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors placeholder-gray-700 font-mono text-sm"
                        placeholder={t.placeholderKey}
                      />
                      <p className="text-[10px] text-gray-600">
                        {t.helperKey}
                      </p>
                    </div>

                    {/* Base URL */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase flex items-center gap-2">
                        <Globe className="w-3 h-3" /> {t.labelUrl}
                      </label>
                      <input 
                        type="text" 
                        value={editingConfig.baseUrl}
                        onChange={(e) => updateEditField('baseUrl', e.target.value)}
                        className={`w-full bg-[#0a0a0a] border p-3 text-white focus:outline-none transition-colors placeholder-gray-700 font-mono text-sm ${
                          editingConfig.provider === 'gemini' 
                            ? 'border-white/5 text-gray-600 cursor-not-allowed' 
                            : 'border-white/20 focus:border-[#00f0ff]'
                        }`}
                        placeholder={t.placeholderUrl}
                        disabled={editingConfig.provider === 'gemini'}
                      />
                    </div>

                    {/* Model Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase flex items-center gap-2">
                        <Box className="w-3 h-3" /> {t.labelModel}
                      </label>
                      <input 
                        type="text" 
                        value={editingConfig.model}
                        onChange={(e) => updateEditField('model', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/20 p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors placeholder-gray-700 font-mono text-sm"
                      />
                    </div>

                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 font-mono">
                    {t.selectPrompt}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="h-16 border-t border-white/10 flex items-center justify-end px-6 gap-4 bg-[#050505]">
              <button 
                onClick={onClose}
                className="px-6 py-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[#00f0ff] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
              >
                <Save className="w-3 h-3" /> {t.save}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIConfigModal;
