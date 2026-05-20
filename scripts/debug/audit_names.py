import csv

def audit_names():
    file_path = '../lbs_cutoffs_final_clean.csv'
    code_names = {}
    inconsistencies = []
    
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                code = row['college_code']
                name = row['college']
                if code in code_names:
                    if code_names[code] != name:
                        inconsistencies.append((code, code_names[code], name))
                else:
                    code_names[code] = name
    except Exception as e:
        print(f"Error: {e}")
        return

    print(f"Unique College Codes: {len(code_names)}")
    print(f"Naming Inconsistencies Found: {len(inconsistencies)}")
    if inconsistencies:
        print("\nExamples:")
        for inc in inconsistencies[:3]:
            print(f"  {inc[0]}: '{inc[1]}' vs '{inc[2]}'")

if __name__ == "__main__":
    audit_names()
