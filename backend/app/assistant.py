"""
DATHEON AI - Disaster Safety & Readiness AI Assistant
Adheres strictly to Sendai Framework, NDMA (National Disaster Management Authority),
and Red Cross emergency guidelines.
Includes clear safety disclaimers and avoids fabricating official orders.
"""

import os
from typing import Dict, Any, List

# Reliable knowledge base entries
DISASTER_KNOWLEDGE = {
    "checklist": {
        "title": "72-Hour Disaster Preparedness Go-Bag Checklist",
        "items": [
            "Drinking Water: Minimum 3 liters per person per day for at least 3 days.",
            "Non-perishable Food: Ready-to-eat canned foods, energy bars, dry fruits, baby food if applicable.",
            "Waterproof Document Pouch: Identity cards, land deeds, insurance policies, medical prescriptions, passport photos.",
            "First Aid & Essential Medications: Bandages, antiseptic liquid, ORS packets, personal prescription medicines (7-day supply).",
            "Emergency Lighting & Power: High-lumen LED flashlight, spare batteries, fully charged 20,000mAh power bank, emergency whistle.",
            "Personal Hygiene: Antiseptic wet wipes, sanitizer, sanitary pads, chlorine water purification tablets.",
            "Protection & Clothing: Sturdy waterproof boots, rain ponchos, thermal foil blanket, work gloves."
        ]
    },
    "indicators": {
        "rainfall": "Rainfall indicators measure cumulative precipitation (in mm). Over 24 hours: <50mm is normal/moderate, 50-100mm is heavy, 100-200mm is very heavy, and >200mm is extremely heavy (cloudburst or tropical surge risk).",
        "river_level": "River gauge indicators denote current water level relative to the officially declared 'Danger Mark' (zero baseline). Positive values (+1.5m, +3.0m) indicate water has crested banks or threatens flood defense embankments.",
        "terrain": "Terrain susceptibility (0.0 to 1.0) reflects geological slope, soil saturation index, and stormwater drain outflow efficiency. Values near 1.0 represent low-lying concave basins prone to prolonged waterlogging.",
        "risk_score": "The 0-100 Risk Score is a transparent decision-support metric blending physical hydrological indicators (60%) with trained machine learning pattern recognition (40%). It categorizes into Low (<30), Moderate (30-54), High (55-74), and Severe (75-100)."
    },
    "flood_safety": {
        "before": [
            "Know your designated community relief shelter and accessible elevated routes.",
            "Keep emergency contact numbers saved offline (NDRF: 1078, Universal Emergency: 112, Ambulance: 108).",
            "Elevate household electrical appliances and chemical containers above projected flood lines."
        ],
        "during": [
            "TURN AROUND, DON'T DROWN: Never walk, swim, or drive through flowing water. Just 15 cm (6 inches) of moving water can sweep an adult off their feet; 30 cm can float a small car.",
            "Disconnect household main electricity switches and turn off gas regulator valves before water enters.",
            "Do not touch fallen electric wires or metal fencing near water pools.",
            "Boil or chemically treat all drinking water to prevent waterborne cholera and typhoid outbreaks."
        ],
        "after": [
            "Wait for official confirmation from local authorities (DDMA/District Magistrate) before re-entering inundated premises.",
            "Inspect home structure for foundation cracks, undermined walls, or venomous snakes/reptiles seeking dry refuge.",
            "Photograph flood damages before cleanup for insurance and disaster relief claims.",
            "Discard all perishable food that came into contact with floodwater."
        ]
    }
}

