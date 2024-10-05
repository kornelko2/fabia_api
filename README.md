# Škoda Fabia Unit Converter

This project provides a FastAPI-based backend and a simple user interface for converting various physical units to units representing the mass, length, width, height, area, and power of a Škoda Fabia 1.2 HTP.

## Setup

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd fabia_converter
   ```

2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```sh
   pip install -r requirements.txt
   ```

4. Run the FastAPI application:
   ```sh
   uvicorn main:app --reload
   ```

## Endpoints

### Convert Mass
Convert mass to Škoda Fabia 1.2 HTP units.
- **Endpoint**: `/convert/mass/{mass}`
- **Method**: `GET`
- **Parameters**:
  - `mass` (float, path): The mass to convert (default example: 400).
  - `unit` (str, query): The unit of the mass (default: kg).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/convert/mass/400?unit=kg' -H 'accept: application/json'
  ```

### Convert Length
Convert length to Škoda Fabia 1.2 HTP units.
- **Endpoint**: `/convert/length/{length}`
- **Method**: `GET`
- **Parameters**:
  - `length` (float, path): The length to convert.
  - `unit` (str, query): The unit of the length (default: m).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/convert/length/100?unit=m' -H 'accept: application/json'
  ```

### Convert Width
Convert width to Škoda Fabia 1.2 HTP units.
- **Endpoint**: `/convert/width/{width}`
- **Method**: `GET`
- **Parameters**:
  - `width` (float, path): The width to convert.
  - `unit` (str, query): The unit of the width (default: m).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/convert/width/50?unit=m' -H 'accept: application/json'
  ```

### Convert Height
Convert height to Škoda Fabia 1.2 HTP units.
- **Endpoint**: `/convert/height/{height}`
- **Method**: `GET`
- **Parameters**:
  - `height` (float, path): The height to convert.
  - `unit` (str, query): The unit of the height (default: m).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/convert/height/10?unit=m' -H 'accept: application/json'
  ```

### Convert Area
Convert area to Škoda Fabia 1.2 HTP units.
- **Endpoint**: `/convert/area/{area}`
- **Method**: `GET`
- **Parameters**:
  - `area` (float, path): The area to convert.
  - `unit` (str, query): The unit of the area (default: m2).
  - `scenario` (str, query): The scenario for the conversion (default: packed, options: packed, parking_lot).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/convert/area/10000?unit=m2&scenario=packed' -H 'accept: application/json'
  ```

### Convert Power
Convert power to Škoda Fabia 1.2 HTP units.
- **Endpoint**: `/convert/power/{power}`
- **Method**: `GET`
- **Parameters**:
  - `power` (float, path): The power to convert.
  - `unit` (str, query): The unit of the power (default: kW).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/convert/power/55?unit=kW' -H 'accept: application/json'
  ```

### Generate Conversion Result
Generate the conversion result as an HTML response.
- **Endpoint**: `/generate`
- **Method**: `GET`
- **Parameters**:
  - `value` (float, query): The value to convert.
  - `conversion_type` (str, query): The type of conversion (e.g., area, power).
  - `unit` (str, query): The unit of the value.
  - `scenario` (str, query, optional): The scenario for the conversion (optional).
- **Example**:
  ```sh
  curl -X 'GET' 'http://127.0.0.1:8000/generate?value=10000&conversion_type=area&unit=m2&scenario=packed' -H 'accept: text/html'
  ```

## Interactive API Documentation

FastAPI provides interactive API documentation using Swagger UI and ReDoc.

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## License

This project is licensed under the MIT License.
