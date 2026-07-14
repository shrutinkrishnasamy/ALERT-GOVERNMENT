import GISMap from '../../components/Map/GISMap';
import { INCIDENTS } from '../../data/mockData';
import { Card } from '../../components/common/UIComponents';

export default function DistrictSituationMap() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🗺️ District Situation Map</div>
          <div className="page-subtitle">Executive overview of all district operations</div>
        </div>
      </div>
      <Card>
        <div style={{ padding: 0 }}>
          <GISMap
            center={[10.95, 76.95]}
            zoom={11}
            height={600}
            incidents={INCIDENTS}
            showRadius={true}
            radiusKm={3}
          />
        </div>
      </Card>
    </div>
  );
}
