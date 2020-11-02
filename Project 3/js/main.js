"use strict";
const app = new PIXI.Application(800, 600, {backgroundColor: 0x000000});

const screenWidth = app.view.width;
const screenHeight = app.view.height;

let stage;

//Game variables
let startScreen;
let howToScreen;
let menuScreen;
let gameScreen;
let gameOverScreen;
let wavesLasted;
let highScoreScreen;

let backButton;

let happinessLabel;
let customerSatis = 100;
let numLevel = 1;
let waveNumLabel;
let paused = true;

let timer;

let name;

let order = [];
let orderLabel;
let dish;
let serviceBell;
let serviceBellSound, bgSound, fryingSound, chopSound, waterSound;

//list of all the menu items
let foodText = ["Beef Wellington", "Filet Mignon", "Foie Gras", "Pumpkin Soup", "Ceaser Salad", "Salmon", "Seared Scallops", "Lamb", "Lobster Risotto", "NY Steak"];
//list of references to the food pictures
let foodImages = ["media/beefW.png", "media/filetM.png", "media/foieGras.png",
                "media/Pumpkin.png", "media/salad.png", "media/salmon.png",
                "media/scallops.png", "media/lamb.png", "media/Lobster.png",
                "media/NYsteak.png"];
let foodSprites = [];

let highScores = window.localStorage;
let highScoresList;

window.onload = setup;

//setup for the game
function setup() {
    highScores.clear();
    
    WebFont.load({
        google: {
            families: ['Permanent Marker', 'Exo']
        }
    });
    
    document.body.appendChild(app.view);
    
    stage = app.stage;
    
    highScores.setItem('Name', 'Wave #');
    
    //start screen
    startScreen = new PIXI.Container();
    stage.addChild(startScreen);
    
    //instructions screen
    howToScreen = new PIXI.Container();
    howToScreen.visible = false;
    stage.addChild(howToScreen);
    
    //dinner menu screen
    menuScreen = new PIXI.Container();
    menuScreen.visible = false;
    stage.addChild(menuScreen);
    
    //high score screen -- links to localStorage
    highScoreScreen = new PIXI.Container();
    highScoreScreen.visible = false;
    stage.addChild(highScoreScreen);
    
    //game screen
    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    stage.addChild(gameScreen);
    
    //game over screen
    gameOverScreen = new PIXI.Container();
    gameOverScreen.visible = false;
    stage.addChild(gameOverScreen);
    
    //create labels and buttons
    createLabelsAndButtons();
    
    //app.ticker.add(gameLoop);
    
    //creating the food
    for (let i = 0; i < foodText.length; i++) {
        foodSprites.push(new Food(foodText[i], 0, 0));
        //let img = PIXI.Texture.fromImage(foodImages[i]);
        //img.baseTexture.scaleMode = PIXI.SCALE_MODES.NEARTEST;
        foodSprites[i] = new PIXI.Sprite.fromImage(foodImages[i]);
    }
    
    //creating the grid layout
    displayFood();
    
    //loading the sounds
    serviceBellSound = new Howl ({
        src: ['media/bellRing.wav']
    });
    
    bgSound = new Howl ({
        src: ['media/background.wav']
    });
    
    fryingSound = new Howl ({
        src: ['media/frying.wav']
    });
    
    chopSound = new Howl ({
        src: ['media/chopping.wav']
    });
    
    waterSound = new Howl ({
        src: ['media/waterBoiling.wav']
    });    
}

