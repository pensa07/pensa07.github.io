// common code for puzzles

// this version is for a word input by text GUI of 4 letters
// should work for 5 
// version 1.0.0 26/4/23 - const rowMatched removed
// version 1.0.1 27/4/23 - word array of chars removed as 4 letter dependency
//                           in illegalWord line 180
//                        improved user messages in processInputWord line 209
// version 1.1.0 4/5/23 - major revision to drag and drop tiles
// version 1.1.1 6/5/23 - revised for 5 letter version and rack tiles with >9
//                         line 150ish checking for blank

// from here down is common or calculated from above
const upperKey = key.toUpperCase();
const ordersq = order * order;
const vocabLength = vocab.length;
const rackLength = ordersq - (2 * order);
const tileSetSize = (2 * order * order) - order;
const upperDest = dest.toUpperCase();
const solutionChar = [];
for (let i = 0; i < order; i++) {
  for (let j = 0; j < order; j++) {
    solutionChar[(i * order) + j] = solution[i].slice(j, j+1).toUpperCase();
  }
}
const tileSet = [];
const tileUpperSet = [];
for (let i = 0; i < order; i++) {
  tileSet[i] = key;
  tileUpperSet[i] = tileSet[i].toUpperCase();
}
for (let i = 0; i < order; i++) {
  tileSet[i + order] = dest[i];
  tileUpperSet[i + order] = tileSet[i + order].toUpperCase();
}
for (let i = 0; i < rackLength; i++) {
  tileSet[i + (2 * order)] = rack[i];
  tileUpperSet[i + (2 * order)] = tileSet[i + (2 * order)].toUpperCase();
}
for (let i = ordersq; i < tileSetSize; i++) {
  tileSet[i] = '_';
  tileUpperSet[i] = tileSet[i];
}
const tilePos = [];
const tileHomePos = [];
// keys
for (let i = 0; i < order; i++) {
  tilePos[i] = (i * order) + i;
  tileHomePos[i] = tilePos[i];
}
// dest
for (let i = 0; i < order; i++) {
  tilePos[i + order] = ordersq + i;
  tileHomePos[i + order] = tilePos[i + order];
}
// rack
for (let i = 0; i < rackLength; i++) {
  tilePos[i + (2 * order)] = ordersq + order + i;
  tileHomePos[i + (2 * order)] = tilePos[i + (2 * order)];
}
// blanks
let i = 0;
let j = 0;
let ind = 0;
for (let k = ordersq; k < tileSetSize; k++) {
  if (i != j) {
    ind += 1;
  }
  tilePos[k] = ind;
  tileHomePos[k] = tilePos[k];
  ind += 1;
  j += 1;
  if (j == order) {
    i += 1;
    j = 0;
  }
}

// tileSlot holds contents of grid, dest and rack in that order
// initialise for key charcter in grid amd dest and rack off-grid

const tileSlot = [];
let ind2 = ordersq;
for (let i = 0; i < order; i++) {
  for (let j = 0; j < order; j++) {
    if (i == j) {
      tileSlot[(order * i) + j] = i;
    } else {
      tileSlot[(order * i) + j] = ind2;
      ind2 += 1;
    }
  }
}
for (let k = ordersq; k < tileSetSize; k++) {
  tileSlot[k] = k - ordersq + order;
}

console.log("Tile slot array" + tileSlot);

// functions check type of tile based on index into tileSet array

function tsiIsKey (i) {
  if (i < order) {
    return true;
  }
  return false;
}

function tsiIsDest (i) {
  if (i >= order && i < (2 * order)) {
    return true;
  }
  return false;
}

function tsiIsRack (i) {
  if (tsiIsKey(i) || tsiIsDest(i) || tsiIsBlank(i)) {
    return false;
  }
  return true;
}

function tsiIsBlank (i) {
  if (i >= ordersq) {
    return true;
  }
  return false;
}

// functions to return index for grid, dest and rack in tileSlot

function tileSlotForDest (i) {
  return (ordersq + i);
}

function tileSlotForRack (i) {
  return (ordersq + order + i);
}

function tileSlotForGrid (i, j) {
  return ((i * order) + j);
}

