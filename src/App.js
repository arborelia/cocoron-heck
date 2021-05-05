import logo from './logo.svg';
import './App.css';
import React from 'react';

const HEADS = [
  "HERO", "NINJA", "ROBOT", "ALIEN", "FIGHTER", "MONSTER", "GHOST", "?"
]
const BODIES = [
  "ARMOR", "WINGS", "JET", "CYBORG", "BOAT", "BUGGY", "TANK", "?"
]
const WEAPONS = [
  "PARASOL", "BOOMERANG", "SHURIKEN", "BALL", "PENCIL", "CRYSTAL", "FLOWER", "MELODY"
]
const LEVELS = [
  "House",
  "Trump Castle",
  "Milk Sea",
  "Fairy Forest",
  "Star Hill",
  "Ice-Fire Mountain"
]


class Character extends React.Component {
  render() {
    const headTypeIdx = this.props.head % 8;
    const headWord = HEADS[headTypeIdx];

    const bodyTypeIdx = this.props.body % 8;
    const bodyWord = BODIES[bodyTypeIdx];

    const weaponTypeIdx = this.props.weapon % 8;
    const weaponWord = WEAPONS[weaponTypeIdx];

    return (
      <div className="character">
        <ul className="characterDesc">
          <li className="head">Head: <span class="gameText">{headWord}</span></li>
          <li className="body">Body: <span class="gameText">{bodyWord}</span></li>
          <li className="weapon">Weapon: <span class="gameText">{weaponWord}</span></li>
        </ul>
      </div>
    );
  }
}


function App() {
  return (
    <div className="App">
      <Character head="1" body="2" weapon="3" />
    </div>
  );
}

export default App;
