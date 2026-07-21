import xml.etree.ElementTree as ET
import csv

# Parse the XML file
tree = ET.parse('quran-metadata.xml')
root = tree.getroot()

# Define the CSV file name
csv_file = 'suras.csv'

# Open the CSV file for writing
with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    
    # Write the header row
    csvwriter.writerow(['id', 'number', 'name', 'en_name', 'type', 'revelation_order', 'total_ayas', 'total_rukus'])
    
    # Iterate through each sura element and write to CSV
    for sura in root.find('suras'):
        sura_id = f"QS{sura.get('index').zfill(2)}"
        number = sura.get('index')
        name = sura.get('name')
        en_name = sura.get('tname')
        sura_type = sura.get('type')
        revelation_order = sura.get('order')
        total_ayas = sura.get('ayas')
        total_rukus = sura.get('rukus')
        
        csvwriter.writerow([sura_id, number, name, en_name, sura_type, revelation_order, total_ayas, total_rukus])

print(f"Data successfully written to {csv_file}")
