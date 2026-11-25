import { useState } from 'react';
import { 
  GradeItem, 
  AutomationSettings 
} from './types';
import { 
  generateWindowsVbsScript,
  downloadFile 
} from './utils/scriptGenerators';
import { SettingsSliders } from './components/SettingsSliders';
import { GradeTable } from './components/GradeTable';
import { PasteModal } from './components/PasteModal';
import { DesktopExportModal } from './components/DesktopExportModal';
import { Download, Flame, Monitor, Keyboard } from 'lucide-react';

const DEFAULT_SETTINGS: AutomationSettings = {
  initialDelay: 3,         // 3 seconds default
  typingInterval: 0.1,     // 0.1 seconds default
  tabCount: 1,             // 1 TAB default (range 1 to 20)
  soundEnabled: true,
  voiceEnabled: false,
  autoScroll: true,
};

export default function App() {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [settings, setSettings] = useState<AutomationSettings>(DEFAULT_SETTINGS);

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const activeGrades = grades.filter((g) => g.grade.trim() !== '');

  const handleAddRow = () => {
    const newRow: GradeItem = {
      id: `grade-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      student: `Aluno ${grades.length + 1}`,
      grade: '',
      status: 'pending',
    };
    setGrades((prev) => [...prev, newRow]);
  };

  const handleUpdateRow = (id: string, field: 'student' | 'grade', value: string) => {
    setGrades((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteRow = (id: string) => {
    setGrades((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setGrades([]);
  };

  const handleImportGrades = (newItems: GradeItem[], replace: boolean) => {
    if (replace) {
      setGrades(newItems);
    } else {
      setGrades((prev) => [...prev, ...newItems]);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AutomationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Windows VBScript (.vbs)
  const handleDownloadWindowsVbs = () => {
    const script = generateWindowsVbsScript(grades, settings);
    downloadFile(script, 'digitar_notas_windows.vbs', 'text/plain;charset=utf-8');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* APP TITLE BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Digitador de Notas
              </h1>
              <p className="text-xs text-slate-400">
                Criado por Prof. Pedro Grossi
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Grade Table (Full Width) */}
        <div className="w-full">
          <GradeTable
            grades={grades}
            currentIndex={-1}
            isAutomating={false}
            onAddRow={handleAddRow}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            onClearAll={handleClearAll}
            onOpenPasteModal={() => setIsPasteModalOpen(true)}
          />
        </div>

        {/* Section 2: Sliders Configuration (Delay, Interval, TABs) */}
        <SettingsSliders
          settings={settings}
          onChange={handleUpdateSettings}
        />

        {/* Section 3: SCRIPTS DE EXECUÇÃO: WINDOWS */}
        <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border-2 border-sky-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Scripts com Teclas Físicas (Windows)
                </h2>
                <p className="text-xs text-slate-300">
                  Aperta fisicamente <strong>CONTROL+V</strong> e <strong>TAB</strong> no teclado no seu Excel, LibreOffice ou sistema escolar fora do navegador
                </p>
              </div>
            </div>

            <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {grades.length} {grades.length === 1 ? 'linha' : 'linhas'} ({activeGrades.length} {activeGrades.length === 1 ? 'nota' : 'notas'})
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Monitor className="w-4 h-4" /> Para Windows (10 / 11)
                </span>
                <span className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded border border-sky-500/20 font-mono">
                  2 Cliques / Sem Instalação
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dê 2 cliques no arquivo baixado: o Windows apertará Ctrl+V e TAB no seu teclado.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleDownloadWindowsVbs}
                disabled={grades.length === 0}
                className="w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/30 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Executável silencioso com 2 cliques nativo do Windows"
              >
                <Download className="w-4 h-4" />
                <span>Executável Windows (.vbs)</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Digitador de Notas &bull; Suporte para Windows (.vbs) &bull; Teclas físicas reais
        </p>
      </footer>

      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={handleImportGrades}
      />

      <DesktopExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        grades={grades}
        settings={settings}
      />
    </div>
  );
}
