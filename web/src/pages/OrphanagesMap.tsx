import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';

import mapMarkerImg from '../images/map-marker.svg';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

import '../styles/pages/orphanages-map.css';

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

interface Geolocation {
  coords: {
    accuracy: number;
    latitude: number;
    longitude: number;
  }
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [position, setPosition] = useState<Geolocation>();
  
  useEffect(() => {      
    navigator.geolocation.getCurrentPosition(pos => setPosition(pos));
  }, []);

  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy"/>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>João Pessoa</strong>
          <span>Paraíba</span>
        </footer>
      </aside>

      <Map 
        center={ position ? [position.coords.latitude, position.coords.longitude] : [-7.1543243, -34.8345317000] }
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        {orphanages.map(orphanage => {
          return (
            <Marker 
              key={orphanage.id}
              position={[orphanage.latitude, orphanage.longitude]}
              icon={mapIcon}
            >
              <Popup closeButton={false} minWidth={248} maxWidth={248} className="map-popup">
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#FFF"/>
                </Link>
              </Popup>
            </Marker>
          )
        })}

      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  )
}

export default OrphanagesMap;