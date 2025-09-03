'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mic, Brain, Database, Save, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Settings {
  aiProvider: 'openrouter';
  openrouterKey: string;
  voiceEnabled: boolean;
  voiceProvider: 'browser';
}

export default function AdminPage() {
  const [settings, setSettings] = useState<Settings>({
    aiProvider: 'openrouter',
    openrouterKey: '',
    voiceEnabled: false,
    voiceProvider: 'browser'
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
        openrouterKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''
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
      if (settings.openrouterKey) {
        // Test OpenRouter connection by checking models endpoint
        const response = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            'Authorization': `Bearer ${settings.openrouterKey}`,
          },
        });
        
        if (response.ok) {
          setTestResult({ success: true, message: 'OpenRouter connected successfully!' });
        } else {
          setTestResult({ success: false, message: 'Failed to connect to OpenRouter. Please check your API key.' });
        }
      } else {
        setTestResult({ success: false, message: 'Please enter an OpenRouter API key first.' });
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
                  AI Provider
                </label>
                <div className="p-4 rounded-lg border-2 border-[#d4a017] bg-[#fffef5]">
                  <div className="font-medium">OpenRouter</div>
                  <div className="text-xs text-gray-700 mt-1">Access to multiple AI models through one API</div>
                </div>
              </div>

              {/* OpenRouter API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={settings.openrouterKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, openrouterKey: e.target.value }))}
                  placeholder="sk-or-v1-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#d4a017] focus:border-[#d4a017]"
                />
                <p className="text-xs text-gray-700 mt-1">
                  Get your API key from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">openrouter.ai</a>
                </p>
              </div>

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
                    <option value="browser">Browser Speech API (Free but less accurate)</option>
                  </select>
                  <p className="text-xs text-gray-700 mt-1">
                    OpenRouter doesn't support audio transcription yet. Using browser's built-in speech recognition (free but less accurate).
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