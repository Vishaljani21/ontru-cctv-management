import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import type { AppContextType } from '../App';
import { api } from '../services/api';
import type { DealerInfo } from '../types';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label: string; description: string; }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
        <div>
            <p className="font-semibold text-slate-800">{label}</p>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-primary-500' : 'bg-slate-300'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const SettingsPage: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    // Handle the case where context is null, though this shouldn't happen within the app's structure
    return <div>Error: App context is not available.</div>;
  }
  const { 
      isHrModuleEnabled, setIsHrModuleEnabled,
      isBillingModuleEnabled, setIsBillingModuleEnabled,
      isAmcModuleEnabled, setIsAmcModuleEnabled 
    } = appContext;
  const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    api.getDealerInfo().then(setDealerInfo);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!dealerInfo) return;
      const { name, value } = e.target;
      setDealerInfo({ ...dealerInfo, [name]: value });
  };
  
  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!dealerInfo) return;
      setIsSaving(true);
      setSaveMessage('');
      try {
          await api.updateDealerInfo(dealerInfo);
          setSaveMessage('Settings saved successfully!');
      } catch (error) {
          setSaveMessage('Failed to save settings.');
      } finally {
          setIsSaving(false);
          setTimeout(() => setSaveMessage(''), 3000);
      }
  };

  if (!dealerInfo) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800">Settings</h2>

      {/* Module Management */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Module Management</h3>
        <div className="space-y-4">
            <ToggleSwitch
                enabled={isBillingModuleEnabled}
                onChange={setIsBillingModuleEnabled}
                label="Billing & Invoicing Module"
                description="Enable invoice creation, tracking, and payment reminders."
            />
            <ToggleSwitch
                enabled={isAmcModuleEnabled}
                onChange={setIsAmcModuleEnabled}
                label="AMC Management Module"
                description="Enable tracking of Annual Maintenance Contracts for customers."
            />
             <ToggleSwitch
                enabled={isHrModuleEnabled}
                onChange={setIsHrModuleEnabled}
                label="HR & Payroll Module"
                description="Enable attendance, salary, and payslip management for technicians."
            />
        </div>
      </div>

      {/* Company & Payment Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Company & Payment Details</h3>
        <p className="text-sm text-slate-500 mb-6">This information will appear on invoices and payment reminders.</p>
        <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Company Name</label>
                    <input type="text" name="companyName" value={dealerInfo.companyName} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">GSTIN</label>
                    <input type="text" name="gstin" value={dealerInfo.gstin} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Company Address</label>
                <textarea name="address" value={dealerInfo.address} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
            </div>

            <hr className="my-6"/>
            <h4 className="text-lg font-semibold text-slate-700">Payment Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">UPI ID</label>
                    <input type="text" name="upiId" value={dealerInfo.upiId} onChange={handleChange} placeholder="e.g., your-vpa@okhdfcbank" className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Payment QR Code URL</label>
                    <input type="text" name="qrCodeUrl" value={dealerInfo.qrCodeUrl || ''} onChange={handleChange} placeholder="Link to your QR code image" className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Bank Name</label>
                    <input type="text" name="bankName" value={dealerInfo.bankName} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Account Number</label>
                    <input type="text" name="accountNo" value={dealerInfo.accountNo} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">IFSC Code</label>
                    <input type="text" name="ifscCode" value={dealerInfo.ifscCode} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
            </div>
            
            <div className="flex justify-end items-center pt-4">
                {saveMessage && <span className={`text-sm mr-4 ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{saveMessage}</span>}
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 disabled:bg-primary-300">
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;