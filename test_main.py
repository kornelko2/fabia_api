import pytest
from fastapi.testclient import TestClient
from main import app, SKODA_FABIA_AREA_M2, SKODA_FABIA_POWER_KW

client = TestClient(app)

def test_convert_mass():
    response = client.get("/convert/mass/2110?unit=kg")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_mass_tons():
    response = client.get("/convert/mass/2.11?unit=t")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_length():
    response = client.get("/convert/length/7.92?unit=m")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_length_cm():
    response = client.get("/convert/length/792?unit=cm")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_width():
    response = client.get("/convert/width/3.3?unit=m")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_width_ft():
    response = client.get("/convert/width/10.83?unit=ft")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_height():
    response = client.get("/convert/height/2.996?unit=m")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_height_in():
    response = client.get("/convert/height/118.11?unit=in")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_area_packed():
    response = client.get("/convert/area/13.108064?unit=m2&scenario=packed")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_area_parking_lot():
    response = client.get("/convert/area/10000?unit=m2&scenario=parking_lot")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(800.0, rel=1e-2)

def test_convert_area_ha():
    response = client.get("/convert/area/1?unit=ha&scenario=packed")
    assert response.status_code == 200
    expected_value = 10000 / SKODA_FABIA_AREA_M2
    assert response.json()["fabia_units"] == pytest.approx(expected_value, rel=1e-2)

def test_convert_power():
    response = client.get("/convert/power/94?unit=kW")
    assert response.status_code == 200
    assert response.json()["fabia_units"] == pytest.approx(2.0, rel=1e-2)

def test_convert_power_hp():
    response = client.get("/convert/power/125.98?unit=hp")
    assert response.status_code == 200
    expected_value = 125.98 * 0.7457 / SKODA_FABIA_POWER_KW
    assert response.json()["fabia_units"] == pytest.approx(expected_value, rel=1e-2)