import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    positions: [{ x: 150 }, { x: 300 }, { x: 450 }],
    shells: [
      { x: 150, hasBall: false },
      { x: 300, hasBall: false },
      { x: 450, hasBall: false }
    ],
    intMoves: 10,
    start: false,
    objMovePattern: null,
    surfaceWidth: 700,
    surfaceHeight: 250
  };
  componentDidMount() {
    this.generateMoves();
  }
  generateMoves = () => {
    var objMoves = [];
    for (var i = 0; i < this.state.intMoves; i++) {
      var initialPattern = [0, 1, 2];
      objMoves.push(this.shuffleIndex(initialPattern));
    }
    this.setState({ objMovePattern: objMoves });
  };
  shuffleIndex(array) {
    let counter = array.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }
  animateShuffle = id => {
    if (id === this.state.objMovePattern.length) return;
    setTimeout(() => {
      var newShellPosition = [];
      this.setState({
        shells: this.state.shells.map((shell, index) => {
          newShellPosition.push({
            x: this.state.positions[this.state.objMovePattern[id][index]].x
          });
          shell.x = newShellPosition[index].x;
          return shell;
        })
      });
      this.animateShuffle(id + 1);
    }, 500);
  };
  startGame = event => {
    event.currentTarget.classList.add("invisible");
    let shells = [...this.state.shells];
    var rand_index = Math.floor(Math.random() * this.state.shells.length);
    let shell = {
      ...shells[rand_index],
      hasBall: true
    };
    shells[rand_index] = shell;
    this.setState({ start: true, shells: shells });
    setTimeout(() => {
      this.animateShuffle(0);
    }, 1500);
  };
  checkBall = hasBall => {
    var message;
    if (hasBall) {
      message = "You won!! Do you want to play again?";
    } else {
      message = "You lost! Do you want to play again?";
    }
    this.finish(message);
  };
  finish(message) {
    if (window.confirm(message)) {
      window.location.reload();
    }
  }
  getShellStyle = id => {
    var shellProp = {};
    shellProp.transform = `translate(${this.state.shells[id].x}px`;
    return shellProp;
  };
  getBallStyle = () => {
    var id = this.state.shells.findIndex(item => item.hasBall);
    return {
      transform: `translate(${this.state.shells[id].x + 25}px`
    };
  };
  render() {
    const shells = this.state.shells.map((shell, index) => (
      <div
        key={index}
        className={`cup ` + (shell.hasBall ? "hasBall" : "")}
        style={this.getShellStyle(index)}
        onClick={this.checkBall.bind(this, shell.hasBall)}
      ></div>
    ));
    return (
      <div className="App">
        <h1>Don't lose the ball!</h1>
        <button id="btnStart" onClick={this.startGame}>
          <p>Start</p>
        </button>
        <div
          className="surface"
          style={{
            width: this.state.surfaceWidth,
            height: this.state.surfaceHeight
          }}
        >
          {this.state.start ? (
            <div id="ball" style={this.getBallStyle()}></div>
          ) : null}
          <div className="cups-box">{shells}</div>
        </div>
      </div>
    );
  }
}
export default App;
