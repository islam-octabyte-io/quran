import xml.etree.ElementTree as ET
import csv

# Parse the XML file
tree = ET.parse('quran-text-simple.xml')
root = tree.getroot()

# Define the CSV file name
csv_file = 'ayas.csv'

# Open the CSV file for writing
with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    
    # Write the header row
    csvwriter.writerow(['id', 'sura', 'number_in_sura', 'text'])
    
    # Initialize continuous id counter
    aya_counter = 1
    
    # Iterate through each sura element
    for sura in root.findall('sura'):
        sura_index = sura.get('index')
        sura_id = f"QS{sura_index.zfill(2)}"
        
        # Iterate through each aya element within the sura
        for aya in sura.findall('aya'):
            aya_id = f"QA{str(aya_counter).zfill(2)}"
            number_in_sura = aya.get('index')
            text = aya.get('text')
            
            csvwriter.writerow([aya_id, sura_id, number_in_sura, text])
            
            # Increment the continuous id counter
            aya_counter += 1

print(f"NEXT RUN `python add-sajda-in-aya.py`")
