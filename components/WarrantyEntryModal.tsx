
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { WarrantyEntry, WarrantyStatus, ServiceStation, WarrantyFollowUp } from '../types';
import BarcodeScanner from './BarcodeScanner';
import { CameraIcon } from './icons';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';

interface WarrantyEntryModalProps {
  onClose: () => void;
  onSuccess: () => void;
  entry?: WarrantyEntry;
}

const today = new Date().toISOString().split('T')[0];

const WarrantyEntryModal: React.FC<WarrantyEntryModalProps> = ({ onClose, onSuccess, entry }) => {
  const isEditMode = !!entry;

  // States for each section
  const [customerName, setCustomerName] = useState(entry?.customerName || '');
  const [productName, setProductName] = useState(entry?.productName || '');
  const [serialNumber, setSerialNumber] = useState(entry?.serialNumber || '');
  const [issue, setIssue] = useState(entry?.issue || '');
  const [pickupPerson, setPickupPerson] = useState(entry?.pickupPerson || '');

  const [officeIntakeDate, setOfficeIntakeDate] = useState(entry?.officeIntakeDate?.split('T')[0] || '');

  const [serviceStations, setServiceStations] = useState<ServiceStation[]>([]);
  const [serviceStationId, setServiceStationId] = useState(entry?.serviceStationId?.toString() || '');
  const [dispatchDate, setDispatchDate] = useState(entry?.dispatchDate?.split('T')[0] || '');
  const [courierInfo, setCourierInfo] = useState(entry?.courierInfo || '');

  const [followUpRemarks, setFollowUpRemarks] = useState('');
  const [personContacted, setPersonContacted] = useState('');

  const [returnDate, setReturnDate] = useState(entry?.returnDate?.split('T')[0] || '');
  const [finalStatus, setFinalStatus] = useState<WarrantyStatus>(entry?.status || 'Awaiting Pickup');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      api.getServiceStations().then(setServiceStations);
    }
  }, [isEditMode]);

  const handleScanSuccess = (data: string) => {
    setSerialNumber(data);
    setIsScannerOpen(false);
  };

  const handleUpdate = async (updateData: Partial<WarrantyEntry>) => {
    if (!entry) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.updateWarrantyEntry(entry.id, updateData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update entry.');
      setIsLoading(false);
    }
  }

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.addWarrantyEntry({ customerName, productName, serialNumber, issue, pickupPerson });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create entry.');
      setIsLoading(false);
    }
  };

  const addFollowUp = () => {
    if (!followUpRemarks) {
      alert("Please enter remarks for the follow-up.");
      return;
    }
    const newFollowUp: WarrantyFollowUp = {
      date: new Date().toISOString(),
      remarks: followUpRemarks,
      personContacted
    };
    handleUpdate({ followUps: [newFollowUp] });
  }

  const renderCreateForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Customer Name</label>
        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Product Name</label>
          <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Serial Number</label>
          <div className="mt-1 flex items-center gap-2">
            <input type="text" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            <button type="button" onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300" title="Scan Serial Number">
              <CameraIcon />
            </button>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Description of Issue</label>
        <textarea value={issue} onChange={e => setIssue(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Pickup Person Name</label>
        <input type="text" value={pickupPerson} onChange={e => setPickupPerson(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-primary-300">{isLoading ? 'Submitting...' : 'Submit Entry'}</button>
      </div>
    </form>
  );

  const renderManageForm = () => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Section: Office Intake */}
      <div className="p-4 border rounded-lg bg-slate-50">
        <h4 className="font-semibold text-slate-800 mb-2">Office Intake</h4>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <label className="block text-xs font-medium text-slate-600">Received Date</label>
            <CustomDatePicker
              selected={officeIntakeDate ? new Date(officeIntakeDate) : null}
              onChange={(d) => setOfficeIntakeDate(d ? d.toISOString().split('T')[0] : '')}
              maxDate={today ? new Date(today) : undefined}
            />
          </div>
          <button onClick={() => handleUpdate({ officeIntakeDate: new Date(officeIntakeDate).toISOString(), status: 'Received at Office' })} disabled={!officeIntakeDate || officeIntakeDate === entry?.officeIntakeDate?.split('T')[0]} className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-slate-300">Update</button>
        </div>
      </div>

      {/* Section: Service Dispatch */}
      <div className="p-4 border rounded-lg bg-slate-50">
        <h4 className="font-semibold text-slate-800 mb-2">Service Station Dispatch</h4>
        <div className="space-y-3">
          <div>
            <CustomSelect
              options={serviceStations.map(s => ({ value: s.id.toString(), label: s.name }))}
              value={serviceStationId}
              onChange={setServiceStationId}
              placeholder="Select station"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">Dispatch Date</label>
              <CustomDatePicker
                selected={dispatchDate ? new Date(dispatchDate) : null}
                onChange={(d) => setDispatchDate(d ? d.toISOString().split('T')[0] : '')}
                maxDate={today ? new Date(today) : undefined}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Courier Info</label>
              <input type="text" value={courierInfo} onChange={e => setCourierInfo(e.target.value)} className="mt-1 w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="text-right">
            <button onClick={() => handleUpdate({ serviceStationId: Number(serviceStationId), dispatchDate, courierInfo, status: 'Sent to Service' })} disabled={!serviceStationId || !dispatchDate} className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-slate-300">Update Dispatch</button>
          </div>
        </div>
      </div>

      {/* Section: Follow-up Log */}
      <div className="p-4 border rounded-lg bg-slate-50">
        <h4 className="font-semibold text-slate-800 mb-2">Follow-Up Log</h4>
        <div className="space-y-2 mb-3">
          {entry?.followUps.map((f, i) => (
            <div key={i} className="text-xs bg-white p-2 rounded border">
              <p className="font-semibold">{new Date(f.date).toLocaleString()}</p>
              <p>{f.remarks} {f.personContacted && `(Spoke to: ${f.personContacted})`}</p>
            </div>
          ))}
          {entry?.followUps.length === 0 && <p className="text-xs text-slate-500 text-center">No follow-ups logged yet.</p>}
        </div>
        <div className="space-y-2">
          <textarea placeholder="Add remarks..." value={followUpRemarks} onChange={e => setFollowUpRemarks(e.target.value)} rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm"></textarea>
          <div className="flex items-end gap-3">
            <div className="flex-grow">
              <label className="block text-xs font-medium text-slate-600">Person Contacted (optional)</label>
              <input type="text" value={personContacted} onChange={e => setPersonContacted(e.target.value)} className="mt-1 w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm" />
            </div>
            <button onClick={addFollowUp} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Follow-Up</button>
          </div>
        </div>
      </div>

      {/* Section: Return & Closure */}
      <div className="p-4 border rounded-lg bg-slate-50">
        <h4 className="font-semibold text-slate-800 mb-2">Return & Closure</h4>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <CustomSelect
              label="Final Status"
              options={[
                { value: 'Under Repair', label: 'Under Repair' },
                { value: 'Repaired', label: 'Repaired' },
                { value: 'Replaced', label: 'Replaced' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Returned to Customer', label: 'Returned to Customer' }
              ]}
              value={finalStatus}
              onChange={(val) => setFinalStatus(val as WarrantyStatus)}
              placeholder="Select Status"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Return Date</label>
            <CustomDatePicker
              selected={returnDate ? new Date(returnDate) : null}
              onChange={(d) => setReturnDate(d ? d.toISOString().split('T')[0] : '')}
              maxDate={today ? new Date(today) : undefined}
            />
          </div>
        </div>
        <div className="text-right mt-3">
          <button onClick={() => handleUpdate({ status: finalStatus, returnDate })} className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">Update Final Status</button>
        </div>
      </div>

      {error && <p className="text-sm text-center text-red-600">{error}</p>}

      <div className="flex justify-end pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Close</button>
      </div>
    </div>
  );

  return (
    <>
      {isScannerOpen && <BarcodeScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{isEditMode ? `Manage: ${entry.serialNumber}` : 'New Warranty Entry'}</h3>
              {isEditMode && <p className="text-sm text-slate-500">{entry.customerName} - {entry.productName}</p>}
            </div>
            <button onClick={onClose} className="text-2xl font-light text-slate-500 hover:text-slate-800">&times;</button>
          </div>

          {isEditMode ? renderManageForm() : renderCreateForm()}

        </div>
      </div>
    </>
  );
};

export default WarrantyEntryModal;