//creating the labels and buttons for each screen
function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x00BBCC,
        fontSize: 36,
        fontFamily: "Exo"
    });
    
    //start screen
    let startLabel = new PIXI.Text("RUN THE PASS");
    startLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 82,
        fontFamily: 'Permanent Marker'
    });
    startLabel.x = 80;
    startLabel.y = 120;
    startScreen.addChild(startLabel);
    
    let startButton = new PIXI.Text("PLAY");
    startButton.style = buttonStyle;
    startButton.x = 80;
    startButton.y = screenHeight - 180;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on('pointerup', startGame);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScreen.addChild(startButton);
    
    let menuButton = new PIXI.Text("DINNER MENU");
    menuButton.style = buttonStyle;
    menuButton.x = 419;
    menuButton.y = screenHeight - 180;
    menuButton.interactive = true;
    menuButton.buttonMode = true;
    menuButton.on('pointerup', readMenu);
    menuButton.on('pointerover', e => e.target.alpha = 0.7);
    menuButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScreen.addChild(menuButton);
    
    let highScoreButton = new PIXI.Text("HIGH SCORES");
    highScoreButton.style = buttonStyle;
    highScoreButton.x = 420;
    highScoreButton.y = screenHeight - 130;
    highScoreButton.interactive = true;
    highScoreButton.buttonMode = true;
    highScoreButton.on('pointerup', goToScores);
    highScoreButton.on('pointerover', e => e.target.alpha = 0.7);
    highScoreButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScreen.addChild(highScoreButton);
    
    let instructionsButton = new PIXI.Text("HOW TO PLAY");
    instructionsButton.style = buttonStyle;
    instructionsButton.x = 80;
    instructionsButton.y = screenHeight - 130;
    instructionsButton.interactive = true;
    instructionsButton.buttonMode = true;
    instructionsButton.on('pointerup', learnHowTo);
    instructionsButton.on('pointerover', e => e.target.alpha = 0.7);
    instructionsButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScreen.addChild(instructionsButton);
    
    //back button
    backButton = new PIXI.Text("BACK");
    backButton.style = buttonStyle;
    backButton.x = 20;
    backButton.y = 10;
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.on('pointerup', goBack);
    backButton.on('pointerover', e => e.target.alpha = 0.7);
    backButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    howToScreen.addChild(backButton);
    
    //adding the menu picture to the screen
    let dinnerMenu = PIXI.Sprite.fromImage('media/dinnerMenu.png');
    dinnerMenu.anchor.x = 0;
    dinnerMenu.anchor.y = 0;
    dinnerMenu.position.x = 0;
    dinnerMenu.position.y = 0;
    menuScreen.addChild(dinnerMenu);
    
    let backButton2 = new PIXI.Text("BACK");
    backButton2.style = buttonStyle;
    backButton2.x = 20;
    backButton2.y = 10;
    backButton2.interactive = true;
    backButton2.buttonMode = true;
    backButton2.on('pointerup', goBack);
    backButton2.on('pointerover', e => e.target.alpha = 0.7);
    backButton2.on('pointerout', e => e.currentTarget.alpha = 1.0);
    menuScreen.addChild(backButton2);
    
    let backButton3 = new PIXI.Text("BACK");
    backButton3.style = buttonStyle;
    backButton3.x = 20;
    backButton3.y = 10;
    backButton3.interactive = true;
    backButton3.buttonMode = true;
    backButton3.on('pointerup', goBack);
    backButton3.on('pointerover', e => e.target.alpha = 0.7);
    backButton3.on('pointerout', e => e.currentTarget.alpha = 1.0);
    highScoreScreen.addChild(backButton3);
    
    //game screen
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 24,
        fontFamily: 'Exo'
    })
    
    //instructions
    let instructions = new PIXI.Text("Can you run the pass?\n\nYou are an up and coming chef that has to prove worthy of handling \nthe kitchen to becomethe head chef.\n\nThe wave # and customer happiness is located on the top right. \nThe orders will appear below, but you will only have 10 seconds per \nwave to get the order!\nClick the corresponding foods to complete the order.\nYou will lose customer satisfaction if you do not complete the order \nand if you click the wrong dish.\nWhen you are done press the bell icon to go to the next wave.\nKeep going until the customer happiness reaches 0. \n\nHave fun!\n\nDon't forget to look at the dinner menu for the names of the dishes.");
    instructions.style = textStyle;
    instructions.x = 25;
    instructions.y = 80;
    howToScreen.addChild(instructions);
    
    //game
    let gameBackground = new PIXI.Sprite.fromImage("media/Background.png");
    gameBackground.anchor.x = 0;
    gameBackground.anchor.y = 0;
    gameBackground.position.x = 0;
    gameBackground.position.y = 0;
    gameScreen.addChild(gameBackground);
    
    happinessLabel = new PIXI.Text();
    happinessLabel.style = textStyle;
    happinessLabel.x = 15;
    happinessLabel.y = 45;
    gameScreen.addChild(happinessLabel);
    increaseHappiness(0);
    decreaseHappiness(0);
    
    waveNumLabel = new PIXI.Text(`Wave  # ${numLevel}`);
    waveNumLabel.style = textStyle;
    waveNumLabel.x = 15;
    waveNumLabel.y = 15;
    gameScreen.addChild(waveNumLabel);
    
    //button to trigger the 'send off'
    serviceBell = new PIXI.Sprite.fromImage("media/bell1.png");
    serviceBell.scale.x *= 3;
    serviceBell.scale.y *= 3;
    serviceBell.x = screenWidth - 100;
    serviceBell.y = screenHeight - 80;
    serviceBell.interactive = true;
    serviceBell.buttonMode = true;
    serviceBell.on('pointerup', servicePlease);
    serviceBell.on('pointerover', e => e.target.alpha = 0.7);
    serviceBell.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameScreen.addChild(serviceBell);
    
    //where the orders will show up
    orderLabel = new PIXI.Text(`Orders -- \n ${order}`);
    orderLabel.style = textStyle;
    orderLabel.x = 15;
    orderLabel.y = 100;
    gameScreen.addChild(orderLabel);
    
    //gameover screen
    let gameOverLabel = new PIXI.Text("GAME OVER!");
    gameOverLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 82,
        fontFamily: 'Permanent Marker'
    });
    gameOverLabel.x = 160;
    gameOverLabel.y = 120;
    gameOverScreen.addChild(gameOverLabel);
    
    wavesLasted = new PIXI.Text();
    wavesLasted.style = textStyle;
    wavesLasted.x = 240;
    wavesLasted.y = 250;
    gameOverScreen.addChild(wavesLasted);
    
    let playAgainButton = new PIXI.Text("PLAY AGAIN?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 180;
    playAgainButton.y = screenHeight - 180;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on('pointerup', startGame);
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7);
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameOverScreen.addChild(playAgainButton);
    
    let backToMenu = new PIXI.Text("MENU");
    backToMenu.style = buttonStyle;
    backToMenu.x = 480;
    backToMenu.y = screenHeight - 180;
    backToMenu.interactive = true;
    backToMenu.buttonMode = true;
    backToMenu.on('pointerup', goBack);
    backToMenu.on('pointerover', e => e.target.alpha = 0.7);
    backToMenu.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameOverScreen.addChild(backToMenu);
    
    //high scores
    highScoresList = new PIXI.Text("HIGH SCORES \n\nName --- Waves Lasted\n\n");
    highScoresList.style = textStyle;
    highScoresList.x = 100;
    highScoresList.y = 100;
    highScoreScreen.addChild(highScoresList);
    
    highScores.removeItem("Name");
}

