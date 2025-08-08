// BRUSH CLASS
class Brush {
    constructor(brushColor,inUse) {
        this.brushColor = brushColor;
        this.inUse = inUse;
    }
}

// GLOBAL VARIABLES
const rowHeader = ["A", "B", "C", "D", "E", "F", "G", "H"] // Row names
const userBrush = new Brush("blue",true);
const eraser = new Brush("white",false);

// INITIAL BRUSH SETTING
rectangle1.style.border = '3px solid rgba(234, 234, 234, 1)'; // Setting the default tool to the brush.
rectangle1.style.borderRadius = '5px';
rectangle1.style.boxShadow = '0 0 15px 2px rgba(255, 255, 255, 0.75)'; // Adds a box shadow to the brush rectangle

function changeColor() {
    const colorCells = document.querySelectorAll("#colorTab td");

    colorCells.forEach(function(cell) { // For each cell in the color-table, run the code below
        cell.style.border = 'none';
        cell.addEventListener("click", function() { // When this cell is clicked, change the color of the userBrush

            colorCells.forEach(function(cell) {
                cell.style.outline = 'none'; // Removes the outline from all cells in the color table
            });

            cell.style.outline = '5px solid rgba(255, 255, 255, 1)'; // Adds an outline to the clicked cell
            cell.style.outlineOffset = '-2px'; // Moves the outline closer to the cell
            userBrush.brushColor = window.getComputedStyle(cell).backgroundColor; // Changes brush color based on clicked element

            // Update the eraser and brush states
            eraser.inUse = false;
            userBrush.inUse = true;
            rectangle1.style.border = '3px solid rgba(234, 234, 234, 1)';
            rectangle1.style.borderRadius = '5px';
            rectangle1.style.boxShadow = '0 0 15px 2px rgba(255, 255, 255, 0.75)'; // Adds a box shadow to the brush rectangle
            rectangle2.style.border = 'none'; // Removes border from the brush rectangle
            rectangle2.style.boxShadow = 'none'; // Removes box shadow from the eraser rectangle'
        });
    });

};

function applyBrushColor(cell) {
    if (eraser.inUse) {
        cell.style.backgroundColor = eraser.brushColor;
    } else if (userBrush.inUse) {
        cell.style.backgroundColor = userBrush.brushColor;
    }
}

function paint() {
    const cells = document.querySelectorAll("#gridTable td"); // Creates a NodeList object of grid cells, similar to an array
    let isPainting = false;

    // Prevent default drag behavior on the grid
    document.querySelector("#gridTable").addEventListener("dragstart", (e) => {
        e.preventDefault();
    });

    // Add user-select: none to prevent text selection
    document.querySelector("#gridTable").style.userSelect = "none";

    document.addEventListener("mousedown", () => {
        isPainting = true; // Start painting when the mouse button is pressed
    });

    document.addEventListener("mouseup", () => {
        isPainting = false; // Stop painting when the mouse button is released
    });

    cells.forEach(function(cell) {
        cell.addEventListener("mouseenter", function() {
            if (isPainting) {
                applyBrushColor(cell);
            }
        });
        cell.addEventListener("click", function() {
            applyBrushColor(cell);
        });
    });
}

