import React from 'react';
import './Header.css';
import logo from '../../assets/logo-site.svg';

const Header = () => (
  <header className="header">
    <div className="header__logo-container">
      <img src={logo} alt="Logo" className="header__logo" />
    </div>

    <div className="header__title">
      Монитор Клавиатурович
    </div>

    {/* Список участников справа в две колонки
    <ul className="header__members">
      <li>Кирсанов Иван</li>
      <li>Михайлова Мария</li>
      <li>Максимов Матвей</li>
      <li>Черникова Полина</li>
      <li>Горевская Анна</li>
    </ul> */}
  </header>
);

export default Header;