import re
import os
import json
import hashlib
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import urlparse
from google import genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

# Get API key from .env file
API_KEY = os.getenv("GEMINI_API_KEY_3")

if not API_KEY or API_KEY == "your_key_here":
    print("\n❌ ERROR: GEMINI_API_KEY_4 not configured!")
    print("   Create a .env file in your backend directory with:")
    print("   GEMINI_API_KEY_4= AIzaSyCXTVHIyCWBioY2mq6NtfPMcJqdkjOFleU\n")
    API_KEY = "placeholder"

# Initialize Gemini API client
try:
    client = genai.Client(api_key=API_KEY)
    print(f"✓ API Client initialized with key: {API_KEY[:20]}...")
except Exception as e:
    print(f"❌ Error initializing API client: {e}")
    client = None

# Create FastAPI app
app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for analysis results
analysis_cache = {}


# ============================================================================
# DOMAIN WHITELIST
# ============================================================================

SAFE_DOMAINS = [
    # --- Government & Public Services (Albania) ---
    'gov.al', 'e-albania.al', 'kryeministria.al', 'punetejashtme.gov.al', 
    'mod.gov.al', 'financa.gov.al', 'energjia.gov.al', 'bujqesia.gov.al', 
    'punetebrendshme.gov.al', 'drejtesia.gov.al', 'shendetesia.gov.al', 
    'arsimi.gov.al', 'turizmi.gov.al', 'kultura.gov.al', 'instat.gov.al', 
    'tatime.gov.al', 'dogana.gov.al', 'akep.al', 'akshi.gov.al', 
    'qkr.gov.al', 'app.gov.al', 'amf.gov.al', 'bankofalbania.org',

    # --- Banking & Finance (Albania & Global) ---
    'bkt.com.al', 'raiffeisen.al', 'intesasanpaolobank.al', 'bankacredins.com', 
    'unionbank.al', 'otpbank.al', 'tiranabank.al', 'abi.al', 'procreditbank.com.al',
    'paypal.com', 'stripe.com', 'visa.com', 'mastercard.com', 'revolut.com',

    # --- Big Tech & Infrastructure (Global) ---
    'google.com', 'google.al', 'alphabet.xyz', 'microsoft.com', 'apple.com',
    'amazon.com', 'cloudflare.com', 'github.com', 'gitlab.com', 'oracle.com',
    'ibm.com', 'aws.amazon.com', 'azure.microsoft.com', 'digitalocean.com',

    # --- Communication & Productivity ---
    'gmail.com', 'outlook.com', 'proton.me', 'slack.com', 'zoom.us', 
    'teams.microsoft.com', 'notion.so', 'trello.com', 'canva.com',
    'whatsapp.com', 'telegram.org', 'discord.com',

    # --- AI & Emerging Tech ---
    'openai.com', 'chatgpt.com', 'anthropic.com', 'claude.ai', 'gemini.google.com',
    'perplexity.ai', 'midjourney.com', 'huggingface.co',

    # --- Telecom & Utilities (Albania) ---
    'one.al', 'vodafone.al', 'postashqiptare.al', 'oshee.al', 'uksh.al',
    'tirana-airport.com', 'wizzair.com', 'lufthansa.com',

    # --- Education & Reference (Albania & Global) ---
    'unitir.edu.al', 'upt.al', 'ubt.edu.al', 'uniel.edu.al', 'unishk.edu.al', 
    'uamd.edu.al', 'univlora.edu.al', 'unkorce.edu.al', 'albanianuniversity.edu.al',
    'wikipedia.org', 'britannica.com', 'coursera.org', 'edx.org', 'khanacademy.org',
    'stackoverflow.com', 'medium.com',

    # --- Verified Media & News (Albania & Global) ---
    'rtsh.al', 'top-channel.tv', 'tvklan.al', 'balkanweb.com', 'panorama.com.al', 
    'gazetatema.net', 'shqiptarja.com', 'syri.net', 'reporter.al', 'lajmifundit.al',
    'merrjep.al', 'njoftime.com', 'gazetacelesi.al', 'motilokal.com',
    'bbc.com', 'nytimes.com', 'reuters.com', 'bloomberg.com', 'theguardian.com',
    'cnn.com', 'wsj.com', 'aljazeera.com'
]

SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.click', '.top', '.buzz', '.info']

# Regex patterns to detect typosquatting (domain imitation)
TYPOSQUAT_PATTERNS = [
    r"bkt[^.]*\.(xyz|tk|ml|ga|cf|info|click|top|buzz)",
    r"e-?albania[^.]*\.(xyz|tk|ml|ga|cf|info|click|top|buzz)",
    r"posta[^.]*shqip[^.]*\.(xyz|tk|ml|ga|cf|info|click|top|buzz)",
    r"gov[^.]*al[^.]*\.",
    r"tatime[^.]*\."
]


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_cache_key(text, context_type):
    """Generate a hash key for caching analysis results"""
    content = f"{text}_{context_type}"
    return hashlib.md5(content.encode()).hexdigest()


def phishing_links(text):
    """
    phishing URLs in the text for suspicious characteristics.
    Returns: (link_score, link_reports, is_whitelisted)
    """
    url_pattern = r'https?://[^\s<>"]+'
    urls = re.findall(url_pattern, text)
    
    link_score = 0
    link_reports = []
    is_whitelisted = False

    if not urls:
        return 0, [], False

    for url in urls:
        domain = urlparse(url).netloc.lower()
        clean_domain = domain.replace("www.", "")
        
        # Check if domain is on whitelist
        if any(clean_domain == safe or clean_domain.endswith('.' + safe) for safe in SAFE_DOMAINS):
            is_whitelisted = True
            continue

        # Check for typosquatting (domain imitation)
        is_typosquat = any(re.search(pattern, clean_domain) for pattern in TYPOSQUAT_PATTERNS)
        if is_typosquat:
            link_score += 50
            link_reports.append(f"Kujdes: Faqe që imiton një institucion ({clean_domain})")
            continue

        # Check for suspicious TLDs
        if any(clean_domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            link_score += 35
            link_reports.append(f"Domain i dyshimtë: {clean_domain}")

    return link_score, link_reports, is_whitelisted


def get_ai_analysis(text, context_type):
    """
    Send text to Gemini AI for phishing analysis.
    Returns: {"score": int, "shpjegimi": str, "verdikti": str}
    """
    
    if not client or API_KEY == "placeholder":
        return {
            "score": 0,
            "shpjegimi": "API key nuk është konfiguruar. Kontrolloni .env file.",
            "verdikti": "I Dyshimtë"
        }
    
    sot = datetime.now()
    viti_aktual = sot.year
    data_plote = sot.strftime("%d/%m/%Y")

    prompt = f"""Sot është data {data_plote}. Ti je një monitorues i sigurisë në kohë reale.

Analizo këtë mesazh ({context_type}): "{text}"

RREGULLAT E DATËS:
1. Viti aktual është {viti_aktual}.
2. Çdo referencë për "Copyright {viti_aktual}" ose data brenda vitit {viti_aktual} është LOGJIKE.
3. Nëse mesazhi përmban një datë në të ardhmen, kjo është PHISHING.
4. Nëse mesazhi gënjen për vitin aktual, markoje si Rrezik i Lartë.

Ktheje përgjigjen VETËM si JSON:
{{"score": numër, "shpjegimi": "tekst", "verdikti": "Rrezik i Lartë" ose "I Dyshimtë" ose "I Sigurt"}}"""

    try:
        # ✅ FIX: Use gemini-2.0-flash-exp (works with free tier)
        # Other options that work: "gemini-2.0-flash-exp", "gemini-pro", "gemini-1.5-pro"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # Extract JSON from response
        match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', response.text, re.DOTALL)
        
        if match:
            json_string = match.group(0)
            try:
                result = json.loads(json_string)
                # Validate result
                if "score" in result and "shpjegimi" in result and "verdikti" in result:
                    result["score"] = int(result.get("score", 0))
                    return result
            except json.JSONDecodeError:
                return {
                    "score": 50,
                    "shpjegimi": "Analiza nuk përpunohet saktë.",
                    "verdikti": "I Dyshimtë"
                }
        else:
            return {
                "score": 50,
                "shpjegimi": "Analiza AI nuk mundi të formatohej.",
                "verdikti": "I Dyshimtë"
            }

    except Exception as e:
        error_str = str(e)
        print(f"AI Error: {error_str[:150]}...")
        
        # Specific error handling
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            return {
                "score": 0,
                "shpjegimi": "Kota ditore e API-t është plotësuar. Përpiquni nesër.",
                "verdikti": "I Dyshimtë"
            }
        elif "API_KEY_INVALID" in error_str or "not valid" in error_str:
            return {
                "score": 0,
                "shpjegimi": "API key është i pavlefshëm. Kontrolloni .env file.",
                "verdikti": "I Dyshimtë"
            }
        elif "404" in error_str or "not found" in error_str or "not supported" in error_str:
            return {
                "score": 0,
                "shpjegimi": "Modeli i AI-t nuk është i disponueshëm.",
                "verdikti": "I Dyshimtë"
            }
        else:
            return {
                "score": 0,
                "shpjegimi": "Nuk mundi të analizohet. Përpiquni sërish.",
                "verdikti": "I Dyshimtë"
            }


# ============================================================================
# API MODELS
# ============================================================================

class AnalysisRequest(BaseModel):
    content: str  # The text to phishing
    type: str     # Either 'sms' or 'email'


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
def home():
    """Health check endpoint"""
    return {"message": "Mburoja API is running!"}


@app.post("/phishing")
def phishing_text(request: AnalysisRequest):
    """
    Main analysis endpoint.
    phishings text for phishing threats and returns risk score + verdict.
    """
    
    # ===== STEP 1: Check cache =====
    cache_key = get_cache_key(request.content, request.type)
    if cache_key in analysis_cache:
        print(f"✓ Cache hit for: {cache_key}")
        return analysis_cache[cache_key]
    
    # ===== STEP 2: phishing links and AI =====
    link_score, link_issues, is_whitelisted = phishing_links(request.content)
    ai_result = get_ai_analysis(request.content, request.type)
    
    ai_score = ai_result.get('score', 0)
    
    # ===== STEP 3: Calculate final score =====
    if ai_score > 60:
        final_score = ai_score
    elif is_whitelisted:
        final_score = max(0, ai_score - 30)
    else:
        final_score = max(link_score, ai_score)

    # Override for typosquatting
    if link_score >= 50 and not is_whitelisted:
        final_score = max(final_score, 85)

    # ===== STEP 4: Calculate verdict from final score =====
    if final_score >= 70:
        final_verdict = "Rrezik i Lartë"
    elif final_score >= 30:
        final_verdict = "I Dyshimtë"
    else:
        final_verdict = "I Sigurt"

    # ===== STEP 5: Build explanation =====
    explanation = ai_result.get('shpjegimi', "Analiza u krye.")
    if link_issues:
        explanation += " | Detaje teknike: " + ", ".join(link_issues)

    # ===== STEP 6: Create result object =====
    result = {
        "risk_score": round(min(final_score, 100)),
        "explanation": explanation,
        "verdict": final_verdict
    }
    
    # ===== STEP 7: Store in cache =====
    analysis_cache[cache_key] = result
    print(f"✓ Cached result for: {cache_key}")
    print(f"  Score: {result['risk_score']}, Verdict: {result['verdict']}")
    
    return result