//will start the game
function startGame() {
    startScreen.visible = false;
    menuScreen.visible = false;
    howToScreen.visible = false;
    gameOverScreen.visible = false;
    gameScreen.visible = true;
    highScoreScreen.visible = false;
    numLevel = 1;
    customerSatis = 100;
    increaseHappiness(0);
    decreaseHappiness(0);
    loadLevel();
    
    //timer to force going to the next stage
    if (gameScreen.visible == true) {
        timer = setInterval(servicePlease, 10000);
    }
    
    bgSound.play();
}

//will go to the menu screen, showing thee dinner menu to the user
function readMenu() {
    startScreen.visible = false;
    menuScreen.visible = true;
    howToScreen.visible = false;
    gameOverScreen.visible = false;
    gameScreen.visible = false;
    highScoreScreen.visible = false;
}

//goes to the instructions
function learnHowTo() {
    startScreen.visible = false;
    menuScreen.visible = false;
    howToScreen.visible = true;
    gameOverScreen.visible = false;
    gameScreen.visible = false;
    highScoreScreen.visible = false;
}

//will show the high score screen
function goToScores() {
    startScreen.visible = false;
    menuScreen.visible = false;
    howToScreen.visible = false;
    gameOverScreen.visible = false;
    gameScreen.visible = false;
    highScoreScreen.visible = true;
    
    if (highScores.length == 0) {
        highScoresList.text = "No one has played yet!"
    }
    else {
        if (highScores.length > 10)
            displayTopTen();
        else {
            for (let i = 0; i < highScores.length; i++) {
                let name = highScores.key(i);
                let score = highScores.getItem(name);
                highScoresList.text += `${name} ---  ${score} \n`;
            }
        }
    }
}

//will display ten players
function displayTopTen() {
    for (let i = 0; i < 10; i++) {
        let name = highScores.key(i);
        let score = highScores.getItem(name);
        highScoresList.text += `${name} ---  ${score} \n`;
    }
}

//goes back to the main screen
function goBack() {
    startScreen.visible = true;
    menuScreen.visible = false;
    howToScreen.visible = false;
    gameOverScreen.visible = false;
    gameScreen.visible = false;
    highScoreScreen.visible = false;
}

