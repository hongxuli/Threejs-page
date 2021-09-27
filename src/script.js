import "./style.css";
import "./main.scss";
import { TextPage } from "./pages/page1";
import { Page2 } from "./pages/page2";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "dat.gui";
// import * as CANNON from "cannon-es";

const context = {
  setting: {
    width: window.innerWidth,
    height: window.innerWidth,
  },
  textPage: {
    textPixels: [],
  },
};

const textPageView = new TextPage(context);
textPageView.init();

let slider = document.querySelector(".slider-inner");
let sliderWidth;

function init() {
  sliderWidth = slider.getBoundingClientRect().width;
  document.querySelector(".intro").style.height = `${
    sliderWidth / 2 + window.innerHeight
  }px`;
  console.log("height:  " + window.innerHeight);
  console.log("width:  " + window.innerWidth);
  console.log("intro height" + document.querySelector(".intro").style.height);
}
function setTransform(el, transform) {
  el.style.transform = transform;
}
window.addEventListener("scroll", () => {
  console.log(window.scrollY);
  const target = window.scrollY;
  const percent = target / sliderWidth;
  if (percent < 0.5) {
    setTransform(slider, `translateX(-${percent * 100}%)`);
  } else {
    setTransform(slider, `translateX(-${0.5 * 100}%)`);
  }
});

init();

const page2 = new Page2(context)

