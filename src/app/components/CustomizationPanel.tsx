'use client';

import { Palette, Type, Layout } from 'lucide-react';

interface CustomizationPanelProps {
  customizations: {
    font: string;
    accentColor: string;
    spacing: string;
  };
  onUpdate: (updates: any) => void;
}

export default function CustomizationPanel({ customizations, onUpdate }: CustomizationPanelProps) {
  const fonts = [
    { id: 'inter', name: 'Inter', class: 'font-inter' },
    { id: 'roboto', name: 'Roboto', class: 'font-roboto' },
    { id: 'opensans', name: 'Open Sans', class: 'font-opensans' },
  ];

  const spacingOptions = [
    { id: 'compact', name: 'Compact', description: 'Dense layout' },
    { id: 'normal', name: 'Normal', description: 'Standard spacing' },
    { id: 'relaxed', name: 'Relaxed', description: 'More whitespace' },
  ];

  const colorOptions = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#1f2937', // Gray
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Customize Appearance</h3>

      {/* Font Selection */}
      <div>
        <div className="flex items-center mb-3">
          <Type size={18} className="mr-2 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Font Family</label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => onUpdate({ font: font.id })}
              className={`p-3 border rounded-lg text-center transition-colors ${
                customizations.font === font.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={font.class}>
                <div className="text-sm font-medium">Aa</div>
                <div className="text-xs text-gray-500 mt-1">{font.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <div className="flex items-center mb-3">
          <Palette size={18} className="mr-2 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Accent Color</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ accentColor: color })}
              className={`w-8 h-8 rounded-full border-2 ${
                customizations.accentColor === color
                  ? 'border-gray-800 scale-110'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={customizations.accentColor}
              onChange={(e) => onUpdate({ accentColor: e.target.value })}
              className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
            />
            <div className="absolute inset-0 rounded-full border border-gray-400 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <div className="flex items-center mb-3">
          <Layout size={18} className="mr-2 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Layout Density</label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {spacingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onUpdate({ spacing: option.id })}
              className={`p-3 border rounded-lg text-center ${
                customizations.spacing === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium">{option.name}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}