// GLOBAL VARIABLES
const cars = ["A", "B", "C", "D", "E", "F", "G", "H"] // Row names

class Brush {
    constructor(brushColor,inUse) {
        this.brushColor = brushColor;
        this.inUse = inUse;
    }
}

const userBrush = new Brush("blue",true);
const eraser = new Brush("white",false);

function changeColor() {
    const cells = document.querySelectorAll("#colorTab td"); // Creates a NodeList-array type object of color cells

    cells.forEach(function(cell) {
        cell.addEventListener("click", function() {
            userBrush.brushColor = window.getComputedStyle(cell).backgroundColor; // Changes brush color based on clicked element
            console.log("changeColor!");
        });
    });
};

function paint() {
    const cells = document.querySelectorAll("#gridTable td");

    cells.forEach(function(cell) { // Each individual cell listens for the following events
        cell.addEventListener("click", function() {
            if(eraser.inUse) { // Erase function
                cell.style.backgroundColor = eraser.brushColor;
                console.log("erase!");
            } else if (userBrush.inUse) { // Paint function
                cell.style.backgroundColor = userBrush.brushColor;
                console.log("paint!");
            }
        });
    });                    
}

function toolToggle() {
    const eraserBtn = document.getElementById("eraser");
    const brushBtn = document.getElementById("brush");

    eraserBtn.addEventListener("click", function() { // Switches the boolean of tool when one or the other is clicked
        eraser.inUse = true;
        userBrush.inUse = false;
        console.log("eraser in use");
    });

    brushBtn.addEventListener("click", function() {
        eraser.inUse = false;
        userBrush.inUse = true;
        console.log("brush in use");
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
            //colorPixel.textContent = `${cars[r]}${c}`; // Shows pixel labels

            colorPixel.id = `${cars[r]}${c}`; // Adds an ID to each cell
            

            colorRow.appendChild(colorPixel);
        }
        colorTable.appendChild(colorRow);
    }
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
document.addEventListener('DOMContentLoaded', () => {
    buildGridTable();
    buildColorTable();
    //highlightCells();
    paint();
    changeColor();
    toolToggle();
});
