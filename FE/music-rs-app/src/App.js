import './App.css';
import AppLayout from './AppLayout';
import { PersonalizeProvider } from './context/PersonalizeContext';
import { PlaylistProvider } from './context/PlaylistContext';

function App() {
  return (
      <PlaylistProvider>
      <PersonalizeProvider>
        <AppLayout />
      </PersonalizeProvider>
    </PlaylistProvider>
       
  );
}

export default App;
