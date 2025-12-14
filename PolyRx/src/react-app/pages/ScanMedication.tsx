import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Check, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMedications } from '@/react-app/hooks/useMedications';

const MOCK_DRUGS = [
  { name: 'Warfarin', dosage: '5mg daily' },
  { name: 'Aspirin', dosage: '81mg daily' },
  { name: 'Ibuprofen', dosage: '200mg as needed' },
  { name: 'Lisinopril', dosage: '10mg daily' },
];

export default function ScanMedication() {
  const navigate = useNavigate();
  const { addMedication } = useMedications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [scanning, setScanning] = useState(false);
  const [scannedDrug, setScannedDrug] = useState<{ name: string; dosage: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate OCR processing
    setScanning(true);
    setScannedDrug(null);

    setTimeout(() => {
      // Randomly select a drug from the mock list
      const randomDrug = MOCK_DRUGS[Math.floor(Math.random() * MOCK_DRUGS.length)];
      setScannedDrug(randomDrug);
      setScanning(false);
    }, 2000);
  };

  const handleAddToCabinet = () => {
    if (scannedDrug) {
      addMedication(scannedDrug.name, scannedDrug.dosage);
      navigate('/');
    }
  };

  const handleReset = () => {
    setScannedDrug(null);
    setPreviewImage(null);
    setScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-mesh opacity-30 animate-pulse-slow pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-blue-500 text-white px-6 py-10 shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 -translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 translate-x-24"></div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 animate-float">
              <Camera className="w-12 h-12" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-1">Scan Medication</h1>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <p className="text-xl opacity-95">AI-powered label reading</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-10 relative z-10">
        {!previewImage && !scanning && !scannedDrug && (
          <div className="text-center">
            <div className="relative group mb-10">
              {/* Animated glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-green-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
              
              <div className="relative glass border-4 border-white/50 rounded-3xl p-16 shadow-2xl">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-full w-28 h-28 flex items-center justify-center shadow-xl">
                    <Camera className="w-14 h-14" strokeWidth={2.5} />
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Ready to Scan
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                  Our advanced AI can read medication labels, including handwritten prescriptions
                </p>
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Powered</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Accurate</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            
            <label
              htmlFor="file-input"
              className="group inline-flex items-center gap-4 px-12 py-7 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-blue-500 text-white text-2xl font-bold cursor-pointer shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Upload className="w-8 h-8 relative z-10" strokeWidth={2.5} />
              <span className="relative z-10">Choose Image or Take Photo</span>
            </label>
          </div>
        )}

        {previewImage && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl opacity-50 group-hover:opacity-75 blur transition-opacity"></div>
              <div className="relative glass border-4 border-white/50 rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src={previewImage} 
                  alt="Medication bottle" 
                  className="w-full h-auto"
                />
              </div>
            </div>

            {scanning && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative glass border-2 border-white/50 rounded-3xl p-10 text-center shadow-xl">
                  <div className="inline-block mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 rounded-full blur-lg opacity-60"></div>
                      <Loader2 className="relative w-20 h-20 text-blue-600 animate-spin" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                    Reading Label...
                  </h3>
                  <p className="text-xl text-gray-600">
                    AI is analyzing the image
                  </p>
                </div>
              </div>
            )}

            {scannedDrug && (
              <div className="relative animate-in slide-in-from-bottom-4 duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                
                <div className="relative glass border-4 border-white/50 rounded-3xl p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur-md opacity-60"></div>
                      <div className="relative bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-lg">
                        <Check className="w-10 h-10" strokeWidth={3} />
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Medication Detected
                    </h3>
                  </div>

                  <div className="glass-dark border-2 border-white/30 rounded-2xl p-8 mb-8 shadow-inner">
                    <p className="text-sm text-gray-600 uppercase font-bold mb-3 tracking-wide">
                      Medication Name
                    </p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                      {scannedDrug.name}
                    </p>
                    
                    <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-6"></div>
                    
                    <p className="text-sm text-gray-600 uppercase font-bold mb-3 tracking-wide">
                      Dosage
                    </p>
                    <p className="text-3xl font-bold text-gray-700">
                      {scannedDrug.dosage}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleAddToCabinet}
                      className="group w-full relative overflow-hidden px-8 py-7 rounded-2xl bg-gradient-to-r from-green-600 to-blue-500 text-white text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <Sparkles className="w-7 h-7" />
                        <span>Add to My Cabinet</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="w-full glass-dark border-2 border-white/30 text-gray-700 py-6 rounded-2xl text-xl font-semibold hover:bg-white/30 transition-all"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
