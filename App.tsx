import React, { useState } from 'react';
import { useResume } from './hooks/useResume';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ResumeBuilder } from './components/builder/ResumeBuilder';
import { ResumePreview } from './components/preview/ResumePreview';
import { TemplatesGalleryPage } from './components/preview/TemplatesGalleryPage';
import { AtsScannerPage } from './components/ats/AtsScannerPage';
import { JobMatchPage } from './components/jobMatch/JobMatchPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DEMO_RESUME } from './data/demoResume';
import { FileEdit, Eye, CheckCircle2, SlidersHorizontal, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'builder' | 'templates' | 'ats' | 'jobmatch' | 'dashboard'>('landing');
  const [mobileBuilderTab, setMobileBuilderTab] = useState<'edit' | 'preview' | 'ats'>('edit');
  const { theme, toggleTheme } = useTheme();

  const {
    resume,
    updateResume,
    resetResume,
    loadDemo,
    importResume,
    lastSaved,
    isSaving
  } = useResume();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        resume={resume}
        onLoadDemo={() => {
          loadDemo();
          setActiveTab('builder');
        }}
        onImportResume={(imported) => {
          importResume(imported);
          setActiveTab('builder');
        }}
        onResetResume={resetResume}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col">
        
        {/* Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onStartBuilding={() => setActiveTab('builder')}
            onOpenScanner={() => setActiveTab('ats')}
            demoResume={DEMO_RESUME}
          />
        )}

        {/* Builder View (Desktop Split-Screen / Mobile Tabs) */}
        {activeTab === 'builder' && (
          <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
            
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex items-center justify-center p-1 bg-slate-200/80 dark:bg-slate-850 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setMobileBuilderTab('edit')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mobileBuilderTab === 'edit'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileEdit className="h-3.5 w-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setMobileBuilderTab('preview')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mobileBuilderTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setMobileBuilderTab('ats')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mobileBuilderTab === 'ats'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>ATS Audit</span>
              </button>
            </div>

            {/* Main Dual-Pane Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
              
              {/* Left Column: Editor */}
              <div className={`lg:col-span-6 xl:col-span-6 flex flex-col ${mobileBuilderTab === 'edit' ? 'block' : 'hidden lg:flex'}`}>
                <ResumeBuilder
                  resume={resume}
                  onUpdateResume={updateResume}
                  lastSaved={lastSaved}
                  isSaving={isSaving}
                />
              </div>

              {/* Right Column: Live A4 Preview */}
              <div className={`lg:col-span-6 xl:col-span-6 flex flex-col ${mobileBuilderTab === 'preview' ? 'block' : 'hidden lg:flex'}`}>
                <ResumePreview
                  resume={resume}
                  onUpdateResume={updateResume}
                />
              </div>

              {/* Mobile ATS View if tab selected */}
              {mobileBuilderTab === 'ats' && (
                <div className="lg:hidden col-span-1">
                  <AtsScannerPage
                    resume={resume}
                    onUpdateResume={updateResume}
                    onNavigateToBuilder={(sec) => {
                      setMobileBuilderTab('edit');
                    }}
                  />
                </div>
              )}

            </div>

          </div>
        )}

        {/* Templates Gallery */}
        {activeTab === 'templates' && (
          <TemplatesGalleryPage
            resume={resume}
            onSelectTemplate={(tmplId) => updateResume({ ...resume, templateId: tmplId })}
            onNavigateToBuilder={() => setActiveTab('builder')}
            onChangeAccentColor={(color) => updateResume({ ...resume, accentColor: color })}
          />
        )}

        {/* ATS Scanner Page */}
        {activeTab === 'ats' && (
          <AtsScannerPage
            resume={resume}
            onUpdateResume={updateResume}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        )}

        {/* Job Match Page */}
        {activeTab === 'jobmatch' && (
          <JobMatchPage
            resume={resume}
            onUpdateResume={updateResume}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        )}

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            resume={resume}
            onNavigate={(tab) => setActiveTab(tab)}
            lastSaved={lastSaved}
          />
        )}

      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}

export default App;
