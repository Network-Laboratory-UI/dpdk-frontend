import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="h-screen w-screen bg-blue-500">
      <header className="h-full w-full text-white">
        <img src={logo} className="w-1/2" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
