import React, { createContext, useContext, useEffect, useState } from 'react';
import { INCIDENTS, RESOURCES } from '../data/mockData';
import { useAuth } from './AuthContext';

const LiveContext = createContext();

export function LiveProvider({ children }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;

      INCIDENTS.forEach(inc => {
        // 1 & 3: Move resources and update ETA
        if (inc.resources) {
          inc.resources.forEach(r => {
            if (r.eta > 0) {
              r.eta -= 1;
              changed = true;
              if (r.eta <= 0) {
                r.eta = 0;
                r.status = 'On Scene';
              }
            }
            if (r.status === 'En Route' && r.lat && r.lng && inc.location) {
              const dLat = inc.location.lat - r.lat;
              const dLng = inc.location.lng - r.lng;
              r.lat += dLat * 0.15; // move 15% closer
              r.lng += dLng * 0.15;
              changed = true;
            }
          });
        }

        // 2. Growing Live Department Feed
        if (['Waiting for Collector', 'District Coordinated', 'Resources Active', 'Broadcasting', 'Broadcast Completed'].includes(inc.status) && Math.random() > 0.4) {
          if (!inc.departmentUpdates) inc.departmentUpdates = [];
          const fakeMessages = [
            "Fire — Additional tanker requested",
            "Police — Route cleared for emergency vehicles",
            "Medical — Patient stabilized on site",
            "Fire — Fire contained in Sector B",
            "Police — Perimeter secured",
            "Rescue — Evacuation of Sector C complete",
            "Medical — 3 additional ambulances en route"
          ];
          const newMsg = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
          inc.departmentUpdates.unshift({
            dept: newMsg.split(' — ')[0],
            message: newMsg.split(' — ')[1],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: newMsg.startsWith('Fire') ? '🔥' : newMsg.startsWith('Police') ? '👮' : newMsg.startsWith('Medical') ? '🚑' : '🚨'
          });
          if (inc.departmentUpdates.length > 8) inc.departmentUpdates.pop();
          changed = true;
        }
        
        // 4. Jitter population at risk
        if (inc.populationAtRisk && Math.random() > 0.5) {
          inc.populationAtRisk += Math.floor(Math.random() * 5) - 1;
          changed = true;
        }
      });

      if (changed) {
        setTick(t => t + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LiveContext.Provider value={{ tick }}>
      {children}
    </LiveContext.Provider>
  );
}

export const useLive = () => {
  const context = useContext(LiveContext);
  return context ? context.tick : 0;
};

export const useIncidents = () => {
  const { user } = useAuth();
  useLive(); // triggers re-render on ticks
  
  if (!user) return INCIDENTS;
  
  return INCIDENTS.filter(inc => {
    if (user.role === 'district' && user.district) return inc.district === user.district;
    if (user.role === 'taluk' && user.taluk) return inc.taluk === user.taluk && inc.district === user.district;
    if (user.role === 'village' && user.village) return inc.village === user.village && inc.taluk === user.taluk;
    return true; // Collector and State see all
  });
};
