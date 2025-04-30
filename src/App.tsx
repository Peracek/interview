import { useState } from 'react';
import './App.css';

interface Photo {
  id: number;
  url: string;
  date: string;
  selected: boolean;
}

function App() {
  // Sample photos with dates - using tree planting and forest related images
  const [photos, setPhotos] = useState<Photo[]>([
    { id: 1, url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-30', selected: false },
    { id: 2, url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-30', selected: false },
    { id: 3, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-30', selected: false },
    { id: 4, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-29', selected: false },
    { id: 5, url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-29', selected: false },
    { id: 6, url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-28', selected: false },
    { id: 7, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60', date: '2024-04-28', selected: false },
    { id: 8, url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=60', date: '2024-04-28', selected: false },
  ]);

  // Group photos by date
  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.date]) {
      acc[photo.date] = [];
    }
    acc[photo.date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  const togglePhotoSelection = (photoId: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, selected: !photo.selected } : photo
    ));
  };

  const toggleDateSelection = (date: string) => {
    const allSelected = groupedPhotos[date].every(photo => photo.selected);
    setPhotos(photos.map(photo => 
      photo.date === date ? { ...photo, selected: !allSelected } : photo
    ));
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
      <div className="photo-grid">
        {Object.entries(groupedPhotos).map(([date, datePhotos]) => (
          <div key={date} className="date-group">
            <div 
              className={`date-header ${datePhotos.every(p => p.selected) ? 'selected' : ''}`}
              onClick={() => toggleDateSelection(date)}
            >
              {formatDate(date)}
            </div>
            <div className="photos-container">
              {datePhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className={`photo-item ${photo.selected ? 'selected' : ''}`}
                  onClick={() => togglePhotoSelection(photo.id)}
                >
                  <img src={photo.url} alt={`Photo ${photo.id}`} />
                  <div className="selection-overlay">
                    {photo.selected && <div className="checkmark">✓</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 