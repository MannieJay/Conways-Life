import React, { Component } from 'react';
import Life from './life.js';
import './App.css';

const COLORS = [
  [0, 0, 0],
  [0xff, 0xff, 0xff],
]

/**
 * Life canvas
 */
class LifeCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motion: true
    }

    this.life = new Life(props.width, props.height);
    this.life.randomize();
  }

  onClickGlider = (e) => {
    this.life.glider();
  }

  onClickRandomize = (e) => {
    this.life.randomize();
  }

  onClickClear = (e) => {
    this.life.clear();
  }

  onClickMotion = (e) => {
    if (this.state.motion) {
      this.setState({ motion: false });
    } else {
      this.setState({ motion: true });
    }
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    requestAnimationFrame(() => { this.animFrame() });
  }

  /**
   * Handle an animation frame
   */
  animFrame() {
    const cells = this.life.getCells();
    const height = this.props.height;
    const width = this.props.width;


    // Get canvas framebuffer, a packed RGBA array
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    //canvas.style.width = (canvas.width * 0.1) + "px";
    //canvas.style.height = (canvas.height * 0.1) + "px";
    let imageData = ctx.getImageData(0, 0, width, height);
    ctx.scale(4, 4);
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    // Convert the cell values into white or black for the canvas
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const state = cells[y][x];
        const color = COLORS[state];
        const index = (y * width + x) * 4;

        imageData.data[index + 0] = color[0]; // Red
        imageData.data[index + 1] = color[1]; // Blue
        imageData.data[index + 2] = color[2]; // Green
        imageData.data[index + 3] = 0xff; // Alpha, 0xff === 255 === opaque
      }
    }

    // Put the new image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Update life and get cells
    if (this.state.motion) {
      this.life.step();
    }


    // Request another animation frame
    requestAnimationFrame(() => {
      this.animFrame()
    })
    // Next generation of life
  }

  /**
   * Render
   */
  render() {
    return (
      <div>
        <button onClick={this.onClickRandomize}>Randomize</button>
        <button onClick={this.onClickClear}>Clear</button>
        <button onClick={this.onClickMotion}>{this.state.motion ? 'Stop' : 'Start'}</button>
        <button onClick={this.onClickGlider}>Glider</button>
        <canvas ref="canvas" width={this.props.width} height={this.props.height} />
      </div>
    )
  }
}

/**
 * Life holder component
 */
class LifeApp extends Component {

  /**<button onClick={this.dropPopulationBomb.bind(this)}>333</button>
   * Render
   */
  render() {
    return (
      <div>
        <LifeCanvas width={400} height={400} />
      </div>
    )
  }
}

/**
 * Outer App component
 */
class App extends Component {

  /**
   * Render
   */
  render() {
    return (
      <div className="App">
        <LifeApp />
      </div>
    );
  }
}

export default App;