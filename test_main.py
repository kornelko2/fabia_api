import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, mock_open

import requests
from main import app, SKODA_FABIA_AREA_M2, SKODA_FABIA_POWER_KW, load_translations

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
    
def test_load_translations_en():
    mock_translation = '{"title": "Škoda Fabia 1.2 HTP Unit Converter"}'
    with patch("builtins.open", mock_open(read_data=mock_translation)):
        translations = load_translations("en")
        assert translations["title"] == "Škoda Fabia 1.2 HTP Unit Converter"

def test_load_translations_de():
    mock_translation_de = '{"title": "Škoda Fabia 1.2 HTP Einheitenumrechner"}'
    with patch("builtins.open", mock_open(read_data=mock_translation_de)):
        translations = load_translations("de")
        assert translations["title"] == "Škoda Fabia 1.2 HTP Einheitenumrechner"

def test_load_translations_fallback():
    mock_translation_en = '{"title": "Škoda Fabia 1.2 HTP Unit Converter"}'
    with patch("builtins.open", mock_open(read_data=mock_translation_en)) as mock_file:
        mock_file.side_effect = [FileNotFoundError(), mock_file.return_value]
        translations = load_translations("de")
        assert translations["title"] == "Škoda Fabia 1.2 HTP Unit Converter"
        assert mock_file.call_count == 2
        
def test_embed_area_conversion():
    url = "http://127.0.0.1:8000/embed?value=10000&conversion_type=area&unit=m2&scenario=parking_lot&lng=de&explanation=funny"
    response = client.get(url)
    assert response.status_code == 200
    assert "<p>Wow! 10000.0 m2 ist wie 800.0 Škoda Fabia 1.2 HTPs im Parkplatz Szenario!</p>" in response.text
    
def test_embed_area_conversion_cs():
    url = "http://127.0.0.1:8000/embed?value=10000&conversion_type=area&unit=m2&scenario=parking_lot&lng=cs&explanation=funny"
    response = client.get(url)
    assert response.status_code == 200
    assert "<p>Wow! 10000.0 m2 je jako 800.0 Škoda Fabia 1.2 HTP ve scénáři parkoviště!</p>" in response.text
    