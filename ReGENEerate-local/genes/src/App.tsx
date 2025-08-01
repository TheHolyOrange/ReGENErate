import React, { useState } from 'react';
import {
  FaBus,
  FaCar,
  FaShoppingBag,
  FaBicycle
} from 'react-icons/fa';
import { MdRestaurant, MdPhotoCamera } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { TbBottle } from 'react-icons/tb';

import type { JSX } from 'react';


type GeneType = 'excellent' | 'good' | 'bad' | 'terrible';

type Gene = {
  id: number;
  type: GeneType;
  color: string;
  glow: string;
  points: number;
  action: string;
  timestamp: string;
};

type PhotoProof = {
  id: number;
  action: string;
  timestamp: string;
};

type EcoAction = {
  id: string;
  name: string;
  type: GeneType;
  icon: () => JSX.Element;
  needsPhoto: boolean;
};

const geneTypes: Record<GeneType, { color: string; glow: string; points: number }> = {
  excellent: { color: '#00ff88', glow: '#00ff88aa', points: 10 },
  good: { color: '#44ff44', glow: '#44ff44aa', points: 5 },
  bad: { color: '#ff4444', glow: '#ff4444aa', points: -5 },
  terrible: { color: '#8b0000', glow: '#8b0000aa', points: -10 }
};