function tileContentisNotBlank (tileId) {
  console.log ("check contents of tile " + tileId);
  let leadChar = tileId.slice(0, 1);
  if (leadChar == 'd') {
    let i = +tileId.slice(1,2);
    console.log ("Tile is " + tileId + " index " + i);
    return tilePresentInDestSlot (i);
  } else if (leadChar == 'r') {
    // check for 4 and 5 letter versions
    if (tileId.length == 2) {
      // format for 4 letters
      let i = +tileId.slice(1,2);
      return tilePresentInRackSlot (i);
    }  else {
      //   format for 5 letters  
      let i = +tileId.slice(1,3);
      return tilePresentInRackSlot (i);
    }
  } else if (leadChar == 'g') {
    let i = +tileId.slice(1,2);
    let j = +tileId.slice(2,3);
    console.log ("Tile is " + tileId + " index " + i + ", " + j);
    return tilePresentInGridSlot (i, j);
  } else {
    // should not happen
    console.log ("Tile id not of right type " + tileId);
    return true;
  }

}

setupBoard ();

const tryWord = document.getElementById("tryword");
const form = document.querySelector("form");
let dragTile = "";

document.addEventListener("dragstart", function(event) {
  dragTile = event.target.id;
  if (tileContentisNotBlank(dragTile)){
    console.log ("Move tile at " + dragTile);
    // allow movement
  } else {
    event.preventDefault();
  }
  console.log("Drag start " + dragTile);
  
});

document.addEventListener("drag", function(event) {
  //console.log("Dragging " + event.target.id);
  
});

document.addEventListener("dragend", function(event) {
  console.log("Drag end " + event.target.id);
  
});

document.addEventListener("dragenter", function(event) {
  //console.log("Drag enter " + event.target.id);
  
});

document.addEventListener("dragover", function(event) {
  event.preventDefault();
  //console.log("Drag over " + event.target.id);
  
});

document.addEventListener("dragleave", function(event) {
  //console.log("Drag leave " + event.target.id);
  
});

document.addEventListener("drop", function(event) {
  event.preventDefault();
  // dragTile is the id of the element being dragged
  // the contents are the actual tile
  let targetTile = event.target.id;
  console.log("Drop " + dragTile + " at " + targetTile + 
    " with class name " + event.target.className);
  if (tileContentisNotBlank(targetTile)) {
    userFeedback ("Cannot place tile where already occupied");
    return;
  }
  if (event.target.className == "button grid2but") {
    console.log("May be legal place to drop " + dragTile);
    // if the drag tile is coming from the rack then can move it from 
    // rack to grid - if dest tile not placed and only one space
    // left then place it
    let gridX = +targetTile.slice(1,2);
    let gridY = +targetTile.slice(2,3);
    let leadChar = dragTile.slice(0, 1);
    if (leadChar == 'r') {
      if (rackTileCountInRow(gridX) < (order - 2)) {
        if (dragTile.length == 2) {
          // format for 4 letters
          let i = +dragTile.slice(1,2);
          placeRackTile(i, gridX, gridY);
        }  else {
        //   format for 5 letters  
          let i = +dragTile.slice(1,3);
          placeRackTile(i, gridX, gridY);
        }
      } else {
        userFeedback("Cannot place tile as " + (order -2) + " tiles already placed");
      }
    } else if (leadChar == 'd') {
      let i = +dragTile.slice(1,2);
      if (i == gridX) {
        placeDestTile(i, gridY);
      }
    } else if (leadChar == 'g') {
      let i = +dragTile.slice(1,2);
      let j = +dragTile.slice(2,3);
      let tileSlotIndex = order * i + j;
      let tileSetIndex = tileSlot[tileSlotIndex];
      // put tile back in its home position then, if legal, in drag spot
      resetGridSlot (i, j);
      unsetRowMatched(i);
      if (tsiIsDest(tileSetIndex)) {
        if (gridX == i) {
          console.log("Moving dest tile from " + dragTile + " to " + targetTile 
           + " slot index " + tileSlotIndex + " set index " + tileSetIndex);
           placeDestTile(tileSetIndex - order, gridY);
        }
      } else {
        // must be rack
        if (rackTileCountInRow(gridX) < (order - 2)) {
          let rackIndex = tileSetIndex - (2 * order);
          placeRackTile(rackIndex, gridX, gridY);
        } else {
          userFeedback("Cannot place tile as " + (order -2) + " tiles already placed");
        }        
      }
    } else {
      userFeedback ("Tile identified is not selectable.");
    }
    if (rowFull(gridX))  {
      let tryWord = wordInRow(gridX);
      //console.log("Found word " + tryWord);
      if (checkWordInVocab(tryWord)) {
        vocabFeedback("Word is in vocabulary: " + tryWord.toUpperCase());
        setRowMatched (gridX);
      } else {
        vocabFeedback("Word not in vocab: " + tryWord.toUpperCase());
        console.log("Word not in vocab: " + tryWord);
        unsetRowMatched(gridX);
      }
    } else {
      userFeedback("No word in row: " + gridX);
      unsetRowMatched(gridX);
    }
  } else if (event.target.className == "button destbut" ||
            event.target.className == "button rackbut") {
    console.log("placing tile back in dest or rack" + dragTile);
    let i = +dragTile.slice(1,2);
    let j = +dragTile.slice(2,3);
    resetGridSlot (i, j);
    userFeedback("No word in row: " + i);
    unsetRowMatched(i);
  } 
  // if a row is full then check the word and give feedback
  setupBoard();
  if (allRowsMatch()) {
    declareSuccess();
  }
});

