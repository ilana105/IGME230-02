"use strict";
const app = new PIXI.Application(800, 800);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//preload images here
//PIXI.loader.add[""].on("progress", e => {console.log(`progress = ${e.progress}`)}).load(setup);
//make a progress/loading bar

let stage;

//game variables
let introScreen;
let instructionsScreen;
//let selectModeScreen;
//let easyModeLabel, hellModeLabel;
let gameScreen, timeLabel, cursor;
let gameOverScreen;

let score = 0;
let userName;
let food = [];
let levelNum = 1;
let paused = true;

function setup(){
    stage = app.stage;
    
    cursor = new Hand();
    stage.addChild(cursor);
    
    introScreen = new PIXI.Container();
    stage.addChild(introScreen);
    
    instructionsScreen = new PIXI.Container();
    instructionsScreen.visible = false;
    stage.addChild(instructionsScreen);
    
    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    stage.addChild(gameScreen);
    
    gameOverScreen = new PIXI.Container();
    gameOverScreen.visible = false;
    stage.addChild(gameOverScreen);
    
    CreateButtonsAndLabels();
}

function CreateButtonsAndLabels() {
    let titleLabel = new PIXI.Text("Running the Pass");
    titleLabel.style = new PIXI.TextStyle ({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: "VT323", monospace
    });
    titleLabel.x = 100;
    titleLabel.y = 150;
    introScreen.addChild(titleLabel);
}

function startGame() {
    introScreen.visible = false;
    gameOverScreen.visible = false;
    instructionsScreen.visible = false;
    gameScreen.visible = true;
    
}

function loadLevel() {
    
    paused = false;
}

function end() {
    paused = true;
    
    gameOverScreen.visible = true;
    gameScreen.visible = false;    
}

function calcScore() {
    /* if (score >= )
    
    */
}
