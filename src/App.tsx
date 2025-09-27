import { AppProvider } from './context/AppContext';
import { MainChatArea } from './components/MainChatArea';
import { FileImportArea } from './components/FileImportArea';
import { AppContainer } from './styles/styled';

function App() {
  return (
    <AppProvider>
      <AppContainer>
        <FileImportArea />
        <MainChatArea />
      </AppContainer>
    </AppProvider>
  );
}

export default App;
