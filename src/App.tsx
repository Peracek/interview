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

// Mock photo data
const mockPhotos: Photo[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-30' },
  { id: '2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-30' },
  { id: '3', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60', date: '2024-04-30' },
  { id: '4', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60', date: '2024-04-29' },
  { id: '5', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60', date: '2024-04-29' },
  { id: '6', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60', date: '2024-04-28' },
  { id: '7', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=60', date: '2024-04-28' },
  { id: '8', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=60', date: '2024-04-28' },
];

// Mock fetch function
const fetchPhotos = async (): Promise<Photo[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate random success/failure
  const shouldFail = Math.random() < 0.1; // 10% chance of failure
  
  if (shouldFail) {
    throw new Error('Failed to fetch photos');
  }
  
  // Return a shuffled copy of the mock photos
  return [...mockPhotos].sort(() => Math.random() - 0.5);
};

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load photos
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

  // Load photos on component mount
  useEffect(() => {
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
      <div className="header">
        <h1>Photo Gallery</h1>
        <button 
          className="refresh-button"
          onClick={loadPhotos}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh Photos'}
        </button>
      </div>
      
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