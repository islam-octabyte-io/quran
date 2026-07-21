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

rub_list = list(root.find('hizbs').findall('quarter'))

# Initialize counters for number_in_juz, number_in_hizb, and hizb
number_in_juz = 1
number_in_hizb = 1
hizb_count = 1

for i, rub in enumerate(rub_list):
    index = int(rub.get('index'))
    sura = int(rub.get('sura'))
    aya = int(rub.get('aya'))
    
    # Calculate start_aya
    start_aya = previous_end_aya + 1
    
    # Determine the end_aya based on the next rub's start point
    if i < len(rub_list) - 1:
        next_rub = rub_list[i + 1]
        next_sura = int(next_rub.get('sura'))
        next_aya = int(next_rub.get('aya'))
        # Calculate end_aya for the current rub
        end_aya = calculate_aya_index(next_sura, next_aya - 1)
    else:
        # If it's the last rub, calculate until the end of the Quran
        end_aya = calculate_aya_index(sura, suras[sura])

    if index == 240:
        end_aya = 6236

    # Define hizb value
    hizb = f'QH{hizb_count:02}'

    # Append data
    output_data.append({
        'id': f'QR{index:02}',
        'number': index,
        'start_aya': f'QA{start_aya:02}',
        'end_aya': f'QA{end_aya:02}',
        'number_in_juz': number_in_juz,
        'number_in_hizb': number_in_hizb,
        'hizb': hizb
    })
    
    # Update previous_end_aya for next rub
    previous_end_aya = end_aya

    # Update counters for number_in_juz and number_in_hizb
    number_in_juz += 1
    if number_in_juz > 8:
        number_in_juz = 1
    
    number_in_hizb += 1
    if number_in_hizb > 4:
        number_in_hizb = 1
        hizb_count += 1

# Write the output to a CSV file
with open('rubs.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['id', 'number', 'start_aya', 'end_aya', 'number_in_juz', 'number_in_hizb', 'hizb']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(output_data)

print("rubs.csv file created with additional columns")
