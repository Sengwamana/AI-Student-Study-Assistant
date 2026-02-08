import markdown2
from fpdf import FPDF

# Read markdown documentation
with open('ProjectDocumentation.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert markdown to HTML
html_content = markdown2.markdown(md_content)

# Create PDF
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'AI Study Assistant Project Documentation', ln=True, align='C')
        self.ln(5)

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, ln=True)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 8, body)
        self.ln()

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

# Simple markdown to text (for PDF)
for line in md_content.split('\n'):
    if line.startswith('# '):
        pdf.chapter_title(line[2:])
    elif line.startswith('## '):
        pdf.chapter_title(line[3:])
    elif line.strip() == '':
        pdf.ln(2)
    else:
        pdf.chapter_body(line)

pdf.output('ProjectDocumentation.pdf')
print('PDF generated: ProjectDocumentation.pdf')
