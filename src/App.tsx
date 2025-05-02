import React, { useState, useEffect } from 'react';
import './App.css';
import {
  PhotoGrid,
  DateGroup,
  DateHeader,
  PhotosContainer,
  PhotoItem,
  SelectionOverlay,
} from './components/PhotoGallery';

interface Photo {
  id: string;
  url: string;
  date: string;
}

const fetchPhotos = async (): Promise<Photo[]> => {
  try {
    const response = await fetch(
      'https://gist.githubusercontent.com/Peracek/677c5ec0e4b1d44180ee62fda1dc5805/raw/2d8fe412e4c8cc18eb03465bb3547892dbecd554/json'
    );

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

  const groupedPhotos = (() => {
    const allDates = photos.map(photo => photo.date);
    const uniqueDates = Array.from(new Set(allDates));

    const result: Record<string, Photo[]> = {};

    uniqueDates.forEach(date => {
      const photosForDate = photos.filter(photo => {
        return photo.date === date;
      });

      result[date] = photosForDate;
    });

    return result;
  })();

  const togglePhotoSelection = (photoId: string) => {
    // TODO: to implement
  };

  const toggleDateSelection = (date: string) => {
    // TODO: to implement
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
                isSelected={false} // TODO: to implement
                onClick={() => toggleDateSelection(date)}
              >
                {date}
              </DateHeader>
              <PhotosContainer>
                {datePhotos.map(photo => {
                  const isSelected = false; // TODO: to implement

                  return (
                    <PhotoItem
                      key={photo.id}
                      isSelected={isSelected}
                      onClick={() => togglePhotoSelection(photo.id)}
                    >
                      <img src={photo.url} alt={`Photo ${photo.id}`} />
                      <SelectionOverlay isSelected={isSelected} />
                    </PhotoItem>
                  );
                })}
              </PhotosContainer>
            </DateGroup>
          ))}
        </PhotoGrid>
      )}
    </div>
  );
}

export default App;
