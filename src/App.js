import './App.css';
import React from 'react';
import shuffle from 'knuth-shuffle-seeded';
import seedrandom from 'seedrandom';
import spritesheet_red from './images/cocoron-sheet-red.gif';
import spritesheet_yellow from './images/cocoron-sheet-yellow.gif';
import spritesheet_green from './images/cocoron-sheet-green.gif';
import spritesheet_blue from './images/cocoron-sheet-blue.gif';
import spritesheet_purple from './images/cocoron-sheet-purple.gif';
import spritesheet_pink from './images/cocoron-sheet-pink.gif';
import weapon_sheet from './images/item-sheet-2.png';
import makeName from './names';

const HEADS = [
  "Hero", "Ninja", "Robot", "Alien", "Fighter", "Monster", "Ghost", "?"
];
const BODIES = [
  "Armor", "Wing", "Jet", "Cyborg", "Boat", "Buggy", "Tank", "?"
];
const WEAPONS = [
  "Parasol", "Boomerang", "Shuriken", "Ball", "Pencil", "Crystal", "Flower", "Melody"
];
const BODY_COLORS = [
  "red", "purple", "red", "green", "yellow", "green", "red", "red",
  "blue", "red", "red", "pink", "red", "red", "red", "red",
  "red", "red", "blue", "blue", "red", "purple", "blue", "red"
];
const WEAPON_OFFSETS = [
  24, 51, 69, 96, 114, 131, 158, 176
]
const SPRITESHEETS = {
  red: spritesheet_red,
  yellow: spritesheet_yellow,
  green: spritesheet_green,
  blue: spritesheet_blue,
  purple: spritesheet_purple,
  pink: spritesheet_pink
};

const LEVELS = [
  "House",
  "Trump Castle",
  "Milk Sea",
  "Fairy Forest",
  "Star Hill",
  "Ice-Fire Mountain"
]
const N_CHARACTERS = 6;


// definitions that make cool things happen in the SVG
function SvgDefs(props) {
  return (
    <defs>
      <clipPath id="bodyClip">
        <rect x="20" y="2" width="25" height="25" />
      </clipPath>
      <clipPath id="headClip">
        <rect x="20" y="0" width="17" height="17" />
      </clipPath>
      <clipPath id="weaponClip">
        <rect x="2" y="8" width="17" height="17" />
      </clipPath>
    </defs>
  );
}


