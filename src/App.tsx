import React, { useState } from 'react';
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

function App() {
  const [photos, setPhotos] = useState<Photo[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-30' },
    { id: '2', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-30' },
    { id: '3', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-30' },
    { id: '4', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-29' },
    { id: '5', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-29' },
    { id: '6', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-28' },
    { id: '7', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-28' },
    { id: '8', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-28' },
  ]);

  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="app">
      <h1>Photo Gallery</h1>
      <PhotoGrid>
        {Object.entries(groupedPhotos).map(([date, datePhotos]) => {
          const allPhotosSelected = datePhotos.every(photo => 
            selectedPhotoIds.includes(photo.id)
          );
          
          return (
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
          );
        })}
      </PhotoGrid>
    </div>
  );
}

export default App; 