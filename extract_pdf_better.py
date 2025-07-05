#!/usr/bin/env python3
import pdfplumber
import sys
import re

def extract_text_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
            
            # Extract text from all pages
            all_text = ""
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:  # Only add non-empty text
                    all_text += f"\n--- PAGE {page_num + 1} ---\n{text}\n"
            
            # Save to text file
            output_path = pdf_path.replace('.pdf', '_extracted_pdfplumber.txt')
            with open(output_path, 'w', encoding='utf-8') as output_file:
                output_file.write(all_text)
            
            print(f"Text extracted and saved to: {output_path}")
            
            # Look for listening test content
            listening_pages = []
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text and ('listening' in text.lower() or 'test' in text.lower() and 'section' in text.lower()):
                    listening_pages.append((page_num + 1, text[:500]))  # First 500 chars
            
            if listening_pages:
                print(f"\nFound {len(listening_pages)} pages with potential listening content:")
                for page_num, preview in listening_pages[:10]:  # Show first 10
                    print(f"Page {page_num}: {preview[:100]}...")
            
            # Return first 3000 characters for preview
            return all_text[:3000]
            
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

if __name__ == "__main__":
    pdf_path = "/Users/jackyan/Desktop/Code/雅思网站/剑桥雅思20/剑桥雅思真题20完整版.pdf"
    preview_text = extract_text_from_pdf(pdf_path)
    if preview_text:
        print("\n--- PREVIEW (first 3000 characters) ---")
        print(preview_text)