# Importng flask to be used
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

# Create a flask object
app = Flask(__name__)
CORS(app)

@app.route('/save-colors', methods=['POST'])
def saveColors(): ## The main code that is being run, also can be thought of as a "page"
    colors = request.get_json() # Converts the json file into a python list
    print("Received color list:")
    gridWidth = 12
    global grid_2d
    grid_2d = []

    for i in range(0, len(colors), gridWidth): # From 0 to the length of the colors array, every gridWith...
        row = colors[i:i + gridWidth] # Save the next 7 values value to the row array
        grid_2d.append(row) # Append the row array to the 2D array

    grid_as_str = repr(grid_2d)

    with open("test.py", "w") as file:
        file.write(
        f"""
from opentrons import protocol_api

metadata = {{"apiLevel": "2.16"}} # Double braces outputs a literal brace preventing error

def run(protocol: protocol_api.ProtocolContext):
    grid_2d = {grid_as_str} # f-string allows grid_2d variable to be inserted & saved as a string
    tips = protocol.load_labware("opentrons_96_tiprack_300ul", 1)
    reservoir = protocol.load_labware("nest_12_reservoir_15ml", 2)
    plate = protocol.load_labware("nest_96_wellplate_200ul_flat", 3)
    left_pipette = protocol.load_instrument(
        "p300_single_gen2", "right", tip_racks=[tips]
    )
    plate_row = 8
    plate_column = 12
    colors = [
        "rgb(255, 0, 0)", "rgb(236, 92, 92)", "rgb(255, 165, 0)", "rgb(248, 187, 74)",
        "rgb(215, 215, 39)", "rgb(255, 255, 0)", "rgb(0, 128, 0)", "rgb(103, 236, 103)",
        "rgb(53, 70, 201)", "rgb(103, 203, 236)", "rgb(157, 15, 157)", "rgb(216, 94, 235)"
    ]
    
    for i in range(12):  # Looping through all the colors in the program
        colorUsed = 0  # Counter that checks if a pipette has been used for a certain color

        if not left_pipette.has_tip:  # Only picks up the pipette after a new color
            left_pipette.pick_up_tip()

        for j in range(plate_row):
            for k in range(plate_column):
                color = grid_2d[j][k]
                if color == colors[i]:
                    left_pipette.transfer(50, reservoir["A" + str(i + 1)], plate.rows()[j][k], new_tip='never')
                    colorUsed += 1

        if colorUsed > 0:  # Only drops pipette if it has been used
            left_pipette.drop_tip()
        """
    )
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)