tryWord.addEventListener("input", (event) => {
  // this triggers on every character
  console.log("Try word ");
  let inputWord = document.getElementById("tryword").value;
  //console.log("Try word " + inputWord);
  //setupBoard();
});

form.addEventListener("submit", (event) => {
  // this triggers on cr or submit
  let inputWord = document.getElementById("tryword").value;
  console.log("Submit " + inputWord);
  event.preventDefault();
  if (processInputWord()) {
    console.log("Word found: " + inputWord);
    //userFeedback (inputWord.toUpperCase() + " entered");
  } else {
    console.log("Word not found: " + inputWord);
  }
  document.getElementById("tryword").value = "";
  setupBoard();
  if (allRowsMatch()) {
    declareSuccess();
  }
}); 

function illegalWord (inputWord) {
  let inputLength = inputWord.length;
  if (inputLength != order) {
    // error message - wrong number of characters
    userFeedback("Wrong number of characters: " + inputWord.toUpperCase());
    console.log("Wrong number of characters: " + inputWord);
    return true;
  }
  let lowerWord = inputWord.toLowerCase();
  console.log("Lower case word is " + lowerWord);
  let keyIndex = order + 1;
  let keyCount = 0;
  for (let i = 0; i < order; i++) {
    if (lowerWord.slice(i, i+ 1) == key) {
      keyIndex = i;
      keyCount += 1;
    }
  }
  if (keyCount == 0) {
    // error message - doesn't contain key
    userFeedback("Key not found in input word: " + inputWord.toUpperCase());
    console.log("Key not found in input word: " + inputWord);
    return true;
  } else if (keyCount > 1) {
    // error message - too many keys
    userFeedback("More than 1 key in input word: " + inputWord.toUpperCase());
    console.log("More than 1 key in input word: " + inputWord);
    return true;
  }
  if (!checkWordInVocab(lowerWord)) {
    vocabFeedback("Word not in vocab: " + inputWord.toUpperCase());
    console.log("Word not in vocab: " + inputWord);
    return true;
  }
  return false;
}

function processInputWord() {
  let inputWord = document.getElementById("tryword").value;
  if (illegalWord (inputWord)) {
    vocabFeedback (inputWord.toUpperCase() + " not in vocabulary");
    return false;
  }
  // keyindex gives the row
  let lowerWord = inputWord.toLowerCase();
  let keyIndex = lowerWord.indexOf(key);
  if (rowMatched[keyIndex]) {
    // something in this row already - 
    // if same word remove and leave blank else remove and replace
    let oldWord = wordInRow(keyIndex);
    resetRow(keyIndex);
    if (lowerWord == oldWord) {
      userFeedback (inputWord.toUpperCase() + " removed");
      console.log("Old word was the same, removed: " + oldWord);
      unsetRowMatched(keyIndex);
    } else {
      userFeedback ("Replace old word " + oldWord.toUpperCase() +
       " with new " + lowerWord.toUpperCase());
      console.log("Replace old word " + oldWord + " with new " + lowerWord);
      resetRow(keyIndex);
      placeWord(keyIndex, lowerWord);
      setRowMatched(keyIndex);
    }
  } else {
    // row blank or may be some dragged charcters 
    // remove characters and put in new word
    userFeedback ("Put new word " + lowerWord.toUpperCase() + " in row " + keyIndex);
    console.log("Put new word " + lowerWord + " in row " + keyIndex);
    resetRow(keyIndex);
    placeWord(keyIndex, lowerWord);
    setRowMatched(keyIndex);
  }
  return true;
}

