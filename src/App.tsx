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

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const response = await fetch(
        'https://gist.githubusercontent.com/Peracek/677c5ec0e4b1d44180ee62fda1dc5805/raw/2d8fe412e4c8cc18eb03465bb3547892dbecd554/json'
      );
      const data = await response.json();
      setPhotos(data.photos);
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
    </div>
  );
}

export default App;
