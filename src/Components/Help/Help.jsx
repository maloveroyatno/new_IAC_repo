import React from 'react';
import './Help.css';
import helpIcon from '../../assets/quest.png';

const Help = () => (
  <div className="help">
    <img src={helpIcon} alt="Help" className="help__icon" />
    <div className="help__tooltip">
      <p><strong>Как пользоваться сервисом:</strong></p>
      <ul>
        <li>Введите адрес или объект в поле.</li>
        <li>Выберите подсказку из списка.</li>
        <li>Если подсказка не подходит, вы можете продолжить вводить адрес.</li>
        <li>Если вы хотите удалить подсказку, просто нажмите на нее.</li>
      </ul>
    </div>
  </div>
);

export default Help;