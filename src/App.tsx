import { AppProvider } from './context/AppContext';
import { ChatSidebar } from './components/ChatSidebar';
import { MainChatArea } from './components/MainChatArea';
import { AppContainer } from './styles/styled';

function App() {
  return (
    <AppProvider>
      <AppContainer>
        <ChatSidebar />
        <MainChatArea />
      </AppContainer>
    </AppProvider>
  );
}

export default App;
