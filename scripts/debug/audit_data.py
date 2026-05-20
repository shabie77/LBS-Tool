import csv

def audit():
    file_path = '../lbs_cutoffs_final_clean.csv'
    rows = []
    
    print("--- DETAILED NULL AUDIT START ---")
    
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)
    except Exception as e:
        print(f"Error: {e}")
        return

    null_c2025 = 0
    null_s2025 = 0
    null_seats = 0
    null_c2024 = 0
    
    for row in rows:
        if not row['cutoff_2025']: null_c2025 += 1
        if not row['safe_cutoff_2025']: null_s2025 += 1
        if not row['total_seats']: null_seats += 1
        if not row['cutoff_2024']: null_c2024 += 1

    print(f"Total Rows: {len(rows)}")
    print(f"Missing cutoff_2025: {null_c2025}")
    print(f"Missing safe_cutoff_2025: {null_s2025}")
    print(f"Missing total_seats: {null_seats}")
    print(f"Missing cutoff_2024: {null_c2024}")
    
    if null_c2025 > 0:
        print("\nExample of missing cutoff_2025:")
        for row in rows:
            if not row['cutoff_2025']:
                print(f"  {row['college_code']} - {row['quota']}")
                break

    print("\n--- AUDIT END ---")

if __name__ == "__main__":
    audit()