class DisasterAssistant:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.gemini_model = None
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception:
                self.gemini_model = None

    def respond(self, query: str, history: List[Dict[str, str]] = None, location_context: str = None) -> Dict[str, Any]:
        query_lower = query.lower()
        
        # Check if user query matches core disaster concepts
        sources = ["NDMA (National Disaster Management Authority) Guidelines", "Sendai Framework for Disaster Risk Reduction", "Red Cross Emergency Readiness Protocols"]
        
        # If Gemini is configured and accessible, try generating response with disaster guardrails
        if self.gemini_model:
            try:
                system_instruction = (
                    "You are DATHEON AI Assistant, a specialized decision-support chatbot for disaster management and flood resilience. "
                    "Rules: 1. You provide educational, preparedness, and indicator interpretation guidance based on NDMA, Sendai Framework, and Red Cross. "
                    "2. DO NOT invent official evacuation orders or fake government alerts. "
                    "3. Always instruct the user to follow local District Disaster Management Authority (DDMA) instructions during active emergencies. "
                    "4. If answering about risk scores, explain the 0-100 scale transparently."
                )
                prompt = f"{system_instruction}\n\nUser Question: {query}\nLocation Context: {location_context or 'General'}\nAnswer concisely and clearly in Markdown:"
                res = self.gemini_model.generate_content(prompt)
                if res and res.text:
                    return {
                        "reply": res.text,
                        "sources_consulted": sources + ["Google Gemini AI Engine"],
                        "suggested_followups": [
                            "What should I pack in a 72-hour flood emergency kit?",
                            "How do I interpret the River Level and Rainfall indicators?",
                            "What are the golden rules of safety during active floodwaters?"
                        ],
                        "disclaimer": "DATHEON AI provides decision-support and educational guidance only. It does not replace emergency commands from official authorities."
                    }
            except Exception:
                pass # fallback to rich rule-based expert engine

        # High-precision Domain-Specific Fallback Engine
        if any(w in query_lower for w in ["kit", "bag", "checklist", "supplies", "pack", "prepare"]):
            items_text = "\n".join([f"- **{it.split(':')[0]}**: {it.split(':')[1]}" if ':' in it else f"- {it}" for it in DISASTER_KNOWLEDGE["checklist"]["items"]])
            reply = (
                f"### 🎒 72-Hour Flood Emergency Readiness Go-Bag Checklist\n\n"
                f"According to NDMA and international disaster guidelines, every household in flood-vulnerable zones should prepare an easily portable waterproof emergency kit:\n\n"
                f"{items_text}\n\n"
                f"> **Important Tip:** Keep the bag stored in an elevated, easily accessible closet near your primary exit. Inspect and cycle water/medicines every 6 months."
            )
            followups = [
                "What should I do if water begins entering my home?",
                "How does DATHEON calculate the 0-100 risk score?",
                "Where can I find the nearest demonstration emergency shelter?"
            ]

        elif any(w in query_lower for w in ["indicator", "river", "rainfall", "score", "terrain", "formula", "model", "calculate"]):
            reply = (
                f"### 📊 Interpreting DATHEON AI Disaster Indicators\n\n"
                f"Our decision-support prototype assesses multi-hazard vulnerability across 5 core indicators:\n\n"
                f"1. **24-hr Rainfall (30% weight):** {DISASTER_KNOWLEDGE['indicators']['rainfall']}\n\n"
                f"2. **River Gauge Level (25% weight):** {DISASTER_KNOWLEDGE['indicators']['river_level']}\n\n"
                f"3. **Historical Flood Recurrence (15% weight):** Past 10-year inundation recurrence marks chronic geomorphological vulnerability.\n\n"
                f"4. **Terrain Susceptibility (15% weight):** {DISASTER_KNOWLEDGE['indicators']['terrain']}\n\n"
                f"5. **Population Exposure (15% weight):** Evaluates demographic density, informal settlement construction, and elderly/child ratios.\n\n"
                f"**Composite Score Categories:**\n"
                f"- `0 - 29 (Low)`: Routine advisory.\n"
                f"- `30 - 54 (Moderate)`: Precautionary staging.\n"
                f"- `55 - 74 (High)`: Shelter readiness & volunteer mobilization.\n"
                f"- `75 - 100 (Severe)`: Immediate proactive relocation to elevated shelters."
            )
            followups = [
                "What are the safe driving guidelines near floodwaters?",
                "What medical supplies are vital during prolonged floods?",
                "Show me the recommended actions for Severe risk."
            ]

        elif any(w in query_lower for w in ["during", "do", "safety", "water", "enter", "house", "drown", "electric"]):
            during_text = "\n".join([f"- {step}" for step in DISASTER_KNOWLEDGE["flood_safety"]["during"]])
            reply = (
                f"### ⚠️ Essential Safety Protocols During Active Flooding\n\n"
                f"{during_text}\n\n"
                f"#### Emergency Contact Lifelines (India):\n"
                f"- **National Disaster Response Force (NDRF):** `1078`\n"
                f"- **All-in-One National Emergency Helpline:** `112`\n"
                f"- **Disaster Emergency Operation Centre:** `1070`\n"
                f"- **Ambulance Service:** `108`"
            )
            followups = [
                "What should I do immediately after floodwaters recede?",
                "What items are needed in my flood go-bag?",
                "How do I interpret high river gauge indicators?"
            ]

        elif any(w in query_lower for w in ["after", "recede", "clean", "disease", "contamination"]):
            after_text = "\n".join([f"- {step}" for step in DISASTER_KNOWLEDGE["flood_safety"]["after"]])
            reply = (
                f"### 🛡️ Post-Flood Recovery & Health Protocols\n\n"
                f"The aftermath of flooding presents severe hidden hazards like structural failure, electrocution, and waterborne epidemics:\n\n"
                f"{after_text}\n\n"
                f"**Water Disinfection Tip:** Bring water to a rolling boil for at least 1 full minute, or use standard chlorine tablets (e.g., Halazone) per municipal health dosage instructions."
            )
            followups = [
                "What are the essential items in a 72-hour emergency kit?",
                "Explain the disaster indicators on the map",
                "How do I register a new shelter in the admin panel?"
            ]

        else:
            reply = (
                f"### 🤝 Welcome to DATHEON AI Disaster Assistance\n\n"
                f"I am your disaster preparedness and risk decision-support assistant for the **AI Manthan 2.0 Hackathon**.\n\n"
                f"I can help you with:\n"
                f"- **Preparedness Checklists:** Comprehensive 72-hour family go-bag contents.\n"
                f"- **Indicator Analysis:** Understanding rainfall volume, river crest levels, and terrain vulnerability indices.\n"
                f"- **Life Safety Protocols:** Immediate do's and don'ts during flash floods and dam water discharges.\n"
                f"- **Post-Flood Sanitation:** Preventing waterborne infections and safely re-entering buildings.\n\n"
                f"*Please choose one of the suggested prompts below or type your emergency readiness question.*"
            )
            followups = [
                "What should be in my 72h flood emergency kit?",
                "How do I interpret the River Level and Rainfall indicators?",
                "What safety steps should I follow if flood water enters my home?",
                "What is the difference between rule-based and ML risk scoring?"
            ]

        return {
            "reply": reply,
            "sources_consulted": sources,
            "suggested_followups": followups,
            "disclaimer": "DATHEON AI provides demonstration decision-support guidance. During actual disasters, always follow instructions from the National Disaster Management Authority (NDMA) and local district authorities."
        }

assistant = DisasterAssistant()
