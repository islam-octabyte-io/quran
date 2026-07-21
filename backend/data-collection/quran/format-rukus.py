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
ruku_count_in_sura = {}

ruku_list = list(root.find('rukus').findall('ruku'))

for i, ruku in enumerate(ruku_list):
    index = int(ruku.get('index'))
    sura = int(ruku.get('sura'))
    aya = int(ruku.get('aya'))
    
    # Calculate start_aya
    start_aya = previous_end_aya + 1
    
    # Determine the end_aya based on the next ruku's start point
    if i < len(ruku_list) - 1:
        next_ruku = ruku_list[i + 1]
        next_sura = int(next_ruku.get('sura'))
        next_aya = int(next_ruku.get('aya'))
        # Calculate end_aya for the current ruku
        end_aya = calculate_aya_index(next_sura, next_aya - 1)
        
        # Calculate total_ayas
        if sura == next_sura:
            total_ayas = next_aya - aya
        else:
            total_ayas = suras[sura] - aya + 1
    else:
        # If it's the last ruku, calculate until the end of the Quran
        end_aya = calculate_aya_index(sura, suras[sura])
        total_ayas = suras[sura] - aya + 1

    if index == 556:
        end_aya = 6236

    # Update ruku count within the sura
    if sura not in ruku_count_in_sura:
        ruku_count_in_sura[sura] = 1
    else:
        ruku_count_in_sura[sura] += 1

    number_in_sura = ruku_count_in_sura[sura]

    
    # Append data
    output_data.append({
        'id': f'QJ{index:02}',
        'number': index,
        'number_in_sura': number_in_sura,
        'sura': f"QS{sura:02}",
        'start_aya': f'QA{start_aya:02}',
        'end_aya': f'QA{end_aya:02}',
        'total_ayas': total_ayas
    })
    
    # Update previous_end_aya for next ruku
    previous_end_aya = end_aya

# Write the output to a CSV file
with open('rukus.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['id', 'number', 'number_in_sura', 'sura', 'start_aya', 'end_aya', 'total_ayas']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(output_data)

print("NEXT RUN `python add-juz-in-ruku.py`")
