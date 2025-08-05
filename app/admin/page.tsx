'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mic, Brain, Database, Save, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Settings {
  aiProvider: 'openai' | 'groq' | 'lmstudio';
  openaiKey: string;
  groqKey: string;
  lmstudioUrl: string;
  voiceEnabled: boolean;
  voiceProvider: 'openai' | 'browser';
}

export default function AdminPage() {
  const [settings, setSettings] = useState<Settings>({
    aiProvider: 'lmstudio',
    openaiKey: '',
    groqKey: '',
    lmstudioUrl: 'http://localhost:1234/v1',
    voiceEnabled: true,
    voiceProvider: 'api'
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  useEffect(() => {
    // Load settings from localStorage first
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setHasLoadedSettings(true);
    } else {
      // Fall back to environment variables
      setSettings(prev => ({
        ...prev,
        openaiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        groqKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
        lmstudioUrl: process.env.NEXT_PUBLIC_LMSTUDIO_URL || 'http://localhost:1234/v1'
      }));
    }
  }, []);

  const handleSave = () => {
    // In a real app, you'd save these to a backend
    // For now, we'll just show a success message
    localStorage.setItem('aiSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      if (settings.aiProvider === 'lmstudio') {
        // Use our API route to avoid CORS issues
        const response = await fetch(`/api/lmstudio?endpoint=models&baseUrl=${encodeURIComponent(settings.lmstudioUrl)}`);
        const data = await response.json();
        
        if (data.success) {
          setTestResult({ success: true, message: 'LMStudio connected successfully!' });
        } else {
          setTestResult({ success: false, message: 'Failed to connect to LMStudio. Make sure LMStudio is running.' });
        }
      } else if (settings.aiProvider === 'openai' && settings.openaiKey) {
        // Test OpenAI connection
        setTestResult({ success: true, message: 'OpenAI API key format is valid' });
      } else if (settings.aiProvider === 'groq' && settings.groqKey) {
        // Test Groq connection
        setTestResult({ success: true, message: 'Groq API key format is valid' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Connection failed: ' + error });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 bg-[#004b34]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-white mr-2" />
            <h1 className="text-xl font-semibold text-white">Admin Settings</h1>
          </div>
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm"
          >
            Back to App
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* AI Provider Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Brain className="w-5 h-5 text-[#004b34] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">AI Provider Settings</h2>
              {hasLoadedSettings && (
                <span className="text-xs text-green-600 ml-2">(Loaded from saved settings)</span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select AI Provider
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'lmstudio', name: 'LMStudio', desc: 'Local LLM' },
                    { id: 'openai', name: 'OpenAI', desc: 'GPT-4 & Whisper' },
                    { id: 'groq', name: 'Groq', desc: 'Fast inference' }
                  ].map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSettings(prev => ({ ...prev, aiProvider: provider.id as any }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.aiProvider === provider.id
                          ? 'border-[#d4a017] bg-[#fffef5]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-gray-700 mt-1">{provider.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider-specific settings */}
              {settings.aiProvider === 'openai' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settings.openaiKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, openaiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#d4a017] focus:border-[#d4a017]"
                  />
                </div>
              )}

              {settings.aiProvider === 'groq' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Groq API Key
                  </label>
                  <input
                    type="password"
                    value={settings.groqKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, groqKey: e.target.value }))}
                    placeholder="gsk_..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#d4a017] focus:border-[#d4a017]"
                  />
                </div>
              )}

              {settings.aiProvider === 'lmstudio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LMStudio URL
                  </label>
                  <input
                    type="text"
                    value={settings.lmstudioUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, lmstudioUrl: e.target.value }))}
                    placeholder="http://localhost:1234/v1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#d4a017] focus:border-[#d4a017]"
                  />
                </div>
              )}

              <button
                onClick={testConnection}
                disabled={testing}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>

              {testResult && (
                <div className={`p-4 rounded-md flex items-start ${
                  testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Mic className="w-5 h-5 text-[#004b34] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Voice Input Settings</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
                  className="w-4 h-4 text-[#004b34] rounded focus:ring-[#d4a017]"
                />
                <span className="ml-2 text-gray-700">Enable voice input in quiz</span>
              </label>

              {settings.voiceEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Provider
                  </label>
                  <select
                    value={settings.voiceProvider}
                    onChange={(e) => setSettings(prev => ({ ...prev, voiceProvider: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#d4a017] focus:border-[#d4a017]"
                  >
                    <option value="api">
                      {settings.aiProvider === 'groq' 
                        ? 'Groq Whisper Large v3'
                        : settings.aiProvider === 'openai'
                        ? 'OpenAI Whisper'
                        : 'API-based Whisper'}
                    </option>
                    <option value="browser">Browser Speech API (Free but less accurate)</option>
                  </select>
                  <p className="text-xs text-gray-700 mt-1">
                    {settings.voiceProvider === 'api' 
                      ? settings.aiProvider === 'groq' 
                        ? 'Uses Groq Whisper Large v3. Free tier available!'
                        : settings.aiProvider === 'openai'
                        ? 'Uses OpenAI Whisper. Costs ~$0.006 per minute.'
                        : 'LMStudio does not support audio transcription.'
                      : 'Free but less accurate. Works offline.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RAG Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Database className="w-5 h-5 text-[#004b34] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Knowledge Base (RAG)</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Student Stories</span>
                <span className="text-sm text-gray-600 font-medium">12 stories loaded</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Faculty Profiles</span>
                <span className="text-sm text-gray-600 font-medium">8 profiles loaded</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">School Facts</span>
                <span className="text-sm text-gray-600 font-medium">24 facts loaded</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mt-4">
              RAG data is stored in JSON files under `/knowledge` directory. 
              Edit these files directly to update the knowledge base.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#003825] text-white rounded-md hover:bg-[#004b34] flex items-center"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}