const EcoDNAGame: React.FC = () => {
  const [dnaGenes, setDnaGenes] = useState<Gene[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [currentAction, setCurrentAction] = useState<EcoAction | null>(null);
  const [photoProof, setPhotoProof] = useState<PhotoProof[]>([]);

const ecoActions: EcoAction[] = [
  { id: 'walk', name: 'Walked/Biked Instead of Driving', type: 'excellent', icon: () => <FaBicycle />, needsPhoto: true },
  { id: 'reusable', name: 'Used Reusable Water Bottle', type: 'good', icon: () => <TbBottle />, needsPhoto: true },
  { id: 'plant_meal', name: 'Chose Plant-Based Meal', type: 'good', icon: () => <MdRestaurant />, needsPhoto: true },
  { id: 'public_transport', name: 'Used Public Transport', type: 'excellent', icon: () => <FaBus />, needsPhoto: false },
  { id: 'car_short', name: 'Drove Car for Short Trip', type: 'bad', icon: () => <FaCar />, needsPhoto: false },
  { id: 'fast_fashion', name: 'Bought Fast Fashion', type: 'terrible', icon: () => <FaShoppingBag />, needsPhoto: false },
  { id: 'plastic_waste', name: 'Created Unnecessary Plastic Waste', type: 'bad', icon: () => <BsTrash />, needsPhoto: false }
];

  const addGene = (actionType: GeneType, actionName: string) => {
    const geneData = geneTypes[actionType];
    const newGene: Gene = {
      id: Date.now(),
      type: actionType,
      color: geneData.color,
      glow: geneData.glow,
      points: geneData.points,
      action: actionName,
      timestamp: new Date().toLocaleTimeString()
    };
    setDnaGenes(prev => [...prev, newGene]);
    setScore(prev => prev + geneData.points);
    setStreak(prev => (geneData.points > 0 ? prev + 1 : 0));
  };

    const handleActionClick = (action: EcoAction) => {
    const timestamp = new Date().toLocaleString();

    if (action.needsPhoto) {
      setCurrentAction(action);
      setShowCamera(true);
    } else {
      addGene(action.type, action.name);
      getUserDataAndSend(action, timestamp);
    }
  };

  const handlePhotoCapture = () => {
    if (!currentAction) return;
    const newPhoto: PhotoProof = {
      id: Date.now(),
      action: currentAction.name,
      timestamp: new Date().toLocaleString()
    };
    setPhotoProof(prev => [...prev, newPhoto]);
    addGene(currentAction.type, currentAction.name);
    setShowCamera(false);
    setCurrentAction(null);
  };

  const getDNAHealth = () => {
    if (score >= 50) return { status: 'EVOLVED', color: '#00ff88' };
    if (score >= 20) return { status: 'HEALTHY', color: '#44ff44' };
    if (score >= 0) return { status: 'STABLE', color: '#ffaa00' };
    if (score >= -20) return { status: 'MUTATING', color: '#ff4444' };
    return { status: 'DISEASED', color: '#8b0000' };
  };

  const health = getDNAHealth();

  //Hardcoded values 
  const getUserDataAndSend = async (action: EcoAction, timestamp: string) => {
    try {
      const dataToSend = {
        userId: '688c4ecab545977821db1357', 
        actionId: action.id,
        actionName: action.name,
        geneType: action.type,
        points: geneTypes[action.type].points,
        photoUrl: '' 
      };

      console.log('📤 Sending Action to Server:', dataToSend);

      const response = await fetch('http://localhost:3000/logAction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('✅ Server response:', result);
    } catch (error) {
      console.error('❌ Failed to send action to server:', error);
    }
  };



  return (
  <div style={{ backgroundColor: 'black', color: 'white', padding: '1rem', minHeight: '100vh', minWidth: '100vw' }}>
    {/* Page Title */}
    <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>ECO DNA BUILDER</h1>

    {/* Status Bar */}
    <div style={{ textAlign: 'center', marginBottom: '1rem', color: health.color }}>
      DNA STATUS: {health.status} | SCORE: {score} | STREAK: {streak} | GENES: {dnaGenes.length}
    </div>

    {/* Flex Container for Columns */}
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      
      {/* LEFT COLUMN — DNA */}
      <div style={{ flex: '1', minWidth: '300px', padding: '1rem' }}>
        <div style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflowY: 'auto',
            backgroundColor: 'black',
            borderRadius: '0.5rem',
            padding: '0.5rem'
          }}>

          {dnaGenes.map((gene, index) => {
            const y = 10 + index * 30;
            const angle = (index * 0.3) % (2 * Math.PI);
            const leftX = 150 + Math.sin(angle) * 75;
            const rightX = 150 - Math.sin(angle) * 75;
            return (
              <React.Fragment key={gene.id}>
                <div style={{
                  position: 'absolute',
                  top: `${y}px`, left: `${leftX - 8}px`,
                  width: '16px', height: '16px',
                  backgroundColor: gene.color, borderRadius: '50%',
                  boxShadow: `0 0 10px ${gene.glow}`
                }} title={gene.action} />
                <div style={{
                  position: 'absolute',
                  top: `${y}px`, left: `${rightX - 8}px`,
                  width: '16px', height: '16px',
                  backgroundColor: gene.color, borderRadius: '50%',
                  boxShadow: `0 0 10px ${gene.glow}`
                }} title={gene.action} />
                <div style={{
                  position: 'absolute',
                  top: `${y + 8}px`, left: `${Math.min(leftX, rightX)}px`,
                  width: `${Math.abs(rightX - leftX)}px`, height: '2px',
                  backgroundColor: gene.color, opacity: 0.6
                }} />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* CENTER COLUMN — Action Buttons */}
      <div style={{ flex: '2', minWidth: '300px', padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Log an Eco Action</h2>
        {ecoActions.map(action => (
          <button key={action.id} onClick={() => handleActionClick(action)} style={{
            display: 'flex', alignItems: 'center', width: '100%',
            backgroundColor: (action.type === 'excellent' || action.type === 'good') ? '#064e3b' : '#7f1d1d',
            color: 'white', padding: '0.75rem', marginBottom: '0.5rem',
            borderRadius: '0.5rem', border: 'none', cursor: 'pointer'
          }}>
            <div style={{ marginRight: '0.75rem' }}>{action.icon()}</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{action.name}</div>
              <div style={{ fontSize: '0.875rem' }}>
                {geneTypes[action.type].points > 0 ? '+' : ''}
                {geneTypes[action.type].points} points {action.needsPhoto && '📸'}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT COLUMN — Friends & Awards (Placeholder) */}
      <div style={{ flex: '1', minWidth: '300px', padding: '1rem', backgroundColor: '#1f2937' }}>
        <h3>📋 Coming Soon</h3>
        <p>Friends List, Awards, Challenges</p>
      </div>
    </div>

    {/* Camera Modal (Stays outside the columns for now) */}
    {showCamera && currentAction && (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>Simulate taking a photo of: <strong>{currentAction.name}</strong></p>
        <button onClick={handlePhotoCapture} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          marginTop: '1rem',
          border: 'none'
        }}>
          <MdPhotoCamera size={20} color="white" />
          &nbsp;Take Photo
        </button>
      </div>
    )}
  </div>
);

};

export default EcoDNAGame;
