import React, { useState, useEffect } from 'react';
import './App.css';
import {
  PhotoGrid,
  DateGroup,
  DateHeader,
  PhotosContainer,
  PhotoItem,
  SelectionOverlay
} from './components/PhotoGallery';

interface Photo {
  id: string;
  url: string;
  date: string;
}

// Mock fetch function
const fetchPhotos = async (): Promise<Photo[]> => {
  try {
      const response = await fetch('https://gist.githubusercontent.com/Peracek/677c5ec0e4b1d44180ee62fda1dc5805/raw/2d8fe412e4c8cc18eb03465bb3547892dbecd554/json');
    
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    
    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load photos on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPhotos = await fetchPhotos();
        setPhotos(fetchedPhotos);
      } catch (err) {
        setError('Failed to load photos. Please try again.');
        console.error('Error fetching photos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  // Group photos by date
  const groupedPhotos = photos.reduce((acc, photo) => {
    const date = photo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const toggleDateSelection = (date: string) => {
    const datePhotos = groupedPhotos[date];
    const allSelected = datePhotos.every(photo => selectedPhotoIds.includes(photo.id));
    
    if (allSelected) {
      setSelectedPhotoIds(prev => prev.filter(id => !datePhotos.some(photo => photo.id === id)));
    } else {
      const newSelectedIds = datePhotos
        .filter(photo => !selectedPhotoIds.includes(photo.id))
        .map(photo => photo.id);
      setSelectedPhotoIds(prev => [...prev, ...newSelectedIds]);
    }
  };

  return (
    <div className="app">
      <h1>Photo Gallery</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading photos...</div>
      ) : (
        <PhotoGrid>
          {Object.entries(groupedPhotos).map(([date, datePhotos]) => (
            <DateGroup key={date}>
              <DateHeader 
                isSelected={datePhotos.every(photo => selectedPhotoIds.includes(photo.id))}
                onClick={() => toggleDateSelection(date)}
              >
                {date}
              </DateHeader>
              <PhotosContainer>
                {datePhotos.map(photo => (
                  <PhotoItem
                    key={photo.id}
                    isSelected={selectedPhotoIds.includes(photo.id)}
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <img src={photo.url} alt={`Photo ${photo.id}`} />
                    <SelectionOverlay isSelected={selectedPhotoIds.includes(photo.id)} />
                  </PhotoItem>
                ))}
              </PhotosContainer>
            </DateGroup>
          ))}
        </PhotoGrid>
      )}
    </div>
  );
}

export default App; 