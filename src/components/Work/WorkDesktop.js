import React, { useEffect, useRef } from 'react'

import { Application, Assets, Sprite } from 'pixi.js';

export default function WorkDesktop() {
  
  const app = new Application({
    backgroundAlpha: 0.5,
    autoResize: true,
    resolution: devicePixelRatio
  });

  const el = useRef()
  useEffect(() => {
    el.current.appendChild(app.view)
  },[el])

  return <div ref={r => el.current = r}></div>
}

// Listen for window resize events
// window.addEventListener('resize', resize);

// Resize function window
// function resize() {
// 	app.renderer.resize(window.innerWidth, window.innerHeight);
//   rect.position.set(app.screen.width, app.screen.height);
// }

// resize();