function placeWord(index, word) {
  console.log("Place word " + word + " in row " + index);
  // place dest tilefirst
  let destChar = dest.slice(index, index + 1);
  console.log("Destination letter: " + destChar);
  let column = word.indexOf(destChar);
  placeDestTile(index, column);
  // place rack tiles 
  for (let i = 0; i < order; i++) {
    // so not index column or dest column
    if (i != index && i != column) {
      // find rack tile for the character
      let rackChar = word.slice(i, i + 1);
      let charFound = false;
      let charFoundIndex = 0;
      console.log("Rack letter: " + rackChar);
      for (let j = 0; j < rackLength; j++) {
        if (charFound) {
          // all done so should be while loop
        } else if (rackChar == rack[j]) {
          // is tile in rack so unused?
          if (tilePresentInRackSlot(j)) {
            placeRackTile(j, index, i);
            charFound = true;
          } else {
            // try for duplicates - carry on, keep index
            charFoundIndex = j;
          }
        }
      }
      if (!charFound) {
        // required rack tile already in use - have to rip up another row
        for (let j = 0; j < rackLength; j++) {
          if (charFound) {
            // all done so should be while loop
          } else if (rackChar == rack[j]) {
            // remove word containing char which row is it in?
            console.log("Remove row to get rack char " + rackChar + " position " + j);
            let rackPosIndex = tilePos[(2 * order) + j];
            let tileSetIndex = tileSlot[rackPosIndex];
            let rackGridIndex = tilePos[tileSetIndex];
            let tileCol = rackGridIndex % order;
            let rackRow = (rackGridIndex - tileCol) / order;
            console.log("Rack numbers: pos " + rackPosIndex + " tile " +
                tileSetIndex + " rack " + rackGridIndex + " col " + tileCol + " row " + rackRow);
            resetRow(rackRow);
            placeRackTile(j, index, i);
            charFound = true;
          }
        }
      }
    }
  }
}

function setupBoard() {
  //console.log("Set up board " + tileSlot);
  let tileId = "";
  for (let i = 0; i < order; i++) {
    tileId  = "d" + i;
    let index = tileSlotForDest (i);
    let tileCharIndex = tileSlot[index];
    // coud be char or blank
    document.getElementById(tileId).innerHTML = tileUpperSet[tileCharIndex];
    if (tsiIsBlank(tileCharIndex)) {
      document.getElementById(tileId).style.backgroundColor = "lightGray";
      // document.getElementById(tileId).draggable = "false";
    } else {
      document.getElementById(tileId).style.backgroundColor = "lightBlue";
      // document.getElementById(tileId).draggable = "true";
    }
  }
  for (let i = 0; i < rackLength; i++) {
    tileId  = "r" + i;
    let index = tileSlotForRack (i);
    let tileCharIndex = tileSlot[index];
    //console.log("Rack " + i + " index " + tileCharIndex);
    document.getElementById(tileId).innerHTML = tileUpperSet[tileCharIndex];
    if (tsiIsBlank(tileCharIndex)) {
      //console.log ("Is blank " + tileCharIndex);
      document.getElementById(tileId).style.backgroundColor = "lightGray";
      // document.getElementById(tileId).draggable = "false";
    } else {
      document.getElementById(tileId).style.backgroundColor = "lightYellow";
      // document.getElementById(tileId).draggable = "true";
    }
  }
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      tileId  = "g" + i + j;
      let index = tileSlotForGrid (i, j);
      let tileCharIndex = tileSlot[index];
      document.getElementById(tileId).innerHTML = tileUpperSet[tileCharIndex];
      if (i != j) {
        //console.log("Grid " + i + " " + j + " index " + tileCharIndex);
        if (tsiIsBlank(tileCharIndex)) {
          //console.log ("Is blank " + tileCharIndex);
          document.getElementById(tileId).style.backgroundColor = "lightGray";
        } else {
          // turns out draggable stuff is a nightmare and making it false actually makes it true.
          // needs to be true so things can move around so make it true in html
          // document.getElementById(tileId).draggable = "false";
          // distinguish between dest and rack tiles
          if (tsiIsDest (tileCharIndex)) {
            //console.log ("Is dest " + tileCharIndex);
            document.getElementById(tileId).style.backgroundColor = "lightBlue";
            //document.getElementById(tileId).draggable = "true";
          } else {
            //console.log ("Is rack " + tileCharIndex);
            document.getElementById(tileId).style.backgroundColor = "lightYellow";
            // document.getElementById(tileId).draggable = "true";
          }
        }
      } 
    }
  }
}

