import xml.etree.ElementTree as ET
import csv

# Parse the XML file
tree = ET.parse('quran-metadata.xml')
root = tree.getroot()

# Define the CSV file name
csv_file = 'manzils.csv'

# Extract all manzils
manzils = root.find('manzils')

# Open the CSV file for writing
with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    
    # Write the header row
    csvwriter.writerow(['id', 'number', 'start_sura', 'end_sura'])
    
    # Iterate through each manzil element and write to CSV
    for i, manzil in enumerate(manzils):
        manzil_id = f"QM{manzil.get('index').zfill(2)}"
        number = manzil.get('index')
        start_sura = f"QS{manzil.get('sura').zfill(2)}"
        
        # Determine the end_sura
        if i < len(manzils) - 1:
            next_sura = int(manzils[i + 1].get('sura')) - 1
            end_sura = f"QS{str(next_sura).zfill(2)}"
        else:
            end_sura = "QS114"  # Last sura if it's the last manzil
            
        csvwriter.writerow([manzil_id, number, start_sura, end_sura])

print(f"Data successfully written to {csv_file}")
