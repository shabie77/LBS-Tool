import csv

def debug_aun():
    file_path = '../lbs_cutoffs_final_clean.csv'
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['college_code'] == 'AUN' and 'SM' in row['quota']:
                    print(f"DEBUG: {row}")
                    # Check casing and spaces
                    print(f"  quota value: '{row['quota']}'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_aun()