function showSolution() {
  console.log("Show solution");
  let tileId = "";
  for (let i = 0; i < order; i++) {
    tileId  = "d" + i;
    document.getElementById(tileId).innerHTML = '_';
    //document.getElementById(tileId).cursor = not-allowed;
  }
  for (let i = 0; i < rackLength; i++) {
    tileId  = "r" + i;
    document.getElementById(tileId).innerHTML = '_';
  }
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      tileId  = "g" + i + j;
      document.getElementById(tileId).innerHTML = solutionChar[(i * order) + j];
    }
  }
  for (let i=0; i < order; ++i) {
    let tileId = "train" + i;
    document.getElementById(tileId).style.backgroundColor = "lightseagreen";
  }
}

function resetGridSlot(row, column) {
  console.log("Reset tile in row " + row + " and column " + column);
  let gridSlotIndex = (row * order) + column;
  let tileSetIndex = tileSlot[gridSlotIndex];
  let homePosIndex = tileHomePos[tileSetIndex];
  tilePos[tileSetIndex] = homePosIndex;
  let prevPosIndex = tileSlot[homePosIndex];
  tilePos[prevPosIndex] = gridSlotIndex;
  tileSlot[homePosIndex] = tileSetIndex;
  tileSlot[gridSlotIndex] = prevPosIndex;
  //setupBoard();
}


function placeDestTile(row, column) {
  console.log("Place dest tile in row " + row + " and column " + column);
  // if dest tile already there then null but set destClickedSate back to false
  // if rack tile there then swop it out first
  // swop in dest tile
  swopDestTile (row, column);
  // just change as necessary
  //setupBoard();
}

function placeRackTile(index, row, column) {
  console.log("Place rack tile in row " + row + " and column " + column);
  // if rack tile already there then null but set destClickedSate back to false
  // if rack tile there then swop it out first
  // swop in dest tile
  swopRackTile (index, row, column);
  // just change as necessary
  //setupBoard();
}

function swopDestTile(row, column) {
  console.log("Swop dest tile in row " + row + " and column " + column);
  let destSlotIndex = ordersq + row;
  let destPosIndex = tileSlot[destSlotIndex];
  let gridSlotIndex = (row * order) + column;
  let gridPosIndex = tileSlot[gridSlotIndex];
  tileSlot[destSlotIndex] = gridPosIndex;
  tilePos[destPosIndex] = gridSlotIndex;
  tileSlot[gridSlotIndex] = destPosIndex;
  tilePos[gridPosIndex] = destSlotIndex;
}

function swopRackTile(index, row, column) {
  console.log("Swop rack tile in row " + row + " and column " + column);
  let rackSlotIndex = ordersq + order + index;
  let rackPosIndex = tileSlot[rackSlotIndex];
  let gridSlotIndex = (row * order) + column;
  let gridPosIndex = tileSlot[gridSlotIndex];
  tileSlot[rackSlotIndex] = gridPosIndex;
  tilePos[rackPosIndex] = gridSlotIndex;
  tileSlot[gridSlotIndex] = rackPosIndex; 
  tilePos[gridPosIndex] = rackSlotIndex;
}

