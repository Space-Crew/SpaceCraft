// import {expect} from 'chai'
// // import {default as DragControls} from './DragControls'
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// import {makeUnitCube} from '../meshes'
// import * as THREE from 'three'

// describe('dragBlock', () => {
//   // const renderer = new THREE.WebGLRenderer();
//   // renderer.setSize(window.innerWidth, window.innerHeight);
//   let position = new THREE.Vector3(0,0,0);
//   // let _mouse = new THREE.Vector2();
//   let _selected = makeUnitCube(position, undefined, 1);
//   // var _raycaster = new THREE.Raycaster()
//   const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="game"></div></body></html>`);
//   console.log(dom.window)
//   // dom.getElementById('game').appendChild(renderer.domElement)
//   function mouseEvent(type, sx, sy, cx, cy) {
//     var evt;
//     var e = {
//       bubbles: true,
//       cancelable: (type != "mousemove"),
//       view: window,
//       detail: 0,
//       screenX: sx, 
//       screenY: sy,
//       clientX: cx, 
//       clientY: cy,
//       ctrlKey: false,
//       altKey: false,
//       shiftKey: false,
//       metaKey: false,
//       button: 0,
//       relatedTarget: undefined
//     };
//     if (typeof( dom.createEvent ) == "function") {
//       evt = dom.createEvent("MouseEvents");
//       evt.initMouseEvent(type, 
//         e.bubbles, e.cancelable, e.view, e.detail,
//         e.screenX, e.screenY, e.clientX, e.clientY,
//         e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
//         e.button, dom.body.parentNode);
//     } else if (dom.createEventObject) {
//       evt = dom.createEventObject();
//       for (prop in e) {
//       evt[prop] = e[prop];
//     }
//       evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
//     }
//     return evt;
//   }
//   function dispatchEvent (el, evt) {
//     if (el.dispatchEvent) {
//       el.dispatchEvent(evt);
//     } else if (el.fireEvent) {
//       el.fireEvent('on' + type, evt);
//     }
//     return evt;
//   }


//   // beforeEach(() => {
//   //   dispatchEvent(dom.window, mouseEvent('mousemove', 1, 50, 1, 50));
//   // })

//   it('moves selected block away from origin', () => {
//     expect(dom.window).to.equal(0)
//   })
// })
