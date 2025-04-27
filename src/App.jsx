import React from 'react';
import AddressGuesser from './Components/AddressGuesser/AddressGuesser';
import bgImage from './assets/street.webp';
import Header from './Components/Header/Header';
import Help from './Components/Help/Help';

const App = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Header />
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '30px',
          textAlign: 'center',
          textShadow: '0 0 5px rgba(0,0,0,0.5)',
        }}
      >
        i already know what you typing here...
      </h1>
      <AddressGuesser />
      <Help />
    </div>
  );
};

export default App;