function tilePresentInDestSlot(index) {
  let tileSlotIndex = ordersq + index;
  let tileSetIndex = tileSlot[tileSlotIndex];
  if (tileSetIndex < ordersq) {
     return true;
  }
  return false;
}

function tilePresentInRackSlot(index) {
  let tileSlotIndex = ordersq + order + index;
  let tileSetIndex = tileSlot[tileSlotIndex];
  if (tileSetIndex < ordersq) {
     return true;
  }
  return false;
}

function destTileInGridSlot(row, column) {
  let tileSlotIndex = order * row + column;
  let tileSetIndex = tileSlot[tileSlotIndex];
  if (tileSetIndex < order * 2) {
     return true;
  }
  return false;
}

function tilePresentInGridSlot(row, column) {
  let tileSlotIndex = order * row + column;
  let tileSetIndex = tileSlot[tileSlotIndex];
  if (tileSetIndex < ordersq) {
     return true;
  }
  return false;
}

function resetRow(index) {
  console.log("reset " + index + " clicked or row identified");
  // put any placed tiles back in their slots
  for (let i = 0; i < order; i++) {
    // don't reset leading diagonal key characters
    if (!(i == index)) {
      let tileSlotIndex = (order * index) + i;
      let tileSetIndex = tileSlot[tileSlotIndex];
      // if index shows it's a real character
      if (tileSetIndex < ordersq) {
        // means a tile is placed so can be unplaced
        // put back to home position
        resetGridSlot (index, i);
      }
    }
  }
  unsetRowMatched(index);
} 

function rackTileCountInRow(i) {
  let count = 0;
  for (let j = 0; j < order; j++) {
    let tileSlotIndex = (order * i) + j;
    let tileSetIndex = tileSlot[tileSlotIndex];
    // if index shows it's a rack character
    if (tsiIsRack(tileSetIndex)) {
      count += 1;
    }
  }
  return count;
}

function rowFull (index) {
  let full = true;
  for (let i = 0; i < order; i++) {
    let tileSlotIndex = (order * index) + i;
    let tileSetIndex = tileSlot[tileSlotIndex];
    // if index shows its a real character
    if (tileSetIndex >= ordersq) {
      full = false;
    } 
  }
  return full;
}

function wordInRow (index) {
  // make up word from characters in row 
  console.log("Checking word in row " + index);
  let word = "";
  for (let i = 0; i < order; i++) {
    let tileSlotIndex = (order * index) + i;
    let tileSetIndex = tileSlot[tileSlotIndex];
    // if index shows its a real character
    if (tileSetIndex < ordersq) {
      word  += tileSet[tileSetIndex];
    } else {
      console.log("Character not found in row " + index + word);
    }
  }
  return word;
}

function checkWordInVocab(word) {
  for (let i = 0; i < vocabLength; i++) {
    if (word == vocab[i]) {
      console.log("Found a match for :" + word);
      return true;
    } 
  }
  console.log("Not found a match for :" + word);
  return false;
}

function setRowMatched(i) {
  let tileId = "train" + i;
  document.getElementById(tileId).style.backgroundColor = "lightsalmon";
  rowMatched[i] = true;
}

function unsetRowMatched(i) {
  // change green to amber
  for (let j=0; j < order; ++j) {
    if (rowMatched[j]){
      let tileId = "train" + j;
      document.getElementById(tileId).style.backgroundColor = "lightsalmon";
    }
  }
  let tileId = "train" + i;
  document.getElementById(tileId).style.backgroundColor = "red";
  rowMatched[i] = false;
}

function allRowsMatch() {
  for (let i=0; i < order; ++i) {
    if (!rowMatched[i]) {
      return false;
    }
  }
  for (let i=0; i < order; ++i) {
    let tileId = "train" + i;
    document.getElementById(tileId).style.backgroundColor = "lightseagreen";
  }
  return true;
}

function userFeedback (mess) {
  document.getElementById("usermess").innerHTML = mess;
}

function vocabFeedback (mess) {
  document.getElementById("vocabmess").innerHTML = mess;
}

function declareSuccess () {
  console.log("Success placeholder");
  userFeedback("Congratulations - you have found a solution!");
}
