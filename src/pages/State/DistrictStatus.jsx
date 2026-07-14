import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/UIComponents';
import { MapPin, Search } from 'lucide-react';
import { DISTRICTS } from '../../data/mockData';

export default function DistrictStatus() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="page-title"><MapPin size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Tamil Nadu Districts</div>
          <div className="page-subtitle">Select a district to view Collector and Taluk hierarchy</div>
        </div>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <div style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }}>
            <Search size={16} />
          </div>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search districts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, width: '100%', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
          />
        </div>
      </div>
      
      {/* Grid Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px',
        padding: '10px 0'
      }}>
        {filteredDistricts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No districts found matching "{searchTerm}"
          </div>
        ) : (
          filteredDistricts.map(d => (
            <div 
              key={d.id} 
              style={{ 
                background: 'var(--bg-surface)', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid var(--border-light)'
              }}
              onClick={() => navigate(`/state/monitor/${d.name}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              {/* Image Section */}
              <div style={{ 
                height: '140px', 
                width: '100%', 
                backgroundImage: `url(${d.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {/* Overlay gradient for text readability if needed */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '12px'
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '16px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {d.name}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