//function to increase the customer happiness
function increaseHappiness(value) {
    customerSatis += value;
    happinessLabel.text = `Happiness:   ${customerSatis}`;
    
    if (customerSatis >= 100)
        customerSatis = 100;
}

//function to decrease the customer happiness
function decreaseHappiness(value) {
    customerSatis -= value;
    happinessLabel.text = `Happiness:   ${customerSatis}`;
}

//places the food in a layout, static
function displayFood() {
    createFood("Lobster Risotto", 460, 150);
    createFood("Pumpkin Soup", 610, 150);
    
    createFood("Foie Gras", 400, 250);
    createFood("Seared Scallops", 550, 250);
    createFood("Ceaser Salad", 700, 250);
    
    createFood("Beef Wellington", 460, 350);
    createFood("Filet Mignon", 610, 350);
    createFood("NY Steak", 400, 450);
    createFood("Salmon", 550, 450);
    createFood("Lamb", 700, 450);
}

//loads the next level
function loadLevel() {
    order = [];
    createOrder(numLevel);
    orderLabel.text = `Orders -- \n`;
    order.forEach(function(o) {
        orderLabel.text += `${o} \n`
    })

    paused = false;
    
    timer = setTimeout(servicePlease, 10000);
}

//checks to see if the order matches what the user picks
function servicePlease() {
    serviceBellSound.play();
    clearInterval(timer);
    
    if (order.length == 0) {
        if (customerSatis >= 100) 
            customerSatis = 100;
        else
            increaseHappiness(1);
    }
    
    else {
        decreaseHappiness(numLevel);
    }
    
    numLevel++;
    loadLevel();
    waveNumLabel.text = `Wave  # ${numLevel}`;
        
    if (customerSatis >= 100) {
        customerSatis = 100;
    }
    
    else if (customerSatis <= 0) {
        end();
    }
}

//creates the order, depending on the level == difficulty
function createOrder(currLevel){
    let numOfDishes;
    
    if (currLevel % 10 == 0)
        numOfDishes = Math.floor(Math.random() * 11) + 1;
    else
        numOfDishes = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numOfDishes; i++) 
        order[i] = foodText[(Math.floor(Math.random() * 10))];
    
    order.forEach(function(food) { 
        orderLabel.text += food + "\n";
    });
}

function end() {
    clearTimeout(timer);
    paused = true;
    
    order = [];
    
    bgSound.stop();
    
    gameOverScreen.visible = true;
    gameScreen.visible = false;
    
    wavesLasted.text = `You lasted ${numLevel - 1} waves!`;
    
    let prompt = window.prompt("Please enter your name", "");

    if (prompt == null || prompt == "") {
        name = "No Name";
    }
    else {
        name = prompt;
    }
    
    highScores.setItem(name, numLevel - 1);
}

function createFood(food, x, y) {
        dish = foodSprites[foodText.indexOf(food)];
        //dish = new Food(food, x, y);
        dish.name = food;
        dish.x = x;
        dish.y = y;
        dish.anchor.set(.5, .5);
        dish.scale.set(3);
        dish.interactive = true;
        dish.buttonMode = true;
        
        dish
            .on('click', checkOrder)
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd);
            //.on('pointermove', onDragMove)
    
        gameScreen.addChild(dish);
}

function playSound() {
    let index = Math.floor(Math.random() * 3 + 1)
    
    if (index == 1)
        fryingSound.play();
    
    else if (index == 2)
        chopSound.play();
    
    else
        waterSound.play();
}

function checkOrder(e) {
    playSound();
    
    let food = e.target.name;
    
    if (!order.includes(food)) {
        decreaseHappiness(Math.floor(Math.random() * 15 + 3));
    
        if (customerSatis <= 0)
            end();
    }
    
    else {
        let index = order.indexOf(food.toString());
        order.splice(index, 1);
        //let labelIndex = orderLabel.getChildIndex(food.toString());
        //orderLabel.removeChildAt(labelIndex);
        
        //updates the order list
        orderLabel.text = "";
        orderLabel.text = `Orders -- \n`;
        
        order.forEach(function(food) { 
            orderLabel.text += food + "\n";
        });
    }
}

function onDragStart(e) {
        this.data = e.data;
        this.alpha = 0.5;
        this.dragging = true;
     }

function onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }

function onDragMove() {
        if (this.dragging) {
            let newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }