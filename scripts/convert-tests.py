#!/usr/bin/env python3
"""
Convert IELTS listening test markdown files from the GitHub repo
into JS TEST_DATA and test-answers files for the website.

Usage: python3 scripts/convert-tests.py /tmp/ieltslistening
"""

import json
import os
import re
import sys
import shutil

REPO_DIR = sys.argv[1] if len(sys.argv) > 1 else '/tmp/ieltslistening'
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_DIR = os.path.join(PROJECT_DIR, 'js')
AUDIO_DIR = os.path.join(PROJECT_DIR, 'audio')
PAGES_DIR = os.path.join(PROJECT_DIR, 'pages')


def load_master_index():
    with open(os.path.join(REPO_DIR, 'IELTS_2026_MASTER_INDEX.json')) as f:
        return json.load(f)


def read_md(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def split_into_parts(md_text):
    """Split markdown into Part 1-4 sections and answer key."""
    # Remove transcript section
    for marker in ['## LISTENING SCRIPT', '## TRANSCRIPT', '## Listening Script',
                    '## listening script', '## Audio Transcript']:
        idx = md_text.find(marker)
        if idx > 0:
            md_text = md_text[:idx]
            break

    # Split answer key
    answer_text = ''
    for marker in ['## ANSWER KEY', '## Answer Key', '## ANSWERS', '## Answers']:
        idx = md_text.find(marker)
        if idx > 0:
            answer_text = md_text[idx:]
            md_text = md_text[:idx]
            break

    # Split into parts
    parts = {}
    part_pattern = re.compile(r'^##\s+PART\s+(\d+)', re.MULTILINE | re.IGNORECASE)
    matches = list(part_pattern.finditer(md_text))

    for i, m in enumerate(matches):
        part_num = int(m.group(1))
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(md_text)
        parts[part_num] = md_text[start:end].strip()

    return parts, answer_text


def parse_answers(answer_text):
    """Parse answer key section into {question_number: answer} dict."""
    answers = {}
    if not answer_text:
        return answers

    lines = answer_text.split('\n')
    for line in lines:
        line = line.strip()

        # Table format: | 1 | dishwasher | or | 1 | **dishwasher** |
        tm = re.match(r'^\|\s*(\d+)\s*\|\s*\*?\*?(.+?)\*?\*?\s*\|?\s*$', line)
        if tm:
            qnum = int(tm.group(1))
            ans = tm.group(2).strip().strip('*').strip()
            if ans and ans.lower() not in ('answer', 'answers', '---', 'question', 'details'):
                answers[qnum] = ans
            continue

        # Standard format: 1. **B** or 1. **answer** or 1. answer
        m = re.match(r'^(\d+)\.\s+\*\*(.+?)\*\*', line)
        if not m:
            m = re.match(r'^(\d+)\.\s+(.+?)(?:\s*$|\s*[\(\[—–-])', line)
        if not m:
            m = re.match(r'^(\d+)\.\s+(.+)', line)
        if m:
            qnum = int(m.group(1))
            ans = m.group(2).strip()
            ans = re.sub(r'\s*\(.*?\)\s*$', '', ans)  # remove trailing (notes)
            ans = ans.strip('* ')
            if ans:
                answers[qnum] = ans

    return answers


# ---- Blank normalization ----
def normalize_blanks(text):
    """Convert all blank representations to [N] format."""
    # Pattern: ___(N)___ or ____(N)____ (underscores wrapping parenthetical number)
    text = re.sub(r'_+\((\d+)\)_+', r'[\1] ........................', text)

    # Pattern: **(N)** ___ or **(N).** ___
    text = re.sub(r'\*\*\((\d+)\)\.?\*\*\s*_+', r'[\1] ........................', text)
    text = re.sub(r'\*\*(\d+)\.\*\*\s*_+', r'[\1] ........................', text)
    text = re.sub(r'\*\*(\d+)\.\*\*\s*\$_+', r'$[\1] ........................', text)
    text = re.sub(r'\*\*(\d+)\.\*\*\s*£_+', r'£[\1] ........................', text)

    # Pattern: (N) ___ with possible currency prefix
    text = re.sub(r'\((\d+)\)\s*\$_+', r'$[\1] ........................', text)
    text = re.sub(r'\((\d+)\)\s*£_+', r'£[\1] ........................', text)
    text = re.sub(r'\((\d+)\)\s*_+', r'[\1] ........................', text)

    # Pattern: N. ___ (plain number with period and underscores, in table cells or bullet points)
    # Be careful not to match things like "1. Some text" (no underscores)
    text = re.sub(r'(?<!\w)(\d+)\.\s*\$_+', r'$[\1] ........................', text)
    text = re.sub(r'(?<!\w)(\d+)\.\s*£_+', r'£[\1] ........................', text)
    text = re.sub(r'(?<!\w)(\d+)\.\s*_{3,}', r'[\1] ........................', text)

    # Pattern: N ___ (number followed by underscores, no period, in table context)
    # Only match when there's at least 3 underscores
    text = re.sub(r'(?<!\w)(\d+)\s+_{3,}', r'[\1] ........................', text)

    # Pattern: Lines starting with "N. text ___ text" where blank is mid-sentence
    # e.g. "8. The guest wants ___ included in the booking."
    # Convert the ___ to [N] using the line's leading number
    def replace_mid_sentence_blank(match):
        num = match.group(1)
        before = match.group(2)
        after = match.group(3)
        return f'{num}. {before}[{num}] ........................{after}'

    text = re.sub(
        r'^(\d+)\.\s+(.*?)_{3,}(.*?)$',
        replace_mid_sentence_blank,
        text,
        flags=re.MULTILINE
    )

    return text


# ---- Question type detection ----
def is_multiple_choice(text):
    """Check if a question group contains multiple choice options."""
    # Look for patterns like "- A.", "- A)", "A.", "A)" as option markers
    mc_pattern = re.compile(r'^\s*-?\s*[A-E][\.\)]\s', re.MULTILINE)
    matches = mc_pattern.findall(text)
    return len(matches) >= 2  # At least 2 options present


def is_matching_question(text):
    """Check if this is a matching question type."""
    text_lower = text.lower()
    return ('write the correct letter' in text_lower or
            'match the' in text_lower or
            ('who' in text_lower and ('correct letter' in text_lower or 'a, b' in text_lower)))


# ---- Multiple choice parser ----
def parse_mc_questions(text, q_type='radio'):
    """Parse multiple choice questions with proper option separation."""
    questions = []

    # Split into individual questions by looking for numbered question starts
    # Handle: **N.** text, **N** text, N. text
    q_pattern = re.compile(
        r'(?:^|\n)\s*(?:\*\*)?(\d+)(?:\.?\*\*|\.)?\s+(.*?)(?=\n\s*(?:\*\*)?(?:\d+)(?:\.?\*\*|\.)?\s|\Z)',
        re.DOTALL
    )

    # Alternative: try splitting by bold numbered markers
    blocks = re.split(r'\n(?=\s*\*\*\d+[\.\)]\*\*\s)', text)
    if len(blocks) <= 1:
        blocks = re.split(r'\n(?=\s*\*\*\d+\*\*[\.\s])', text)
    if len(blocks) <= 1:
        blocks = re.split(r'\n(?=\d+\.\s+[A-Z])', text)

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        # Extract question number and text
        qm = re.match(r'\*\*(\d+)[\.\)]*\*\*\.?\s*(.*)', block, re.DOTALL)
        if not qm:
            qm = re.match(r'(\d+)\.\s+(.*)', block, re.DOTALL)
        if not qm:
            continue

        qnum = int(qm.group(1))
        rest = qm.group(2).strip()

        # Split question text from options
        # Options start with - A. or A. at line beginning
        option_start = re.search(r'\n\s*-?\s*A[\.\)]', rest)
        if option_start:
            q_text = rest[:option_start.start()].strip()
            options_text = rest[option_start.start():]
        else:
            # Options might be inline
            q_text = rest.split('\n')[0].strip()
            options_text = '\n'.join(rest.split('\n')[1:])

        # Parse options: handle "- A. text", "- A) text", "A. text", "  A. text"
        options = []
        opt_matches = re.finditer(
            r'(?:^|\n)\s*-?\s*([A-H])[\.\)]\s*(.+?)(?=\n\s*-?\s*[A-H][\.\)]|\Z)',
            options_text,
            re.DOTALL
        )
        for om in opt_matches:
            opt_val = om.group(1)
            opt_text = om.group(2).strip().rstrip('\n').strip()
            # Clean up markdown formatting
            opt_text = re.sub(r'\*\*(.+?)\*\*', r'\1', opt_text)
            opt_text = opt_text.strip()
            if opt_text:
                options.append({'value': opt_val, 'text': opt_text})

        if len(options) >= 2:
            questions.append({
                'id': qnum,
                'text': q_text,
                'type': q_type,
                'options': options
            })

    return questions


# ---- Fill-in parser ----
def parse_fill_section(text, part_num):
    """Parse fill-in-the-blank content from a question group."""
    # First normalize all blank patterns
    normalized = normalize_blanks(text)

    items = []
    lines = normalized.split('\n')

    # Track if we're in a table
    in_table = False
    table_lines = []

    for line in lines:
        stripped = line.strip()

        # Skip headers, empty lines, horizontal rules
        if not stripped or stripped.startswith('#') or stripped == '---':
            if in_table and table_lines:
                items.extend(process_table_lines(table_lines))
                table_lines = []
                in_table = False
            continue

        # Skip instruction-only lines (no blanks)
        if stripped.startswith('*') and stripped.endswith('*') and '[' not in stripped:
            continue
        if re.match(r'^\*\*(Complete|Write|Choose|Label|Match)', stripped) and '[' not in stripped:
            continue
        if re.match(r'^(Complete|Write|Choose|Label|Match)', stripped) and '[' not in stripped:
            continue

        # Handle table rows
        if '|' in stripped and stripped.startswith('|'):
            # Skip table separator rows
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                in_table = True
                continue
            in_table = True
            table_lines.append(stripped)
            continue
        else:
            if in_table and table_lines:
                items.extend(process_table_lines(table_lines))
                table_lines = []
                in_table = False

        # Check if line contains a blank [N]
        if re.search(r'\[\d+\]', stripped):
            # Clean up markdown formatting
            cleaned = clean_md(stripped)
            if cleaned:
                items.append({'text': cleaned})
            continue

        # Check for numbered lines that should have blanks (N. ___ text)
        if re.match(r'^\d+\.\s', stripped) and '___' in stripped:
            cleaned = clean_md(stripped)
            # Try to convert remaining underscores
            cleaned = re.sub(r'_{3,}', '........................', cleaned)
            if cleaned:
                items.append({'text': cleaned})
            continue

        # Include context lines (bold headers, bullet points with content)
        if re.match(r'^\*\*[^*]+\*\*$', stripped):
            # Bold header line
            cleaned = clean_md(stripped)
            items.append({'text': cleaned, 'type': 'header'})
            continue

        # Bullet points or dashes with blanks
        if stripped.startswith('-') or stripped.startswith('•'):
            content = stripped.lstrip('-•').strip()
            if re.search(r'\[\d+\]', content):
                cleaned = clean_md(content)
                items.append({'text': cleaned})

    # Flush remaining table
    if table_lines:
        items.extend(process_table_lines(table_lines))

    return items


def process_table_lines(lines):
    """Convert table rows containing blanks into text items."""
    items = []
    for line in lines:
        # Remove leading/trailing pipes and split cells
        cells = [c.strip() for c in line.strip('|').split('|')]

        # Skip header rows
        if any(c.lower() in ('field', 'feature', 'item', 'details', 'information', '')
               for c in cells if c.strip()):
            # Only skip if no blanks in cells
            if not any(re.search(r'\[\d+\]', c) for c in cells):
                continue

        # Build a readable text from cells that have blanks
        cell_texts = []
        has_blank = False
        for cell in cells:
            cell = cell.strip()
            if not cell:
                continue
            if re.search(r'\[\d+\]', cell):
                has_blank = True
            cell_texts.append(cell)

        if has_blank and cell_texts:
            combined = ' : '.join(cell_texts) if len(cell_texts) > 1 else cell_texts[0]
            combined = clean_md(combined)
            items.append({'text': combined})

    return items


def clean_md(text):
    """Remove markdown formatting from text."""
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)  # bold
    text = re.sub(r'\*(.+?)\*', r'\1', text)  # italic
    text = text.strip()
    return text


# ---- Main section converter ----
def convert_part_to_section(part_text, part_num):
    """Convert a single part's markdown into a TEST_DATA section object."""
    section = {
        'title': f'<strong>Section {part_num}</strong>'
    }

    # Find all question groups within this part
    # Pattern: "### Questions N-M" or "**Questions N-M**" or "### Questions" then "**Questions N-M**"
    group_markers = list(re.finditer(
        r'(?:^|\n)(?:###?\s*)?(?:\*\*)?Questions?\s+(\d+)[\s–\-—to]+(\d+)',
        part_text, re.IGNORECASE
    ))

    if not group_markers:
        # Try a broader pattern: anything with "Questions N-M" or "Questions N – M"
        group_markers = list(re.finditer(
            r'(?:^|\n).*?Questions?\s+(\d+)\s*[-–—to]+\s*(\d+)',
            part_text, re.IGNORECASE
        ))

    if not group_markers:
        # Fallback: treat entire part as one fill-in section
        items = parse_fill_section(part_text, part_num)
        if items:
            content_items = [i for i in items if re.search(r'\[\d+\]', i.get('text', ''))]
            if content_items:
                section['formContent'] = {
                    'title': '',
                    'items': items
                }
        return section

    # Process each question group
    parts_list = []

    for gi, gm in enumerate(group_markers):
        q_start = int(gm.group(1))
        q_end = int(gm.group(2))

        # Extract text for this group (from marker to next marker or end)
        start_pos = gm.start()
        end_pos = group_markers[gi + 1].start() if gi + 1 < len(group_markers) else len(part_text)
        group_text = part_text[start_pos:end_pos].strip()

        # Determine question type
        if is_multiple_choice(group_text) and not is_matching_question(group_text):
            # Detect if "choose two" → checkbox
            group_lower = group_text.lower()
            if 'choose two' in group_lower or 'choose 2' in group_lower:
                q_type = 'checkbox'
            else:
                q_type = 'radio'

            # Extract instruction
            instr = f'<strong>Questions {q_start} – {q_end}</strong>'
            instr_match = re.search(
                r'(Choose.*?(?:letter|letters|answer)[^.]*\.)',
                group_text, re.IGNORECASE
            )
            if instr_match:
                instr += '\n\n' + clean_md(instr_match.group(1).strip())

            questions = parse_mc_questions(group_text, q_type)
            if questions:
                parts_list.append({
                    'title': f'<strong>Questions {q_start} – {q_end}</strong>',
                    'instructions': instr,
                    'questions': questions
                })
            else:
                # MC parsing failed, try as fill-in
                items = parse_fill_section(group_text, part_num)
                if items:
                    parts_list.append(build_fill_part(items, q_start, q_end, group_text))
        else:
            # Fill-in or matching (treat matching as fill-in)
            items = parse_fill_section(group_text, part_num)
            if items:
                parts_list.append(build_fill_part(items, q_start, q_end, group_text))
            else:
                # Even if no items parsed, create a placeholder
                parts_list.append({
                    'title': f'<strong>Questions {q_start} – {q_end}</strong>',
                    'instructions': f'Complete the answers for questions {q_start}-{q_end}.',
                    'formContent': {'title': '', 'items': []}
                })

    # Build section from parts
    if not parts_list:
        return section

    if len(parts_list) == 1:
        p = parts_list[0]
        if p.get('instructions'):
            section['instructions'] = p['instructions']
        if p.get('questions'):
            section['questions'] = p['questions']
        elif p.get('formContent'):
            section['formContent'] = p['formContent']
    else:
        section['parts'] = parts_list

    return section


def build_fill_part(items, q_start, q_end, group_text):
    """Build a part object for fill-in questions."""
    instr = f'<strong>Questions {q_start}-{q_end}</strong>'

    # Extract instruction text
    for pattern in [
        r'(Complete\s+.*?(?:below|form|table|notes|sentences?|summary|plan)[.\s]*)',
        r'(Write\s+.*?(?:answer|each answer)[.\s]*)',
        r'(Label\s+.*?(?:map|plan|diagram)[.\s]*)',
    ]:
        m = re.search(pattern, group_text, re.IGNORECASE)
        if m:
            instr += '\n\n' + clean_md(m.group(1).strip())
            break

    # Separate header items from content items
    content_items = []
    for item in items:
        if item.get('type') == 'header':
            content_items.append(item)
        elif re.search(r'\[\d+\]', item.get('text', '')):
            content_items.append(item)
        # Skip items without blanks and without header type

    return {
        'title': f'<strong>Questions {q_start} – {q_end}</strong>',
        'instructions': instr,
        'formContent': {
            'title': '',
            'items': content_items if content_items else items
        }
    }


def convert_test(test_entry, test_num):
    """Convert a single test from the repo into JS files."""
    test_dir = os.path.join(REPO_DIR, test_entry['dir'])
    md_path = os.path.join(test_dir, 'listening_test.md')

    if not os.path.exists(md_path):
        print(f'  SKIP: {md_path} not found')
        return False

    md_text = read_md(md_path)
    parts, answer_text = split_into_parts(md_text)
    answers = parse_answers(answer_text)

    if not parts or not answers:
        print(f'  WARN: No parts ({len(parts)}) or answers ({len(answers)}) found')
        if not answers:
            return False

    # Build TEST_DATA
    test_data = {}
    for part_num in range(1, 5):
        if part_num in parts:
            test_data[f'section{part_num}'] = convert_part_to_section(parts[part_num], part_num)
        else:
            test_data[f'section{part_num}'] = {
                'title': f'<strong>Section {part_num}</strong>',
                'instructions': f'Questions for Section {part_num}',
                'formContent': {'title': '', 'items': []}
            }

    # Validate: count how many [N] blanks we generated
    data_str = json.dumps(test_data)
    blank_count = len(re.findall(r'\\\[\d+\\\]', data_str))
    mc_count = sum(1 for _ in re.finditer(r'"type":\s*"radio"', data_str))
    mc_count += sum(1 for _ in re.finditer(r'"type":\s*"checkbox"', data_str))

    # Write test-data JS file
    var_name = f'TEST_DATA_{test_num}'
    js_content = f'// Test {test_num} - {test_entry.get("title", "")}\n'
    js_content += f'const {var_name} = {json.dumps(test_data, ensure_ascii=False, indent=4)};\n'

    data_path = os.path.join(JS_DIR, f'test-data-{test_num}.js')
    with open(data_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

    # Write test-answers JS file
    answers_var = f'standardAnswers{test_num}'
    ans_content = f'// Test {test_num} 标准答案\n'
    ans_content += f'const {answers_var} = {{\n'
    for qnum in sorted(answers.keys()):
        ans = answers[qnum]
        ans_content += f'    {qnum}: {json.dumps(ans, ensure_ascii=False)},\n'
    ans_content += '};\n'

    ans_path = os.path.join(JS_DIR, f'test-answers-{test_num}.js')
    with open(ans_path, 'w', encoding='utf-8') as f:
        f.write(ans_content)

    # Copy audio file
    audio_src = None
    for ext in ['m4a', 'mp3']:
        candidate = os.path.join(test_dir, f'listening_audio.{ext}')
        if os.path.exists(candidate):
            audio_src = candidate
            break

    if audio_src:
        audio_dest_dir = os.path.join(AUDIO_DIR, f'test{test_num}')
        os.makedirs(audio_dest_dir, exist_ok=True)
        audio_ext = os.path.splitext(audio_src)[1]
        audio_dest = os.path.join(audio_dest_dir, f'full_test{audio_ext}')
        if not os.path.exists(audio_dest):
            shutil.copy2(audio_src, audio_dest)
            print(f'  Audio: copied {os.path.basename(audio_src)} -> audio/test{test_num}/')

    print(f'  Generated: test-data-{test_num}.js (blanks={blank_count}, mc={mc_count}), '
          f'test-answers-{test_num}.js ({len(answers)} answers)')
    return True


def generate_test_html(test_num, test_entry, audio_ext='.m4a'):
    """Generate an HTML test page for a given test number."""
    audio_dir = os.path.join(AUDIO_DIR, f'test{test_num}')
    if os.path.exists(os.path.join(audio_dir, 'full_test.mp3')):
        audio_ext = '.mp3'

    date_str = test_entry.get('date', '')

    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IELTS Listening Test {test_num}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

    <!-- 关键CSS内联 -->
    <style>
    *{{margin:0;padding:0;box-sizing:border-box}}
    :root{{--primary:#1a56db;--primary-light:#3b82f6;--primary-dark:#1e3a5f;--primary-color:#1a56db;--accent:#f59e0b;--success:#10b981;--surface:#f8fafc;--surface-raised:#ffffff;--background-color:#f8fafc;--text:#0f172a;--text-color:#0f172a;--text-secondary:#64748b;--gray-light:#f1f5f9;--gray-medium:#e2e8f0;--secondary-color:#1e3a5f;--max-width:1200px;--border-radius:8px;--radius-lg:12px;--radius-xl:16px;--font-display:'Space Grotesk',sans-serif;--font-body:'IBM Plex Sans','PingFang SC',-apple-system,sans-serif;--font-mono:'JetBrains Mono',monospace;--box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);--shadow-md:0 4px 12px rgba(15,23,42,0.08)}}
    body{{font-family:var(--font-body);line-height:1.6;color:var(--text);background-color:var(--surface);-webkit-font-smoothing:antialiased}}
    .nav-bar{{background:rgba(30,58,95,0.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:0.875rem 0;position:fixed;width:100%;top:0;z-index:1000;box-shadow:0 1px 3px rgba(0,0,0,0.12);border-bottom:1px solid rgba(59,130,246,0.15)}}
    .nav-container{{max-width:var(--max-width);margin:0 auto;padding:0 1.5rem;display:flex;justify-content:space-between;align-items:center;gap:1rem}}
    .logo{{color:white;font-family:var(--font-display);font-size:1.5rem;font-weight:700;letter-spacing:-0.02em}}
    .logo-img{{height:40px;margin-right:10px;vertical-align:middle}}
    .home-link{{text-decoration:none;color:inherit;display:flex;align-items:center}}
    .nav-menu{{display:flex;list-style:none;gap:2rem}}
    .nav-menu a{{color:rgba(255,255,255,0.85);text-decoration:none;font-weight:500;font-size:0.875rem}}
    main{{margin-top:4rem;padding:2rem 1rem}}
    .test-container{{max-width:860px;margin:2rem auto;padding:0 1rem;font-family:var(--font-body);line-height:1.5}}
    .test-intro{{background:linear-gradient(180deg,rgba(255,255,255,0.98) 0%,rgba(248,250,252,0.98) 100%);padding:1.5rem;border-radius:12px;margin-bottom:2rem;border:1px solid var(--gray-medium);border-left:4px solid var(--primary);box-shadow:var(--box-shadow)}}
    .test-intro h1,.test-intro h2{{font-family:var(--font-display);font-weight:700;letter-spacing:-0.02em;color:var(--text)}}
    .section-tabs{{display:flex;gap:0.5rem;margin:20px 0;border-bottom:none;background:var(--gray-light);padding:4px;border-radius:9999px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}}
    .section-tabs::-webkit-scrollbar{{display:none}}
    .section-tab{{padding:10px 24px;background:transparent;border:none;cursor:pointer;margin-right:0;border-radius:9999px;font-weight:500;color:var(--text-secondary);transition:all .25s ease;white-space:nowrap}}
    .section-tab.active{{background:var(--primary);color:white;font-weight:600;box-shadow:0 2px 8px rgba(26,86,219,0.3)}}
    .audio-player,.custom-player{{background:var(--surface);border-radius:12px;border:1px solid var(--gray-medium);box-shadow:var(--box-shadow)}}
    .play-btn{{background:var(--primary);color:white}}
    .time{{font-family:var(--font-mono);color:var(--text-secondary)}}
    a{{color:var(--primary)}}
    @media(max-width:768px){{.nav-menu{{display:none}}.section-tab{{padding:8px 18px;font-size:14px}}.test-container{{padding:0 0.75rem}}}}
    </style>

    <link rel="stylesheet" href="../css/main.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="../css/test.css" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="../css/main.css">
        <link rel="stylesheet" href="../css/test.css">
    </noscript>
</head>
<body>
    <nav class="nav-bar">
        <div class="nav-container">
            <div class="logo">
                <a href="../index.html" class="home-link">
                    <img src="../images/logo.svg" alt="IELTS听力评分解析" class="logo-img" width="48" height="48" decoding="async">
                    IELTS听力评分解析
                </a>
            </div>
            <ul class="nav-menu">
                <li><a href="../index.html">首页</a></li>
                <li><a href="scoring.html">评分详解</a></li>
                <li><a href="cases.html">案例分析</a></li>
                <li><a href="practice.html">听力练习</a></li>
            </ul>
        </div>
    </nav>

    <main class="test-container">
        <div class="test-intro">
            <h2>Test {test_num} - {date_str}</h2>
            <ul class="test-instructions">
                <li>时长：30分钟</li>
                <li>题量：40题</li>
                <li>完整音频播放器，可调整播放速度</li>
                <li>在听力过程中完成答题</li>
            </ul>
        </div>

        <div class="section-tabs">
            <button class="section-tab active" data-section="1">Section 1</button>
            <button class="section-tab" data-section="2">Section 2</button>
            <button class="section-tab" data-section="3">Section 3</button>
            <button class="section-tab" data-section="4">Section 4</button>
        </div>

        <div class="audio-players-container">
            <div class="audio-player" id="section1-player-container">
                <audio id="section1-player" src="../audio/test{test_num}/full_test{audio_ext}" preload="none"></audio>
                <div class="custom-player">
                    <div class="player-main">
                        <button class="play-btn" id="section1-play"><i class="fas fa-play"></i></button>
                        <div class="progress-bar">
                            <input type="range" class="progress" id="section1-progress" min="0" max="100" value="0">
                        </div>
                        <div class="time" id="section1-time">00:00 / 00:00</div>
                    </div>
                    <div class="speed-control">
                        <select class="playback-speed" id="section1-speed">
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1" selected>1.0x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2.0x</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <form id="test-form">
            <div class="section-content active" id="section-1" data-section="1">
                <div class="questions"></div>
            </div>
            <div class="section-content" id="section-2" data-section="2" style="display: none;">
                <div class="questions"></div>
            </div>
            <div class="section-content" id="section-3" data-section="3" style="display: none;">
                <div class="questions"></div>
            </div>
            <div class="section-content" id="section-4" data-section="4" style="display: none;">
                <div class="questions"></div>
            </div>
        </form>
    </main>

    <div class="result-modal" id="result-modal">
        <div class="result-content">
            <span class="close-result" id="close-result">&times;</span>
            <div class="result-header">
                <h2>测试结果</h2>
                <p>您已完成雅思听力测试，以下是您的成绩：</p>
            </div>
            <div class="result-score">
                <div class="score-circle correct">
                    <div class="score-value" id="correct-count">0</div>
                    <div class="score-label">正确题数</div>
                </div>
                <div class="score-circle ielts">
                    <div class="score-value" id="ielts-score">0.0</div>
                    <div class="score-label">雅思分数</div>
                </div>
            </div>
            <div class="result-details">
                <h3>各部分得分</h3>
                <div class="section-results" id="section-results"></div>
            </div>
            <button class="retry-btn" id="retry-btn">重新测试</button>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>关于我们</h4>
                <p>专注雅思听力评分解析，助力考生科学备考</p>
            </div>
            <div class="footer-section">
                <h4>快速导航</h4>
                <ul>
                    <li><a href="scoring.html">评分详解</a></li>
                    <li><a href="cases.html">案例分析</a></li>
                    <li><a href="practice.html">练习题</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-legal">
            <a href="../about.html">About</a>
            <a href="../privacy.html">Privacy</a>
            <a href="../terms.html">Terms</a>
            <a href="../contact.html">Contact</a>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 雅思听力评分解析. All rights reserved.</p>
        </div>
    </footer>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="../js/universal-audio-player.js" defer></script>
    <script src="../js/test-data-{test_num}.js" defer></script>
    <script src="../js/test-answers-{test_num}.js" defer></script>
    <script src="../js/test-renderer.js" defer></script>
    <script src="../js/test-init.js" defer></script>
    <script src="../js/analytics.js" defer></script>
</body>
</html>
'''
    html_path = os.path.join(PAGES_DIR, f'test{test_num}.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)


def main():
    index = load_master_index()
    print(f'Found {len(index)} tests in master index')

    start_num = 8

    successful = 0
    total_blanks = 0
    total_mc = 0

    for i, entry in enumerate(index):
        test_num = start_num + i
        print(f'\n[{i+1}/{len(index)}] Converting test {test_num}: {entry["date"]} ({entry["dir"]})')

        try:
            if convert_test(entry, test_num):
                generate_test_html(test_num, entry)
                successful += 1
        except Exception as e:
            import traceback
            print(f'  ERROR: {e}')
            traceback.print_exc()

    print(f'\n=== Done: {successful}/{len(index)} tests converted successfully ===')
    print(f'Test numbers: {start_num} to {start_num + len(index) - 1}')


if __name__ == '__main__':
    main()
