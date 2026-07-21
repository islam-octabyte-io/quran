import xml.etree.ElementTree as ET
import csv

# Load the XML file
tree = ET.parse('quran-metadata.xml')  # replace with your actual XML file path
root = tree.getroot()

# Load the suras.csv data
suras = {}
with open('suras.csv', 'r', encoding='utf-8') as suras_file:
    reader = csv.DictReader(suras_file)
    for row in reader:
        suras[int(row['number'])] = int(row['total_ayas'])

# Helper function to calculate aya index
def calculate_aya_index(sura, aya):
    previous_ayas = sum(suras[i] for i in range(1, sura))
    return previous_ayas + aya

# Prepare the CSV output
output_data = []
previous_end_aya = 0

juz_list = list(root.find('juzs').findall('juz'))

for i, juz in enumerate(juz_list):
    index = int(juz.get('index'))
    sura = int(juz.get('sura'))
    aya = int(juz.get('aya'))
    
    # Calculate start_aya
    start_aya = previous_end_aya + 1
    
    # Determine the end_aya based on the next Juz's start point
    if i < len(juz_list) - 1:
        next_juz = juz_list[i + 1]
        next_sura = int(next_juz.get('sura'))
        next_aya = int(next_juz.get('aya'))
        # Calculate end_aya for the current Juz
        end_aya = calculate_aya_index(next_sura, next_aya - 1)
    else:
        # If it's the last Juz, calculate until the end of the Quran
        end_aya = calculate_aya_index(sura, suras[sura])

    if index == 30:
        end_aya = 6236
    
    # Append data
    output_data.append({
        'id': f'QJ{index:02}',
        'number': index,
        'start_aya': f'QA{start_aya:02}',
        'end_aya': f'QA{end_aya:02}'
    })
    
    # Update previous_end_aya for next Juz
    previous_end_aya = end_aya

# Write the output to a CSV file
with open('juzs.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['id', 'number', 'start_aya', 'end_aya']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(output_data)

print("Conversion completed successfully!")
