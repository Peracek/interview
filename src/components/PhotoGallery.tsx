import React from 'react';
import { ReactNode } from 'react';

export const PhotoGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="photo-grid">{children}</div>
);

export const DateGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="date-group">{children}</div>
);

export const DateHeader = ({ 
  children, 
  isSelected, 
  onClick 
}: { 
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div 
    className={`date-header ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const PhotosContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="photos-container">{children}</div>
);

export const PhotoItem = ({ 
  children, 
  isSelected, 
  onClick 
}: { 
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div 
    className={`photo-item ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const SelectionOverlay = ({ 
  isSelected 
}: { 
  isSelected: boolean;
}) => (
  <div className="selection-overlay">
    {isSelected && <div className="checkmark">✓</div>}
  </div>
); 