from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(0, 102, 204)
        self.cell(0, 15, 'Hiregram.ai Integration Blueprint', 0, 1, 'C')
        self.ln(5)

    def chapter_title(self, num, title):
        self.set_font('helvetica', 'B', 14)
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, f'Strategy {num}: {title}', 0, 1, 'L')
        self.ln(2)

    def chapter_body(self, body):
        self.set_font('helvetica', '', 12)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 8, body)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

intro = ("Based on our architectural review, Hiregram.ai is a consumer application without "
         "a public developer API. Below are three potential blueprints for integrating its "
         "functionality into the Zythron Hackathon project.")
pdf.set_font('helvetica', '', 12)
pdf.multi_cell(0, 8, intro)
pdf.ln(5)

pdf.chapter_title(1, 'The "Iframe / Web-Embed" Route (Fastest)')
body1 = ("Overview:\nIf you want users to access Hiregram's AI interviewer without leaving your app, "
         "embed their site inside your Next.js frontend.\n\n"
         "Blueprint steps:\n"
         "1. Create a new route in your Next.js app (e.g., frontend/src/app/mock-interview/page.tsx).\n"
         "2. Add an HTML <iframe> pointing to https://hiregram.ai/sign-in.\n\n"
         "Pros: Takes 2 minutes to build.\n"
         "Cons: Hiregram might block iframe embedding (via X-Frame-Options headers), and user "
         "data/auth won't sync with your backend.")
pdf.chapter_body(body1)

pdf.chapter_title(2, 'Deep-Linking (The Handoff)')
body2 = ("Overview:\nTreat Hiregram as a third-party partner platform rather than natively embedding it.\n\n"
         "Blueprint steps:\n"
         "1. In your Chat UI, prompt the Gemini AI to detect when a user wants to practice for an interview.\n"
         "2. When detected, have Gemini return a structured JSON response or a special UI card.\n"
         "3. Your frontend renders a 'Start Mock Interview' button that opens https://hiregram.ai in a new tab.\n\n"
         "Pros: 100% reliable, zero API dependencies.\n"
         "Cons: Breaks the native user experience.")
pdf.chapter_body(body2)

pdf.chapter_title(3, 'The "Build Your Own Sara" Route (Highly Recommended)')
body3 = ("Overview:\nSince you've already built a Voice-to-Text frontend and a Gemini+Pinecone backend, "
         "you already have 90% of the underlying technology that Hiregram uses! You can replicate the exact "
         "feature natively.\n\n"
         "Blueprint steps:\n"
         "1. System Prompt Update: Add an endpoint (/api/mock-interview) where Gemini is given a strict "
         "system prompt: 'You are an expert interviewer. Ask one technical question at a time, wait for the "
         "user's answer, and then ask a follow-up or provide feedback.'\n"
         "2. Context Injection: When the user selects a role, query your Pinecone database for the required "
         "skills and feed that into Gemini's prompt.\n"
         "3. Voice UI: Reuse the window.speechSynthesis and SpeechRecognition logic we already built in page.tsx.\n"
         "4. Feedback Report: When the user says 'end interview', have Gemini generate a Markdown report scoring "
         "their communication and technical skills.\n\n"
         "Pros: You control the data, it's deeply integrated with your Pinecone job database, and it looks "
         "incredibly impressive to hackathon judges.")
pdf.chapter_body(body3)

out_path = os.path.abspath("Hiregram_Integration_Blueprint.pdf")
pdf.output(out_path)
print(f"PDF saved to {out_path}")
