import csv
import xml.etree.ElementTree as ET

# Load the Quran metadata from the XML file
tree = ET.parse('quran-metadata.xml')
root = tree.getroot()

# Parse the sajda data from the XML
sajdas = {}
for sajda in root.find("sajdas").findall('sajda'):
    sura = int(sajda.attrib['sura'])
    aya = int(sajda.attrib['aya'])
    sajda_type = sajda.attrib['type']
    # Convert sura to the QS format (e.g., QS01 for sura 1)
    sura_str = f"QS{sura:02d}"
    sajdas[(sura_str, aya)] = sajda_type


# Read the ayas.csv and update it
ayas = []
with open('ayas.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    fieldnames = reader.fieldnames + ['sajda']  # Add new column for sajda
    for row in reader:
        sura = row['sura']
        aya_number = int(row['number_in_sura'])
        # Check if this aya has a sajda
        sajda_type = sajdas.get((sura, aya_number), "")
        row['sajda'] = sajda_type  # Add the sajda value (empty if not found)
        ayas.append(row)

# Write the updated data back to ayas.csv
with open('ayas.csv', 'w', encoding='utf-8', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(ayas)

print("Sajdas added in ayas")
