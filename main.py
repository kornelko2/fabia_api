from fastapi import FastAPI, Query, Request, Path, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import requests
import gettext
import json
import os

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount the locale directory to serve translation files
app.mount("/locale", StaticFiles(directory="locale"), name="locale")

# Set up gettext
localedir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'locale')
languages = ['en', 'es', 'fr']

def get_locale(request: Request):
    lang = request.headers.get('Accept-Language', 'en').split(',')[0]
    return lang if lang in languages else 'en'

def load_translations(lang):
    try:
        with open(os.path.join(localedir, lang, 'translation.json'), 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        with open(os.path.join(localedir, 'en', 'translation.json'), 'r', encoding='utf-8') as file:
            return json.load(file)

@app.middleware("http")
async def add_translation_middleware(request: Request, call_next):
    lang = get_locale(request)
    translation = gettext.translation('messages', localedir, languages=[lang], fallback=True)
    translation.install()
    request.state._ = translation.gettext
    response = await call_next(request)
    return response

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
def convert_mass(request: Request, mass: float, unit: str):
    """
    Convert mass to Škoda Fabia 1.2 HTP units.
    - **mass**: The mass to convert (default example: 400).
    - **unit**: The unit of the mass (default: kg).
    """
    _ = request.state._
    return {"fabia_units": convert_mass_to_fabia_units(mass, unit), "message": _("Mass converted successfully.")}

@app.get("/convert/length/{length}")
def convert_length(request: Request, length: float, unit: str):
    """
    Convert length to Škoda Fabia 1.2 HTP units.
    - **length**: The length to convert.
    - **unit**: The unit of the length (e.g., m, cm, mm, in, ft, yd, mi).
    """
    _ = request.state._
    return {"fabia_units": convert_length_to_fabia_units(length, unit), "message": _("Length converted successfully.")}

@app.get("/convert/width/{width}")
def convert_width(request: Request, width: float, unit: str):
    """
    Convert width to Škoda Fabia 1.2 HTP units.
    - **width**: The width to convert.
    - **unit**: The unit of the width (e.g., m, cm, mm, in, ft, yd, mi).
    """
    _ = request.state._
    return {"fabia_units": convert_width_to_fabia_units(width, unit), "message": _("Width converted successfully.")}

@app.get("/convert/height/{height}")
def convert_height(request: Request, height: float, unit: str):
    """
    Convert height to Škoda Fabia 1.2 HTP units.
    - **height**: The height to convert.
    - **unit**: The unit of the height (e.g., m, cm, mm, in, ft, yd, mi).
    """
    _ = request.state._
    return {"fabia_units": convert_height_to_fabia_units(height, unit), "message": _("Height converted successfully.")}

@app.get("/convert/area/{area}")
def convert_area(request: Request, area: float, unit: str, scenario: str = Query("packed", enum=["packed", "parking_lot"])):
    """
    Convert area to Škoda Fabia 1.2 HTP units.
    - **area**: The area to convert.
    - **unit**: The unit of the area.
    - **scenario**: The scenario for the conversion (packed or parking_lot).
    """
    _ = request.state._
    return {"fabia_units": convert_area_to_fabia_units(area, unit, scenario), "message": _("Area converted successfully.")}

@app.get("/convert/power/{power}")
def convert_power(request: Request, power: float, unit: str):
    """
    Convert power to Škoda Fabia 1.2 HTP units.
    - **power**: The power to convert.
    - **unit**: The unit of the power.
    """
    _ = request.state._
    return {"fabia_units": convert_power_to_fabia_units(power, unit), "message": _("Power converted successfully.")}

# Serve the index.html file
@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/embed", response_class=HTMLResponse)
def generate(request: Request, value: float, conversion_type: str, unit: str, scenario: str = None, lng: str = 'en', explanation: str = 'scientific'):
    """
    Creates embed HTML code for further use.
    - **value**: The value to convert.
    - **conversion_type**: The type of conversion (e.g., area, power).
    - **unit**: The unit of the value.
    - **scenario**: The scenario for the conversion (optional).
    - **lng**: The language for the translation.
    - **explanation**: The explanation style (scientific or funny).
    """
    try:
        # Set the language for translation
        translations = load_translations(lng)

        # Construct the conversion URL
        if conversion_type == "area" and scenario:
            url = f"http://127.0.0.1:8000/convert/{conversion_type}/{value}?unit={unit}&scenario={scenario}&lng={lng}"
        else:
            url = f"http://127.0.0.1:8000/convert/{conversion_type}/{value}?unit={unit}&lng={lng}"

        # Perform the conversion
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        result = response.json()
        fabia_units = result.get("fabia_units", 0)

        # Generate the HTML content
        message = translations["conversion_result"][explanation].format(
            value=value,
            unit=unit,
            result=fabia_units,
            scenario=translations["scenarios"].get(scenario, "") if scenario else ""
        )
        html_content = f"<p>{message}</p>"
        
        return HTMLResponse(content=html_content)
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"RequestException: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Exception: {str(e)}")

# Run the application
# Command: uvicorn main:app --reload