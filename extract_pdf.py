#!/usr/bin/env python3
import PyPDF2
import sys

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            print(f"Total pages: {len(pdf_reader.pages)}")
            
            # Extract text from all pages
            all_text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                all_text += f"\n--- PAGE {page_num + 1} ---\n{text}"
            
            # Save to text file
            output_path = pdf_path.replace('.pdf', '_extracted.txt')
            with open(output_path, 'w', encoding='utf-8') as output_file:
                output_file.write(all_text)
            
            print(f"Text extracted and saved to: {output_path}")
            
            # Also return first 2000 characters for preview
            return all_text[:2000]
            
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

if __name__ == "__main__":
    pdf_path = "/Users/jackyan/Desktop/Code/雅思网站/剑桥雅思20/剑桥雅思真题20完整版.pdf"
    preview_text = extract_text_from_pdf(pdf_path)
    if preview_text:
        print("\n--- PREVIEW (first 2000 characters) ---")
        print(preview_text)