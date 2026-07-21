import csv

# Read the Juzs data into a list of dictionaries
juzs = []
with open('juzs.csv', mode='r') as juzs_file:
    juzs_reader = csv.DictReader(juzs_file)
    for row in juzs_reader:
        juzs.append(row)

# Read the Rukus data into a list of dictionaries
rukus = []
with open('rukus.csv', mode='r') as rukus_file:
    rukus_reader = csv.DictReader(rukus_file)
    for row in rukus_reader:
        rukus.append(row)

special_ruku = True

# Add number_in_juz and juz_id to each ruku
for juz in juzs:
    count = 1
    start_aya_juz = int(juz['start_aya'][2:])  # Extract the number part of QAxx
    end_aya_juz = int(juz['end_aya'][2:])      # Extract the number part of QAxx
    for ruku in rukus:
        end_aya_ruku = int(ruku['end_aya'][2:])  # Extract the number part of QAxx
        if start_aya_juz <= end_aya_ruku <= end_aya_juz:
            ruku['juz'] = juz['id']
            
            # Special case for the first two Rukus in Juz 1
            if juz['id'] == 'QJ01' and count == 2 and special_ruku:
                ruku['number_in_juz'] = 1
                special_ruku = False
            else:
                ruku['number_in_juz'] = count
                count += 1

# Write the updated Rukus data to a new CSV file
with open('rukus.csv', mode='w', newline='') as updated_rukus_file:
    fieldnames = ['id', 'number', 'number_in_sura', 'sura', 'start_aya', 'end_aya', 'total_ayas', 'juz', 'number_in_juz']
    writer = csv.DictWriter(updated_rukus_file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rukus)

print("Rukus CSV updated successfully with juz_id and number_in_juz.")
