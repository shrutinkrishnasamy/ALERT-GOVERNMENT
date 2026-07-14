import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { INCIDENTS, DISTRICTS, USERS } from '../../data/mockData';
import { Card } from '../../components/common/UIComponents';
import { ChevronLeft, Users as UsersIcon, AlertTriangle, ShieldAlert, Clock, MapPin, Activity, Map, ChevronDown, ChevronRight, BookOpen, UserCircle } from 'lucide-react';

export default function DistrictMonitor() {
  const { district } = useParams();
  const navigate = useNavigate();
  const [expandedTaluks, setExpandedTaluks] = useState({});

  // Find district data
  const distData = DISTRICTS.find(d => d.name === district);
  const distIncidents = INCIDENTS.filter(i => i.district === district);
  const distUsers = USERS.filter(u => u.district === district);

  const collector = distUsers.find(u => u.role === 'collector') || { name: distData?.collector || 'Unknown Collector', title: 'District Collector' };
  const taluks = distUsers.filter(u => u.role === 'taluk');
  const veos = distUsers.filter(u => u.role === 'village');

  if (!distData) {
    return <div style={{ padding: 40, textAlign: 'center' }}>District not found.</div>;
  }

  const criticalCount = distIncidents.filter(i => i.severity === 'Extremely Severe' || i.severity === 'Severe' || i.severity === 'High').length;

  const toggleTaluk = (talukId) => {
    setExpandedTaluks(prev => ({
      ...prev,
      [talukId]: !prev[talukId]
    }));
  };

  return (
    <div className="animate-in" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/state')} style={{ padding: 0, marginBottom: 10, color: 'var(--text-muted)' }}>
            <ChevronLeft size={14} /> Back to State Dashboard
          </button>
          <div className="page-title">{district} District Monitor</div>
          <div className="page-subtitle">Real-time surveillance and officer hierarchy</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Health Score</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: distData.healthScore === 'Green' ? 'var(--severity-low)' : distData.healthScore === 'Yellow' ? 'var(--severity-medium)' : 'var(--severity-severe)' }}>
            {distData.healthScore}
          </div>
        </div>
      </div>

      {/* NEW: District Profile Header Section */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Banner and Map Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', height: '300px' }}>
          {/* Panoramic Banner */}
          <div style={{ 
            backgroundImage: `url(https://www.tn.gov.in/sites/default/district-images/slide-images/${encodeURIComponent(distData.name.replace(/\s+/g, ''))}.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            {/* Fallback styling if image fails to load, though we know TN gov uses this format */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '30px 20px 15px 20px' }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '32px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{distData.name}</h2>
            </div>
          </div>
          
          {/* Embedded Google Map */}
          <div style={{ borderLeft: '1px solid var(--border)' }}>
             <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                allowFullScreen 
                referrerPolicy="no-referrer-when-downgrade" 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(distData.name + " District, Tamil Nadu")}&t=&z=9&ie=UTF8&iwloc=&output=embed`}>
              </iframe>
          </div>
        </div>

        {/* Info Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderRight: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '50%' }}>
              <Map size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Area</div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>{distData.area || 'Unknown'}</div>
            </div>
          </div>
          
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderRight: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '50%' }}>
              <UsersIcon size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Population</div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>{(distData.population / 1000000).toFixed(1)} Million</div>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderRight: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '50%' }}>
              <MapPin size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>District Headquarters</div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>{distData.headquarters || distData.name}</div>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '50%' }}>
              <BookOpen size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Language</div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>{distData.language || 'Tamil'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout below Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* Sidebar - Officer Hierarchy (Moved to left for prominence) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UsersIcon size={18} /> Officer Hierarchy
              </span>
            </div>
            <div style={{ padding: '20px' }}>
              
              {/* Collector Profile Card */}
              <div style={{ 
                border: '1px solid var(--border)', 
                borderRadius: '12px', 
                padding: '20px', 
                marginBottom: '24px', 
                background: 'linear-gradient(to bottom right, var(--bg-surface), var(--bg-secondary))', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(collector.name)}&background=0D8ABC&color=fff&size=128)`,
                  backgroundSize: 'cover',
                  border: '3px solid white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--primary)', marginBottom: 6, fontWeight: 800 }}>District Collector</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, color: 'var(--text-main)' }}>{collector.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{collector.email || `${district} District`}</div>
                  <div style={{ 
                    display: 'inline-block',
                    fontSize: 12, 
                    color: 'var(--text-main)', 
                    background: 'var(--bg-primary)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    border: '1px solid var(--border)'
                  }}>
                    {collector.phone || '+91 98765 43210'}
                  </div>
                </div>
              </div>

              {/* Expandable Taluks & VEOs */}
              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px', letterSpacing: '0.5px' }}>Taluk Jurisdictions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {taluks.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>No mapped Taluks in system</div>
                  ) : (
                    taluks.map(taluk => (
                      <div key={taluk.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                        
                        {/* Taluk Header (Clickable) */}
                        <div 
                          onClick={() => toggleTaluk(taluk.id)}
                          style={{ 
                            padding: '12px 15px', 
                            background: expandedTaluks[taluk.id] ? 'var(--bg-secondary)' : 'var(--bg-surface)', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{taluk.taluk} Taluk</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{taluk.name}</div>
                          </div>
                          <div style={{ color: 'var(--text-muted)' }}>
                            {expandedTaluks[taluk.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                        </div>

                        {/* Elaborated VEOs View */}
                        {expandedTaluks[taluk.id] && (
                          <div style={{ padding: '15px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 600 }}>Village Emergency Operators</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {veos.filter(v => v.taluk === taluk.taluk).map(veo => (
                                <div key={veo.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                    {veo.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{veo.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                      <MapPin size={10} style={{ display: 'inline', marginRight: 2 }} />
                                      {veo.village} Village
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {veos.filter(v => v.taluk === taluk.taluk).length === 0 && (
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>No VEOs mapped to this Taluk</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* Main Content Area (Analytics & Incidents) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Analytics Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <Card>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <Activity size={28} style={{ color: 'var(--primary)', marginBottom: 12 }} />
                <div style={{ fontSize: 28, fontWeight: 900 }}>{distIncidents.length}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Total Incidents</div>
              </div>
            </Card>
            <Card>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <AlertTriangle size={28} style={{ color: 'var(--severity-severe)', marginBottom: 12 }} />
                <div style={{ fontSize: 28, fontWeight: 900 }}>{criticalCount}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Critical Severity</div>
              </div>
            </Card>
            <Card>
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <ShieldAlert size={28} style={{ color: 'var(--severity-medium)', marginBottom: 12 }} />
                <div style={{ fontSize: 28, fontWeight: 900 }}>{distData.activeIncidents}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Currently Active</div>
              </div>
            </Card>
          </div>

          {/* Incident Tracking Table */}
          <Card>
            <div className="card-header" style={{ padding: '20px' }}>
              <span className="card-title" style={{ fontSize: '16px' }}>Incident Deep-Dive</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Incident</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Created By</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Taluk</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time / Date</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {distIncidents.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <div style={{ marginBottom: '10px' }}><Activity size={32} style={{ opacity: 0.2, margin: '0 auto' }} /></div>
                        No incidents found for this district.
                      </td>
                    </tr>
                  ) : (
                    distIncidents.map(inc => (
                      <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{inc.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{inc.category} | {inc.village}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                              {inc.reportedBy.slice(0,2)}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{inc.reportedBy}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
                            <MapPin size={12} /> {inc.taluk}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                            <Clock size={14} /> {new Date(inc.reportedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span className={`badge badge-${inc.status.includes('Collector') ? 'orange' : inc.status === 'Broadcasted' ? 'red' : 'green'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                            {inc.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