function toolToggle() {
    const eraserBtn = document.getElementById("rectangle2");
    const brushBtn = document.getElementById("rectangle1");
    const rectangle1 = document.getElementById("rectangle1");
    const rectangle2 = document.getElementById("rectangle2");

    eraserBtn.addEventListener("click", function() { // Switches the boolean of tool when one or the other is clicked
        eraser.inUse = true;
        userBrush.inUse = false;
        rectangle2.style.border = '3px solid rgba(234, 234, 234, 1)';
        rectangle2.style.borderRadius = '5px';
        rectangle2.style.boxShadow = '0 0 15px 2px rgba(255, 255, 255, 0.75)'; // Adds a box shadow to the eraser rectangle
        rectangle1.style.border = 'none'; // Removes border from the brush rectangle
        rectangle1.style.boxShadow = 'none'; // Removes box shadow from the brush rectangle
    }); 

    brushBtn.addEventListener("click", function() {
        eraser.inUse = false;
        userBrush.inUse = true;
        rectangle1.style.border = '3px solid rgba(234, 234, 234, 1)';
        rectangle1.style.borderRadius = '5px';
        rectangle1.style.boxShadow = '0 0 15px 2px rgba(255, 255, 255, 0.75)'; // Adds a box shadow to the brush rectangle
        rectangle2.style.border = 'none'; // Removes border from the brush rectangle
        rectangle2.style.boxShadow = 'none'; // Removes box shadow from the eraser rectangle
    });        
}

function highlightCells() {
    const cells = document.querySelectorAll("#gridTable td"); // Creates a NodeList-array type object of grid cells

    cells.forEach(function(cell) { // Loops through all the cells in table
        cell.addEventListener("mouseenter", function() { // If detected mouse movement, cell turns gray 
            cell.style.backgroundColor = "lightgray";
        });

        cell.addEventListener("mouseleave", function() { // When the mouse leaves, the cell reverts to white
            cell.style.backgroundColor = "white";
        });
    });
}

function buildGridTable() {
    const table = document.getElementById('gridTable');
    const rows = 8;
    const cols = 12;

    for (let r = 0; r < rows; r++) { // Loop creates grid pattern, by appending td ("pixel") elements to one another
        const row = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const pixel = document.createElement('td');
            //pixel.textContent = `${c},${r}`; // Labeling the pixels
            pixel.id = `${c},${r}`;
            row.appendChild(pixel); // Adds pixel to the row
        }
        table.appendChild(row); // Adds finished row to the table
    }
}

function buildColorTable() {
    const colorTable = document.getElementById('colorTab');
    const colorRows = 6;
    const colorCols = 2;
    
    for(let r = 0; r < colorRows; r++ ) { // Loops through every row and column to create the color table
        const colorRow = document.createElement('tr');

        for(let c=0; c < colorCols; c++) {
            const colorPixel = document.createElement('td');
            //colorPixel.textContent = `${rowHeader[r]}${c}`; // Shows pixel labels
            colorPixel.style.color = 'rgba(255, 255, 255, 0.5)';
            colorPixel.id = `${rowHeader[r]}${c}`; // Adds an ID to each cell
            colorRow.appendChild(colorPixel);
        }
        colorTable.appendChild(colorRow);
    }
}

function clearGrid() {
    const cells = document.querySelectorAll("#gridTable td"); // Creates a NodeList of grid cells
    cells.forEach(function(cell) {
        cell.style.transition = "background-color 0.4s cubic-bezier(.4,0,.2,1)";
        cell.style.backgroundColor = "white";
    });
}

function run() {
    const colors = [];

    document.querySelectorAll('#gridTable td').forEach(cell => {
        const color = cell.style.backgroundColor || 'white';
        colors.push(color);
    });
        fetch('http://127.0.0.1:5000/save-colors', { // The URL colors array is being sent to 
        method: 'POST', // Identifying what type of operation, sending a certain piece of data
        headers: { 'Content-Type': 'application/json' }, // Identifying what kind of file, a json
        body: JSON.stringify(colors) // Sending the json file of the colors
    });
    console.log(("run has functioned"));
}

// RUN FUNCTIONS
document.addEventListener('DOMContentLoaded', () => { // Runs functions after HTML doc is fully loaded, ensuring they work
    buildGridTable();
    buildColorTable();
    //highlightCells();
    paint();
    changeColor();
    toolToggle();
    // Connect trash can icon to clearGrid
    const clearBtn = document.getElementById("rectangle3");
    if (clearBtn) {
        clearBtn.addEventListener("click", clearGrid);
    }
});
