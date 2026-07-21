import csv

# Function to create hizbs.csv
def create_hizbs_csv(filename='hizbs.csv'):
    hizbs_data = []
    number_in_juz = 1
    juz_count = 1
    for i in range(1, 61):  # Assuming there are 60 hizbs
        id_val = f"QH{i:02d}"
        number = i
        juz = f"QJ{juz_count:02d}"
        
        hizbs_data.append([id_val, number, number_in_juz, juz])
        
        # Update number_in_juz and juz_count
        number_in_juz += 1
        if number_in_juz > 2:
            number_in_juz = 1
            juz_count += 1

    # Write to CSV
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'number', 'number_in_juz', 'juz'])  # Header
        writer.writerows(hizbs_data)

# Create the hizbs.csv
create_hizbs_csv()

# File created successfully
"hizbs.csv created"
