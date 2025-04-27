import React, { Children } from 'react';
import './Button.css';

export default function Button({ children, onClick }) {
  return (
    <button className="button-send" onClick={onClick}>
        { children }
    </button>
  );
}
