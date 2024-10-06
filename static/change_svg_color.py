import xml.etree.ElementTree as ET

# Define the Škoda green color
skoda_green = "#4BA82E"

# Read the SVG file
tree = ET.parse('skoda.svg')
root = tree.getroot()

# Namespace dictionary to handle SVG namespace
namespaces = {'svg': 'http://www.w3.org/2000/svg'}

# Find all path elements and change their color
for path in root.findall('.//svg:path', namespaces):
    style = path.get('style')
    if style:
        # Modify the style attribute if it exists
        style = style.replace('black', skoda_green)
        path.set('style', style)
    else:
        # Otherwise, set the fill attribute directly
        path.set('fill', skoda_green)

# Write the modified SVG to a new file
tree.write('skoda_green.svg')