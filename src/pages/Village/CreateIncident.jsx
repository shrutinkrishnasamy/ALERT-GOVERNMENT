import { useState, useRef } from 'react';
import { AIPanel, SeverityBadge, AlertBanner } from '../../components/common/UIComponents';
import GISMap from '../../components/Map/GISMap';
import { MapPin, Mic, Brain, Upload, AlertTriangle, CheckCircle, Loader, Bot, PlusCircle, ShieldAlert, ClipboardList, AlertCircle, XCircle, XOctagon, Flame, Camera } from 'lucide-react';
import Swal from 'sweetalert2';

const CATEGORIES = ['Fire', 'Flood', 'Road Accident', 'Chemical/HazMat', 'Earthquake', 'Cyclone', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Severe', 'Extremely Severe'];

export default function CreateIncident() {
  const [form, setForm] = useState({
    category: '', severity: '', description: '', location: '', lat: 10.9102, lng: 76.9558,
    fieldNotes: '',
  });
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Camera Error', text: 'Could not access the camera. Please check permissions.' });
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Add Timestamp and GPS overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      
      ctx.fillStyle = 'white';
      ctx.font = '16px sans-serif';
      const dateStr = new Date().toLocaleString();
      const locationStr = `Lat: ${form.lat.toFixed(6)}, Lng: ${form.lng.toFixed(6)}`;
      ctx.fillText(dateStr, 10, canvas.height - 35);
      ctx.fillText(locationStr, 10, canvas.height - 15);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `Live_Capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFiles(prev => [...prev, file]);
          closeCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleLocationSearch = async () => {
    if (!form.location) return;
    setIsSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setForm(f => ({
          ...f,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Location found', showConfirmButton: false, timer: 2000 });
      } else {
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Location not found', showConfirmButton: false, timer: 2000 });
      }
    } catch (err) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Search failed', showConfirmButton: false, timer: 2000 });
    }
    setIsSearchingLocation(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAIAnalyze = async () => {
    if (!form.description) return;
    setAiProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setAiResult({
      category: form.category || 'Fire',
      severity: 'High',
      duplicateCheck: false,
      spamCheck: false,
      confidence: 87,
      summary: 'Based on description analysis: fire-related incident with chemical storage proximity detected. Wind conditions increase spread risk.',
      recommendation: 'Mark as High severity. Request Taluk verification urgently.',
    });
    setAiProcessing(false);
    setForm(f => ({ ...f, severity: 'High', category: f.category || 'Fire' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(f => ({
            ...f,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Location updated via GPS',
            showConfirmButton: false,
            timer: 2000
          });
        },
        (error) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Unable to get location',
            text: error.message,
            showConfirmButton: false,
            timer: 3000
          });
        }
      );
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Geolocation not supported',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: '40px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}><CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /></div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--severity-low)', marginBottom: '8px' }}>Incident Submitted!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Incident ID: <strong style={{ fontFamily: 'JetBrains Mono', color: 'var(--primary)' }}>INC-2024-005</strong> created successfully.</p>
        <div className="ai-panel" style={{ textAlign: 'left' }}>
          <div className="ai-panel-header"><Bot size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> AI PROCESSING COMPLETE</div>
          <p><CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> No duplicate detected · <CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Spam check passed · <Flame size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Severity: <strong>High (87% confidence)</strong> · Forwarding to Taluk Officer for verification...</p>
        </div>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '16px' }}>Create Another</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><PlusCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Create New Incident</div>
          <div className="page-subtitle">Report an emergency to initiate the AlertGov response chain</div>
        </div>

      </div>


      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* Left: Form */}
          <div>
            <div className="card">
              <div className="card-header">
                <div className="card-title"><ClipboardList size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Incident Information</div>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Emergency Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" rows={4} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the emergency in detail. Include what you see, hear, or smell. Number of people affected, direction of spread, etc."
                  />
                  <div className="form-hint">Use voice-to-text: <button type="button" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}><Mic size={11} /> Record Voice</button></div>
                </div>

                <div className="form-group">
                  <label className="form-label">Field Notes</label>
                  <textarea className="form-textarea" rows={2} value={form.fieldNotes}
                    onChange={e => setForm(f => ({ ...f, fieldNotes: e.target.value }))}
                    placeholder="Additional observations: Is it spreading? What resources are already on scene?"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Severity (AI-Assisted)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {SEVERITIES.map(s => (
                      <div key={s} 
                        style={{
                           padding: '12px 4px',
                           textAlign: 'center',
                           borderRadius: 'var(--radius-sm)',
                           border: form.severity === s ? '1px solid var(--primary)' : '1px solid var(--border)',
                           background: form.severity === s ? 'var(--primary-light)' : 'rgba(0,0,0,0.2)',
                           cursor: 'pointer',
                           transition: 'all 0.2s',
                           fontSize: '11px',
                           fontWeight: form.severity === s ? 700 : 500,
                           boxShadow: form.severity === s ? 'var(--shadow-glow)' : 'none'
                        }}
                        onClick={() => setForm(f => ({ ...f, severity: s }))}>
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                          {s === 'Low' ? <CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> : s === 'Medium' ? <AlertCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> : s === 'High' ? <AlertTriangle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> : s === 'Severe' ? <XCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> : <XOctagon size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} />}
                        </div>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload area */}
                <div className="form-group">
                  <label className="form-label">Evidence Upload (Photos / Videos / Documents)</label>
                  <div 
                    className="upload-area"
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={handleDrop}
                  >
                    <div className="upload-icon">📎</div>
                    <div className="upload-text">Drag & drop files here</div>
                    <div className="upload-hint">Supports: JPG, PNG, MP4, PDF, Voice (WAV)</div>
                    <input type="file" id="evidence-upload" multiple hidden onChange={handleFileSelect} />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => document.getElementById('evidence-upload').click()}>
                        <Upload size={13} /> Browse Files
                      </button>
                      <button type="button" className="btn btn-primary btn-sm" onClick={openCamera}>
                        <Camera size={13} /> Take Live Photo
                      </button>
                    </div>
                  </div>
                  
                  {files.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {files.map((file, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', fontSize: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {file.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ClipboardList size={16} color="var(--primary)" />
                              </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                          <button type="button" style={{ background: 'none', border: 'none', color: 'var(--severity-high)', cursor: 'pointer', padding: '4px' }} onClick={() => removeFile(idx)}>
                            <XCircle size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map + AI */}
          <div>
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">
                <div className="card-title"><MapPin size={14} /> Incident Location</div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <GISMap 
                  center={[form.lat, form.lng]} 
                  zoom={13} 
                  height={280} 
                  draggableMarker={true}
                  onMarkerDragEnd={(lat, lng) => setForm(f => ({ ...f, lat, lng }))}
                />
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="form-input" placeholder="Address / landmark..." value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLocationSearch(); } }}
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleLocationSearch} disabled={isSearchingLocation}>
                      {isSearchingLocation ? <Loader size={14} className="spin" /> : 'Search'}
                    </button>
                  </div>
                  <div className="form-hint" style={{ marginTop: '6px' }}>
                    <MapPin size={11} style={{ display: 'inline' }} /> GPS: {form.lat.toFixed(4)}, {form.lng.toFixed(4)} · <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={handleUseMyLocation}><MapPin size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Use My Location</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Bot size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> AI Analysis</div>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleAIAnalyze} disabled={!form.description || aiProcessing}>
                  {aiProcessing ? <><Loader size={13} className="spin" /> Analyzing...</> : <><Brain size={13} /> Run AI Analysis</>}
                </button>
              </div>
              <div className="card-body">
                {!aiResult && !aiProcessing && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Enter description and click "Run AI Analysis" to get AI-powered severity prediction, duplicate check, and recommendations.
                  </div>
                )}
                {aiProcessing && (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}><Bot size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /></div>
                    <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Running AI Analysis...</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Checking duplicates · Predicting severity · Generating summary</div>
                  </div>
                )}
                {aiResult && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ background: 'var(--severity-low-bg)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px' }}><CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /></div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--severity-low)' }}>No Duplicate</div>
                      </div>
                      <div style={{ background: 'var(--severity-low-bg)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px' }}><CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /></div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--severity-low)' }}>Not Spam</div>
                      </div>
                    </div>
                    <div style={{ background: 'var(--severity-medium-bg)', borderRadius: '6px', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--severity-medium)' }}>AI Predicted Severity</span>
                      <SeverityBadge severity={aiResult.severity} />
                    </div>
                    <AIPanel summary={aiResult.summary} recommendation={aiResult.recommendation} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button type="button" className="btn btn-secondary">Save as Draft</button>
          <button type="submit" className="btn btn-primary btn-lg">
            <CheckCircle size={16} /> Submit Incident
          </button>
        </div>
      </form>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {isCameraOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Live Camera Capture</h3>
              <button type="button" onClick={closeCamera} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={20} /></button>
            </div>
            <video ref={videoRef} style={{ width: '100%', maxWidth: '500px', borderRadius: '4px', background: '#000' }} autoPlay playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button type="button" className="btn btn-primary" onClick={capturePhoto} style={{ width: '100%', justifyContent: 'center' }}>
                <Camera size={16} /> Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
