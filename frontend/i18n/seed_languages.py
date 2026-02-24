import json
import os

languages = [
    ('mr', 'Marathi'), ('te', 'Telugu'), ('ta', 'Tamil'), ('gu', 'Gujarati'), ('kn', 'Kannada'), 
    ('ml', 'Malayalam'), ('or', 'Odia'), ('pa', 'Punjabi'), ('as', 'Assamese'), ('ur', 'Urdu'), 
    ('sa', 'Sanskrit'), ('es', 'Spanish'), ('fr', 'French'), ('de', 'German'), ('zh', 'Chinese'), 
    ('ar', 'Arabic'), ('pt', 'Portuguese'), ('ru', 'Russian'), ('ja', 'Japanese'), ('ko', 'Korean'), 
    ('it', 'Italian'), ('tr', 'Turkish'), ('vi', 'Vietnamese'), ('pl', 'Polish'), ('nl', 'Dutch'), 
    ('th', 'Thai'), ('id', 'Indonesian'), ('fa', 'Persian'), ('el', 'Greek'), ('he', 'Hebrew'), 
    ('sv', 'Swedish'), ('no', 'Norwegian'), ('da', 'Danish'), ('fi', 'Finnish'), ('ro', 'Romanian'), 
    ('hu', 'Hungarian'), ('cs', 'Czech'), ('sk', 'Slovak'), ('uk', 'Ukrainian'), ('bg', 'Bulgarian'), 
    ('hr', 'Croatian'), ('sr', 'Serbian'), ('ms', 'Malay'), ('tl', 'Filipino'), ('sw', 'Swahili'), 
    ('am', 'Amharic'), ('zu', 'Zulu'), ('af', 'Afrikaans'), ('ga', 'Irish'), ('ne', 'Nepali'), 
    ('si', 'Sinhala'), ('mai', 'Maithili'), ('sat', 'Santali'), ('ks', 'Kashmiri'), ('gom', 'Konkani'), 
    ('sd', 'Sindhi'), ('doi', 'Dogri'), ('mni', 'Manipuri')
]

i18n_dir = os.path.dirname(os.path.abspath(__file__))
en_path = os.path.join(i18n_dir, 'en.json')

with open(en_path, 'r', encoding='utf-8') as f:
    en_content = json.load(f)

for code, name in languages:
    path = os.path.join(i18n_dir, f'{code}.json')
    if os.path.exists(path):
        continue
    
    # Create content based on English as placeholder
    # In a real scenario, we would use a translation API here
    # For this task, we'll create the files so the system doesn't crash
    content = en_content.copy()
    
    # Update language list in each file
    content['languages'] = en_content['languages'].copy()
    content['languages'][code] = name
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=4)

print(f"Successfully created {len(languages)} language files as placeholders/templates.")