class Character extends React.Component {
  render() {
    const headTypeIdx = this.props.head % 8;
    const headWord = HEADS[headTypeIdx];

    const bodyTypeIdx = this.props.body % 8;
    const bodyWord = BODIES[bodyTypeIdx];

    const weaponTypeIdx = this.props.weapon % 8;
    const weaponWord = WEAPONS[weaponTypeIdx];

    const bodyX = 0;
    const bodyY = 25 * this.props.body;

    const headX = 68 * Math.floor(this.props.head / 8);
    const headY = 400 + 17 * (this.props.head % 8);
    const weaponX = 37;
    const weaponY = WEAPON_OFFSETS[weaponTypeIdx];

    // pick the appropriately-colored body sprites to match the head
    const body_sheet = SPRITESHEETS[BODY_COLORS[this.props.head]];
    const head_sheet = SPRITESHEETS["red"];

    return (
      <div className="character">
        <div className="characterName">
          <span>Character #{this.props.index + 1}: </span>
          <span class="gameText">{this.props.name}</span>
        </div>
        <table className="characterTable">
          <tbody>
            <tr>
              <td className="sprite">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="135" height="90" viewBox="0 0 45 30">
                  <SvgDefs />
                  <image href={body_sheet} x={20 - bodyX} y={2 - bodyY} clipPath="url(#bodyClip)" />
                  <image href={head_sheet} x={20 - headX} y={-headY} clipPath="url(#headClip)" />
                  <image href={weapon_sheet} x={2 - weaponX} y={8 - weaponY} clipPath="url(#weaponClip)" />
                </svg>
              </td>
              <td>
                <table className="characterDesc">
                  <tbody>
                    <tr valign="bottom">
                      <td align="right">Head:</td><td className="gameText">{headWord}</td>
                    </tr>
                    <tr valign="bottom">
                      <td align="right">Body:</td><td className="gameText">{bodyWord}</td>
                    </tr>
                    <tr valign="bottom">
                      <td align="right">Weapon:</td><td className="gameText">{weaponWord}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function randIndex(length, rng) {
  return Math.floor(rng() * length);
}

function RandomChoices(props) {
  var options = props.options;
  var rng = seedrandom(options.seed.toString());

  var levels = [...LEVELS];
  if (!options.includeHouse) {
    levels = levels.slice(1);
  }
  var levelSeed = options.seed;
  shuffle(levels, levelSeed);
  while (levels[0] === "House") {
    levelSeed += 1000;
    shuffle(levels, levelSeed);
  }

  var characters = [];
  var heads = [];
  var bodies = [];
  var weapons = [];
  var initials = [];

  for (var i = 0; i < N_CHARACTERS; i++) {
    var validCharacter = false;
    while (!validCharacter) {
      var head = -1;
      while (head === -1 || heads.includes(head)) {
        head = randIndex(24, rng);
        if (!options.allowClown && head === 15) {
          // reassign the clown head to a different ? head, if available
          if (heads.includes(7)) head = 23;
          else head = 7;
        }
      }

      var body = -1;
      while (body === -1 || bodies.includes(body)) {
        body = randIndex(16, rng);
      }

      var weapon = -1;
      while (weapon === -1 || weapons.includes(weapon)) {
        weapon = randIndex(8, rng);
        if (!options.allowShuriken && weapon === 2) weapon = -1;
      }

      validCharacter = true;
      if (!options.allowEnigma) {
        if (head % 8 === 7 && body % 8 === 7 && weapon % 8 === 7) {
          validCharacter = false;
        }
      }

      if (!options.allowSpeedrun) {
        if (head % 8 === 6 && body % 8 === 1 & weapon % 8 === 2) {
          validCharacter = false;
        }
      }
    }

    heads.push(head);
    bodies.push(body);
    weapons.push(weapon);

    var retryIndex = 0;
    var name = makeName([head, body, weapon, retryIndex]);
    while (initials.includes(name.charAt(0))) {
      retryIndex += 1;
      name = makeName([head, body, weapon, retryIndex]);
    }
    initials.push(name.charAt(0));

    var index = characters.length;

    characters.push(
      new Character(
        { head: head, body: body, weapon: weapon, name: name, index: index }
      )
    );
  }

  const renderedChars = characters.map((char) => { return char.render() });
  return (
    <div className="randomChoices">
      <div className="character-column">
        <h2>Characters</h2>
        {renderedChars}
      </div>

      <div className="level-column">

        <h2>Level order</h2>
        <div className="levelOrder">
          <ul className="levelList">
            {levels.map(level => (
              <li className="level gameText" key={level}>{level}</li>
            )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

class Randomizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seed: (Math.random() * 100000000) >> 0,
      includeHouse: true,
      allowShuriken: true,
      allowSpeedrun: false,  // ghost, wings, shuriken
      allowEnigma: true,  // ?, ?, any weapon
      allowClown: true,   // head #15 is a clown, replace it with another head if possible
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.randomizeSeed = this.randomizeSeed.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  randomizeSeed() {
    this.setState({ seed: Math.random() * 100000000 >> 0 });
  }

  render() {
    return (
      <div className="randomizer">
        <h1>Cocoron Heck% Randomizer</h1>
        <div className="optionsForm">
          <h2>Options</h2>
          <form id="options" onSubmit={this.handleSubmit}>
            <ul>
              <li>
                <label>
                  <input name="includeHouse" type="checkbox" checked={this.state.includeHouse}
                    onChange={this.handleInputChange} />
                  <span className="labelText">Include House as a destination</span>
                </label>
              </li>

              <li>
                <label>
                  <input name="allowShuriken" type="checkbox" checked={this.state.allowShuriken}
                    onChange={this.handleInputChange} />
                  <span className="labelText">Allow Shuriken</span>
                </label>
              </li>

              <li>
                <label>
                  <input name="allowSpeedrun" type="checkbox" checked={this.state.allowSpeedrun}
                    onChange={this.handleInputChange} />
                  <span className="labelText">Allow the speedrun character (ghost, wings, shuriken)</span>
                </label>
              </li>

              <li>
                <label>
                  <input name="allowEnigma" type="checkbox" checked={this.state.allowEnigma}
                    onChange={this.handleInputChange} />
                  <span className="labelText">Allow the worst character (?, ?, melody)</span>
                </label>
              </li>

              <li>
                <label>
                  <input name="allowClown" type="checkbox" checked={this.state.allowClown}
                    onChange={this.handleInputChange} />
                  <span className="labelText">Allow the clown face</span>
                </label>
              </li>

              <li className="seedInput">
                <label>
                  <span className="labelText">Seed: </span>
                  <input name="seed" type="number" value={this.state.seed} onChange={this.handleInputChange} />
                  <button name="randomize" onClick={this.randomizeSeed}>Randomize</button>
                </label>
              </li>
            </ul>
          </form>
        </div>
        <RandomChoices options={this.state} />
      </div>
    );
  }
}


function App() {
  return (
    <div className="App">
      <Randomizer />
    </div>
  );
}

export default App;
