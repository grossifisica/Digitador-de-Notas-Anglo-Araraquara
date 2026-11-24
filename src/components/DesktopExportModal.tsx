import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Monitor,
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { GradeItem, AutomationSettings } from '../types';
import { 
  generateWindowsVbsScript,
  generatePythonScript,
  downloadFile 
} from '../utils/scriptGenerators';

interface DesktopExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  grades: GradeItem[];
  settings: AutomationSettings;
}

export const DesktopExportModal: React.FC<DesktopExportModalProps> = ({
  isOpen,
  onClose,
  grades,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'vbs' | 'python'>('vbs');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const vbsCode = generateWindowsVbsScript(grades, settings);
  const pythonCode = generatePythonScript(grades, settings);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadVbs = () => {
    downloadFile(vbsCode, `digitar_notas_windows.vbs`, 'text/plain;charset=utf-8');
  };

  const handleDownloadPython = () => {
    downloadFile(pythonCode, `digitar_notas_windows.py`, 'text/x-python;charset=utf-8');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Scripts Nativos para Windows (Teclas Físicas)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Windows 10 &bull; Windows 11
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aperta fisicamente CONTROL + V e TAB fora da aba do navegador no seu Windows
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('vbs')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'vbs'
                ? 'text-sky-400 border-sky-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Executável (.vbs) &bull; Recomendado</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('python')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'python'
                ? 'text-amber-400 border-amber-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Python (.py)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'vbs' && (
            <div className="space-y-3">
              <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-200 space-y-1">
                  <p className="font-semibold text-white">
                    Executável Nativo do Windows (.vbs) — 2 Cliques, Sem Instalação
                  </p>
                  <p className="text-sky-300/90 leading-relaxed">
                    Usa o próprio Windows para copiar cada nota e pressionar fisicamente <strong>CONTROL + V</strong> e <strong>TAB</strong> na janela ativa do seu sistema escolar ou planilha.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Script pronto com <strong>{grades.length} linhas</strong> ({grades.filter(g => g.grade.trim() !== '').length} notas preenchidas), delay de {settings.initialDelay}s e {settings.tabCount}x TAB.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(vbsCode, 'vbs')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedType === 'vbs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'vbs' ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadVbs}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Executável (.vbs)</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto max-h-56 leading-relaxed">
                <pre>{vbsCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'python' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Script Python para Windows usando <code>pyautogui</code> e <code>pyperclip</code>.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(pythonCode, 'py')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedType === 'py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'py' ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPython}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Arquivo .py</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto max-h-56 leading-relaxed">
                <pre>{pythonCode}</pre>
              </div>

              <div className="text-xs text-slate-400 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="font-semibold text-slate-200">Como executar no Windows:</p>
                <p className="font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded inline-block">
                  python digitar_notas_windows.py
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
