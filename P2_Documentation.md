# Project 2: DOM game - Connect 4
Developers: Calvin To and Ilana Leva

### Here are some features that we hope to have to make our Connect4 game different and stand out from others:
1. Have the user be able to choose their own color from a palette, both users cannot have the same color
2. The board will be very aesthetically pleasing in the sense that the colors and design will not strain the players eyes

### The basic game with rules are as follows:
1. Players will compete with one another to get four of their own pieces in a row, horizontally, vertically, or diagonally to win
2. Each player will only be able to drop one of their pieces onto the board per turn
3. If either player is unable to get four of their pieces in a row, then it will be considered a tie, no one wins or loses
4. The playing board will be the standard 6 by 7 slots

### Other considerations:
-If the board was any bigger/smaller it would take away the fun from the classic game, the chances of winning would be skewed
-We would also have to consider the board size : the number peices required to be connected in order to win

### Possible expansions:
1. Having a timer for each turn, like chess, so the game does not drag on for a long time
2. Putting sound for when the player "drops" their piece onto the board
3. Changing the number of pieces in order to connect to win, like instead of four pieces, it could be five, etc.
4. Keeping track of the wins and losses of each player in storage
5. Implement a coin flip to determine who goes first

### Plan/Process:
It will be a tile-based game because it is realistic and doable since we got some experience with tile-base programs recently.
Functions will include a restart/play again button after a winner/tie is declared. Player 1 will always go first, unless we implement
something else. The color that correspond to each player will be their font color, i.e Player 1 is red, the font and playing piece will red. 

### Design:
Having the board centered, Player 1 will be shown on the left and Player 2 will be shown on the right. The title will be shown centered and the buttons will be below that. The buttons will include (restart) and (stats)*. If there is a timer, it will be shown below each player's name. Selecting the color will be above the names.

*will only be there if we implement the scoring system

### Contributions-
Ilana- Typed up the formal write-up on github
Calvin-
