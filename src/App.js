import './App.css';
import React from 'react';
import shuffle from 'knuth-shuffle-seeded';

var seedrandom = require('seedrandom');

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
const N_CHARACTERS = 6;


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
          <li key="head" className="head">Head: <span className="gameText">{headWord}</span></li>
          <li key="body" className="body">Body: <span className="gameText">{bodyWord}</span></li>
          <li key="weapon" className="weapon">Weapon: <span className="gameText">{weaponWord}</span></li>
        </ul>
      </div>
    );
  }
}

class LevelOrder extends React.Component {
  render() {
    return (
      <div className="levelOrder">
        Level order: <span className="levels">{this.props.levels.join(" ⭢ ")}</span>
      </div>
    )
  }
}

class RandomChoices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seed: props.seed,
      levels: [],
      chars: []
    }

    this.randomize();
  }

  randIndex(length, rng) {
    return Math.floor(rng() * length);
  }

  randomize() {
    var rng = seedrandom(this.state.seed);
    var heads = [];
    var bodies = [];
    var weapons = [];
    var levels = [...LEVELS];
    var characters = [];
    shuffle(levels, this.state.seed);

    for (var i = 0; i < N_CHARACTERS; i++) {
      var head = -1;
      while (head === -1 || heads.includes(head)) {
        head = this.randIndex(8, rng);
      }
      heads.push(head);

      var body = -1;
      while (body === -1 || bodies.includes(body)) {
        body = this.randIndex(8, rng);
      }
      bodies.push(body);

      var weapon = -1;
      while (weapon === -1 || weapons.includes(weapon)) {
        weapon = this.randIndex(8, rng);
      }
      weapons.push(weapon);

      characters.push(
        new Character(
          { head: head, body: body, weapon: weapon }
        )
      );
    }
    this.levels = levels;
    this.chars = characters;
  }

  render() {
    console.log(this.levels);
    return (
      <div className="randomChoices">
        <LevelOrder levels={this.levels} />
        <div className="chars">
          {this.chars.map(char => char.render())}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <RandomChoices seed="42069" />
    </div>
  );
}

export default App;
