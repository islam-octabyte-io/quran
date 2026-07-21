import csv
import argparse
import os

# Function to parse command-line arguments
def parse_args():
    parser = argparse.ArgumentParser(description='Convert text file to CSV format.')
    parser.add_argument('input_file', type=str, help='Path to the input text file')
    parser.add_argument('quran_ayas_languages_code', type=str, help='Code for the Quran ayas language')
    return parser.parse_args()

# Function to generate the formatted IDs
def format_id(counter, prefix):
    return f"{prefix}{counter:02d}"

# Main conversion function
def convert_file(input_file, quran_ayas_languages_code):
    # Generate the output file name by changing the input file's extension to '.csv'
    output_file = f"{os.path.splitext(input_file)[0]}.csv"
    
    id_counter = 1

    # Read input file and write to CSV
    with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        csv_writer = csv.writer(outfile)
        
        # Write the CSV header
        csv_writer.writerow(['id', 'quran_ayas_id', 'quran_ayas_languages_code', 'number', 'text'])
        
        # Loop through each line in the input file
        for line in infile:
            line = line.strip()
            
            # Skip empty lines and metadata section
            if not line or line.startswith('#'):
                continue
            
            # Split the line by "|" to get the sura and aya info along with the text
            parts = line.split('|')
            
            if len(parts) == 3:
                sura, aya, text = parts
                
                # Generate the IDs
                id_value = format_id(id_counter, quran_ayas_languages_code)
                quran_ayas_id = format_id(id_counter, 'QA')
                
                # Write the row to the CSV file
                csv_writer.writerow([id_value, quran_ayas_id, quran_ayas_languages_code, id_counter, text])
                
                # Increment counters
                id_counter += 1

    print(f"Conversion completed! The output file '{output_file}' has been created.")

if __name__ == '__main__':
    args = parse_args()
    convert_file(args.input_file, args.quran_ayas_languages_code)


# Usage
# python script.py file_name.txt language_code