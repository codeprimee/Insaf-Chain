import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Banknote,
  HandMetal,
  Handshake,
  FileQuestion,
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  MapPin,
  Loader2,
  LocateFixed,
} from 'lucide-react';
import api from '../api/axios-config';
import BlockchainLoadingOverlay from '../components/BlockchainLoadingOverlay';

const CATEGORIES = [
  { value: 'Crime',      label: 'Crime',      icon: AlertTriangle, color: 'text-red-400',    borderActive: 'border-red-500/50 bg-red-500/10',    description: 'Theft, robbery, violence, street crime' },
  { value: 'Corruption', label: 'Corruption', icon: Banknote,      color: 'text-yellow-400', borderActive: 'border-yellow-500/50 bg-yellow-500/10', description: 'Misuse of power, illegal favors, fund misuse' },
  { value: 'Harassment', label: 'Harassment', icon: HandMetal,     color: 'text-orange-400', borderActive: 'border-orange-500/50 bg-orange-500/10', description: 'Physical, verbal, workplace, online harassment' },
  { value: 'Bribery',    label: 'Bribery',    icon: Handshake,     color: 'text-purple-400', borderActive: 'border-purple-500/50 bg-purple-500/10', description: 'Demanding or giving bribes to officials' },
  { value: 'Other',      label: 'Other',      icon: FileQuestion,  color: 'text-slate-400',  borderActive: 'border-slate-500/50 bg-slate-500/10',  description: 'Any other incident worth reporting' },
];

const STEPS = ['Category', 'Details', 'Location', 'Review & Submit'];

function SubmitReportPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting,    setSubmitting]    = useState(false);
  const [overlayDone,   setOverlayDone]  = useState(false);
  const [error,         setError]        = useState('');

  const [category,         setCategory]         = useState('');
  const [title,            setTitle]            = useState('');
  const [description,      setDescription]      = useState('');
  const [locationAddress,  setLocationAddress]  = useState('');
  const [locationLat,      setLocationLat]      = useState(null);
  const [locationLng,      setLocationLng]      = useState(null);
  const [gpsLoading,       setGpsLoading]       = useState(false);
  const [files,            setFiles]            = useState([]);

  const canGoNext = () => {
    if (currentStep === 0) return category !== '';
    if (currentStep === 1) return description.length >= 20;
    return true;
  };

  const goNext = () => {
    if (canGoNext() && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 3) { setError('Maximum 3 files allowed.'); return; }
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) { setError(`"${file.name}" exceeds 5MB limit.`); return; }
    }
    setFiles([...files, ...newFiles]);
    setError('');
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setLocationLat(parseFloat(lat));
        setLocationLng(parseFloat(lng));
        setLocationAddress(`Near GPS location (${lat}, ${lng})`);
        setGpsLoading(false);
      },
      () => {
        setError('Could not get your location. Please type it manually.');
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOverlayDone(false);
    setError('');
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('description', description);
      if (title.trim()) formData.append('title', title.trim());
      if (locationAddress) formData.append('location[address]', locationAddress);
      if (locationLat != null) formData.append('location[latitude]',  String(locationLat));
      if (locationLng != null) formData.append('location[longitude]', String(locationLng));
      files.forEach((file) => formData.append('attachments', file));

      // This call may take 15-30 s while waiting for Sepolia block confirmation
      const response = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000, // 2-minute timeout for blockchain mining
      });

      if (response.data.success) {
        setOverlayDone(true); // advance overlay to "Report secured"
        // Small pause so the user sees the final step before navigating
        await new Promise((r) => setTimeout(r, 900));
        navigate('/report-submitted', {
          state: {
            trackingId:       response.data.data.trackingId,
            category:         response.data.data.category,
            status:           response.data.data.status,
            blockchainTxHash: response.data.data.blockchainTxHash || null,
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
      setOverlayDone(false);
    }
  };

  return (
    <>
    <BlockchainLoadingOverlay visible={submitting} done={overlayDone} />
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F17] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white text-center mb-2">
          Submit a Report
        </h1>
        <p className="text-slate-500 dark:text-[#9CA3AF] text-center mb-8">
          Your identity will not be collected. This report is fully anonymous.
        </p>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-[#1E3A5F] dark:bg-[#4ade80] text-white dark:text-[#0a0f1a] shadow-lg'
                    : 'bg-gray-200 dark:bg-[#1F2937] text-gray-500 dark:text-[#6B7280]'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block transition-colors duration-300 ${
                  index <= currentStep ? 'text-[#1E3A5F] dark:text-[#4ade80] font-medium' : 'text-gray-400 dark:text-[#6B7280]'
                }`}>
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 transition-colors duration-500 ${
                  index < currentStep ? 'bg-[#1E3A5F] dark:bg-[#4ade80]' : 'bg-gray-200 dark:bg-[#1F2937]'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200 dark:border-[#1F2937]/60 p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Category */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white mb-1">What are you reporting?</h2>
              <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-6">Select the category that best describes the incident.</p>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                        isSelected
                          ? `${cat.borderActive} shadow-md`
                          : 'border-gray-200 dark:border-[#1F2937] hover:border-gray-300 dark:hover:border-[#374151] bg-white dark:bg-[#111827]/60'
                      }`}
                    >
                      <div className={`${cat.color} transition-transform group-hover:scale-110`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#1E3A5F] dark:text-[#E5E7EB]">{cat.label}</span>
                        <p className="text-sm text-slate-500 dark:text-[#9CA3AF]">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Title + Description */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white mb-1">Describe the incident</h2>
              <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-5">Provide as much detail as possible.</p>

              {/* Title (optional) */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 dark:text-[#9CA3AF] uppercase tracking-wide block mb-1.5">
                  Title <span className="text-slate-400 dark:text-[#6B7280] font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Officer demanded bribe at checkpoint"
                  maxLength={120}
                  className="w-full border border-gray-300 dark:border-[#374151] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] dark:bg-[#1F2937]/60 dark:text-[#E5E7EB] dark:placeholder-[#6B7280]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-[#9CA3AF] uppercase tracking-wide block mb-1.5">
                  Description <span className="text-red-400 text-xs font-bold">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened, when, and any other relevant details..."
                  rows={7}
                  className="w-full border border-gray-300 dark:border-[#374151] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] dark:bg-[#1F2937]/60 dark:text-[#E5E7EB] dark:placeholder-[#6B7280] resize-none"
                />
                <span className={`text-xs mt-1 block ${description.length < 20 ? 'text-red-500' : 'text-slate-400 dark:text-[#6B7280]'}`}>
                  {description.length < 20
                    ? `Minimum 20 characters (${20 - description.length} more needed)`
                    : `${description.length} characters`}
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Location + Files */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white mb-1">Location <span className="text-slate-400 dark:text-[#6B7280] text-base font-normal">(Optional)</span></h2>
              <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-5">Add a location to help identify high-risk areas.</p>

              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-[#6B7280]" />
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => {
                      setLocationAddress(e.target.value);
                      setLocationLat(null);
                      setLocationLng(null);
                    }}
                    placeholder="e.g. Mall Road, Lahore"
                    className="w-full border border-gray-300 dark:border-[#374151] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] dark:bg-[#1F2937]/60 dark:text-[#E5E7EB] dark:placeholder-[#6B7280]"
                  />
                </div>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={gpsLoading}
                  title="Use current GPS location"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-[#374151] bg-white dark:bg-[#1F2937]/60 text-slate-600 dark:text-[#9CA3AF] hover:bg-gray-50 dark:hover:bg-[#374151]/50 transition text-sm font-medium disabled:opacity-50 shrink-0"
                >
                  {gpsLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <LocateFixed className="w-4 h-4" />}
                  <span className="hidden sm:inline">Use GPS</span>
                </button>
              </div>

              {locationLat != null && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-4">
                  ✓ GPS location captured ({locationLat.toFixed(4)}, {locationLng?.toFixed(4)})
                </p>
              )}

              {/* File Attachments */}
              <div className="mt-7">
                <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-1">Evidence / Attachments <span className="text-slate-400 font-normal">(Optional)</span></h3>
                <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-4">Max 3 files, 5MB each. Accepted: JPG, PNG, PDF, DOC.</p>
                {files.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-[#1F2937]/60 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#374151]">
                        <span className="text-sm text-slate-600 dark:text-[#E5E7EB] truncate mr-2">
                          {file.name} ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                        <button onClick={() => removeFile(index)} className="text-red-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {files.length < 3 && (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-[#374151] rounded-xl py-4 cursor-pointer hover:border-[#4ade80] dark:hover:border-[#4ade80] hover:bg-gray-50 dark:hover:bg-[#1F2937]/40 transition">
                    <Upload className="w-5 h-5 text-slate-400 dark:text-[#6B7280]" />
                    <span className="text-sm text-slate-500 dark:text-[#9CA3AF]">Click to upload files</span>
                    <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={handleFileAdd} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white mb-1">Review Your Report</h2>
              <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-6">Verify everything before submitting. Reports cannot be edited after submission.</p>
              <div className="space-y-4">
                <ReviewField label="Category"    value={category} />
                {title.trim() && <ReviewField label="Title" value={title.trim()} />}
                <ReviewField label="Description" value={description} />
                <ReviewField label="Location"    value={locationAddress || 'Not provided'} />
                <ReviewField label="Attachments" value={files.length > 0 ? files.map((f) => f.name).join(', ') : 'No files attached'} />
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 mt-6">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  <strong>Privacy guarantee:</strong> No personal information is collected.
                  Your report will be validated by AI, stored on the blockchain, and made available anonymously to authorized organizations.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-300 dark:text-[#374151] cursor-not-allowed'
                  : 'text-slate-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-[#1F2937]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  canGoNext()
                    ? 'bg-[#1E3A5F] dark:bg-[#4ade80] text-white dark:text-[#0a0f1a] hover:opacity-90 shadow-md'
                    : 'bg-gray-200 dark:bg-[#1F2937] text-gray-400 dark:text-[#6B7280] cursor-not-allowed'
                }`}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Report'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function ReviewField({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-[#1F2937]/60 rounded-xl px-4 py-3 border border-gray-200 dark:border-[#374151]/60">
      <span className="text-xs font-medium text-slate-400 dark:text-[#6B7280] uppercase">{label}</span>
      <p className="text-sm text-[#1E3A5F] dark:text-[#E5E7EB] mt-1 whitespace-pre-wrap break-words">{value}</p>
    </div>
  );
}

export default SubmitReportPage;
