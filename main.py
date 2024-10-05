from http import client
from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import requests
import httpx

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Constants
SKODA_FABIA_MASS_KG = 1055  # Mass of Škoda Fabia 1.2 HTP in kg
SKODA_FABIA_LENGTH_M = 3.96  # Length of Škoda Fabia 1.2 HTP in meters
SKODA_FABIA_WIDTH_M = 1.65   # Width of Škoda Fabia 1.2 HTP in meters
SKODA_FABIA_HEIGHT_M = 1.498  # Height of Škoda Fabia 1.2 HTP in meters
SKODA_FABIA_AREA_M2 = SKODA_FABIA_LENGTH_M * SKODA_FABIA_WIDTH_M  # Area without maneuvering space
SKODA_FABIA_PARKING_AREA_M2 = 12.5  # Area required per car including maneuvering space
SKODA_FABIA_POWER_KW = 47  # Power of Škoda Fabia 1.2 HTP in kW

# Conversion factors
CONVERSION_FACTORS = {
    'mass': {
        'kg': 1,
        't': 1000,
        'g': 0.001,
        'mg': 1e-6,
        'lbs': 0.453592,
        'oz': 0.0283495
    },
    'length': {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34
    },
    'width': {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34
    },
    'height': {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34
    },
    'area': {
        'm2': 1,
        'cm2': 0.0001,
        'mm2': 1e-6,
        'ft2': 0.092903,
        'in2': 0.00064516,
        'yd2': 0.836127,
        'ha': 10000,
        'acre': 4046.86
    },
    'power': {
        'kW': 1,
        'hp': 0.7457,
        'W': 0.001,
        'MW': 1000
    }
}

# Conversion functions
def convert_mass_to_fabia_units(mass: float, unit: str) -> float:
    mass_kg = mass * CONVERSION_FACTORS['mass'][unit]
    return round(mass_kg / SKODA_FABIA_MASS_KG, 2)

def convert_length_to_fabia_units(length: float, unit: str) -> float:
    length_m = length * CONVERSION_FACTORS['length'][unit]
    return round(length_m / SKODA_FABIA_LENGTH_M, 2)

def convert_width_to_fabia_units(width: float, unit: str) -> float:
    width_m = width * CONVERSION_FACTORS['width'][unit]
    return round(width_m / SKODA_FABIA_WIDTH_M, 2)

def convert_height_to_fabia_units(height: float, unit: str) -> float:
    height_m = height * CONVERSION_FACTORS['height'][unit]
    return round(height_m / SKODA_FABIA_HEIGHT_M, 2)

def convert_area_to_fabia_units(area: float, unit: str, scenario: str = "packed") -> float:
    area_m2 = area * CONVERSION_FACTORS['area'][unit]
    if scenario == "parking_lot":
        return round(area_m2 / SKODA_FABIA_PARKING_AREA_M2, 2)
    else:
        return round(area_m2 / SKODA_FABIA_AREA_M2, 2)

def convert_power_to_fabia_units(power: float, unit: str) -> float:
    power_kw = power * CONVERSION_FACTORS['power'][unit]
    return round(power_kw / SKODA_FABIA_POWER_KW, 2)

# Endpoints
@app.get("/convert/mass/{mass}")
def convert_mass(mass: float, unit: str):
    """
    Convert mass to Škoda Fabia 1.2 HTP units.
    - **mass**: The mass to convert (default example: 400).
    - **unit**: The unit of the mass (default: kg).
    """
    return {"fabia_units": convert_mass_to_fabia_units(mass, unit)}

@app.get("/convert/length/{length}")
def convert_length(length: float, unit: str):
    """
    Convert length to Škoda Fabia 1.2 HTP units.
    - **length**: The length to convert.
    - **unit**: The unit of the length (e.g., m, cm, mm, in, ft, yd, mi).
    """
    return {"fabia_units": convert_length_to_fabia_units(length, unit)}

@app.get("/convert/width/{width}")
def convert_width(width: float, unit: str):
    """
    Convert width to Škoda Fabia 1.2 HTP units.
    - **width**: The width to convert.
    - **unit**: The unit of the width (e.g., m, cm, mm, in, ft, yd, mi).
    """
    return {"fabia_units": convert_width_to_fabia_units(width, unit)}

@app.get("/convert/height/{height}")
def convert_height(height: float, unit: str):
    """
    Convert height to Škoda Fabia 1.2 HTP units.
    - **height**: The height to convert.
    - **unit**: The unit of the height (e.g., m, cm, mm, in, ft, yd, mi).
    """
    return {"fabia_units": convert_height_to_fabia_units(height, unit)}

@app.get("/convert/area/{area}")
def convert_area(area: float, unit: str, scenario: str = Query("packed", enum=["packed", "parking_lot"])):
    """
    Convert area to Škoda Fabia 1.2 HTP units.
    - **area**: The area to convert.
    - **unit**: The unit of the area.
    - **scenario**: The scenario for the conversion (packed or parking_lot).
    """
    
    return {"fabia_units": convert_area_to_fabia_units(area, unit, scenario)}

@app.get("/convert/power/{power}")
def convert_power(power: float, unit: str):
    """
    Convert power to Škoda Fabia 1.2 HTP units.
    - **power**: The power to convert.
    - **unit**: The unit of the power.
    """
    
    return {"fabia_units": convert_power_to_fabia_units(power, unit)}

# Serve the index.html file
@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/embed", response_class=HTMLResponse)
def generate(value: float, conversion_type: str, unit: str, scenario: str):
    """
    Creates emded html code for further use.
    - **value**: The value to convert.
    - **conversion_type**: The type of conversion (e.g., area, power).
    - **unit**: The unit of the value.
    - **scenario**: The scenario for the conversion (optional).
    """
    
    
    if conversion_type == "area" and scenario:
        url = f"http://127.0.0.1:8000/convert/{conversion_type}/{value}?unit={unit}&scenario={scenario}"
    else:
        url = f"http://127.0.0.1:8000/convert/{conversion_type}/{value}?unit={unit}"
        

    response = requests.get(url)
    result = response.json()
    fabia_units = result.get("fabia_units", 0)
    # Extend the response with additional information
    extended_result = {
        "original_value": value,
        "unit": unit,
        "conversion_type": conversion_type,
        "fabia_units": fabia_units,
        "message": f"The conversion of {value} {unit} {conversion_type} is approximately {fabia_units:.2f} Škoda Fabia 1.2 HTP units."
    }

    # Generate the HTML content
    html_content = f"""
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
       <p><strong>Good to know:</strong> {extended_result['message']}</p>
    </div>
    """
    
    return HTMLResponse(content=html_content)

# Run the application
# Command: uvicorn main:app --reload