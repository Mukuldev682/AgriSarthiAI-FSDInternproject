# AgriSarthi AI Prompts Log (Week 7)

This file documents the iterative prompt engineering process used to design the Crop Advisory feature for farmers in Uttarakhand, India.

---

## System Prompt / Role Used
For all variations, the AI is instructed with the following system role:
> "You are an expert agricultural scientist (Agronomist) specialized in farming in Uttarakhand, India."

---

## Prompt Variation 1: Direct Open-Ended Advisory

### Prompt Text
```
As an agricultural expert, write a detailed farming report for a farmer in Uttarakhand.
Crop: {cropName}
Soil: {soilType}
Season: {season}
Location (District): {location}
Symptoms: {symptoms}

Please provide advice on suitability, fertilizer, watering, pest control, and organic practices.
```

### Example Input
- **Crop**: Wheat
- **Soil**: Clayey
- **Season**: Rabi
- **Location**: Dehradun
- **Symptoms**: Yellow leaves

### Example Output
```
Wheat is suitable for Dehradun in Rabi. Since your soil is clayey, ensure that you don't overwater because clayey soil holds a lot of moisture. For yellow leaves, check if there is waterlogging. Apply urea or NPK fertilizer at regular intervals. Use neem spray for pests.
```

### Evaluation
* **Pros**: Simple, fast response.
* **Cons**: The output format is unstructured, free-form text. It is extremely difficult to parse consistently on the backend to display in clean frontend components (such as separate sections for fertilizers or irrigation).

---

## Prompt Variation 2: Markdown Sectioned Text

### Prompt Text
```
You are an expert agronomist in Uttarakhand. Analyze the following crop and location details:
Crop: {cropName}
Soil: {soilType}
Season: {season}
Location: {location}
Symptoms: {symptoms}

Provide the response in the following Markdown format:
### Suitability Score: [1-10]
### Analysis: [Compatibility analysis]
### Fertilizers: [Bulleted list]
### Irrigation: [Bulleted list]
### Pests & Diseases: [Bulleted list]
### Sustainable Practices: [Bulleted list]
```

### Example Input
- **Crop**: Tomato
- **Soil**: Loamy
- **Season**: Kharif
- **Location**: Almora
- **Symptoms**: Wilted stems

### Example Output
```
### Suitability Score: 7/10
### Analysis: Tomato is generally compatible with Loamy soil in Almora during Kharif, but rainfall during monsoon can lead to stem rot.
### Fertilizers:
* Apply composted farmyard manure.
* Supplement with Boron to prevent fruit cracking.
### Irrigation:
* Stems should not be waterlogged.
* Use raised beds to drain excess rainwater.
### Pests & Diseases:
* Wilted stems indicates Fusarium wilt or root rot.
* Apply copper oxychloride fungicide.
### Sustainable Practices:
* Implement crop rotation.
* Mulch with straw to control weeds.
```

### Evaluation
* **Pros**: Visually organized.
* **Cons**: Text structure still varies across different model runs (sometimes extra lines are introduced, or heading tags are written as markdown headers vs plain text), which can lead to parsing errors when displaying structured UI grids.

---

## Prompt Variation 3: Strict Roleplay Agronomist with JSON Enforcement (Selected)

### Prompt Text
```
You are an expert agricultural scientist (Agronomist) specialized in farming in Uttarakhand, India.
Provide a detailed, practical, and farmer-friendly crop advisory report based on the following farmer input:
- Crop Name: {cropName}
- Soil Type: {soilType}
- Current Season: {season}
- District in Uttarakhand: {location}
{symptoms ? `- Symptoms/Questions/Issues: {symptoms}` : ''}

You MUST respond with a valid JSON object matching the following structure (do NOT wrap the JSON in markdown code blocks like ```json, just return the raw JSON):
{
  "suitabilityScore": <a number from 1 to 10 evaluating how suitable this crop is for the given soil, season, and district in Uttarakhand>,
  "analysis": "<a concise, friendly analysis in Hindi and English explaining the compatibility and general suggestion>",
  "fertilizerTips": [
    "<fertilizer recommendation 1 in Hindi and English>",
    "<fertilizer recommendation 2 in Hindi and / or English>"
  ],
  "irrigationTips": [
    "<irrigation advice 1 in Hindi and English>",
    "<irrigation advice 2 in Hindi and / or English>"
  ],
  "pestDiseaseManagement": [
    "<pest or disease warning/treatment advice 1 in Hindi and English>",
    "<pest or disease warning/treatment advice 2 in Hindi and / or English>"
  ],
  "sustainablePractices": [
    "<sustainable or organic practice 1 in Hindi and English>",
    "<sustainable or organic practice 2 in Hindi and / or English>"
  ]
}

Make sure the advice is highly tailored to Uttarakhand's geography (hilly vs. plain districts), the specified soil type, and the season. Include both Hindi and English inside each string to make it accessible to local farmers (e.g. "Apply NPK fertilizer / एनपीके खाद का प्रयोग करें"). Do not include any text before or after the JSON.
```

### Example Input
- **Crop**: Potato
- **Soil**: Sandy
- **Season**: Zaid
- **Location**: Haridwar
- **Symptoms**: Small spots on tubers

### Example Output
```json
{
  "suitabilityScore": 6,
  "analysis": "Sandy soil in Haridwar during Zaid is moderately suitable for potatoes but requires careful watering. / हरिद्वार में जायद के दौरान रेतीली मिट्टी आलू के लिए मध्यम रूप से उपयुक्त है लेकिन सावधानीपूर्वक सिंचाई की आवश्यकता होती है।",
  "fertilizerTips": [
    "Apply nitrogen split doses to avoid leaching in sandy soil. / रेतीली मिट्टी में पोषक तत्वों के नुकसान से बचने के लिए नाइट्रोजन की मात्रा को विभाजित खुराकों में डालें।",
    "Use organic compost to increase soil organic carbon. / मिट्टी में जैविक कार्बन बढ़ाने के लिए जैविक खाद का उपयोग करें।"
  ],
  "irrigationTips": [
    "Irrigate every 5-7 days as sandy soil drains fast. / रेतीली मिट्टी में पानी जल्दी सूख जाता है, इसलिए हर 5-7 दिनों में सिंचाई करें।",
    "Drip irrigation is highly recommended to save water. / पानी बचाने के लिए ड्रिप सिंचाई की अत्यधिक सिफारिश की जाती है।"
  ],
  "pestDiseaseManagement": [
    "Small spots on tubers may indicate early blight or scab. / कंदों पर छोटे धब्बे अगेती झुलसा या स्कैब रोग का संकेत हो सकते हैं।",
    "Spray Mancozeb at 2g/L or use trichoderma formulation. / मैंकोजेब 2 ग्राम/लीटर की दर से छिड़कें या ट्राइकोडेमा का उपयोग करें।"
  ],
  "sustainablePractices": [
    "Cover the soil with organic mulch to prevent evaporation. / पानी के वाष्पीकरण को रोकने के लिए मिट्टी को घास-फूस या जैविक मल्च से ढकें।",
    "Practice crop rotation with green manure crops. / हरी खाद वाली फसलों के साथ फसल चक्र अपनाएं।"
  ]
}
```

### Why Variation 3 Worked Best
Variation 3 worked best because it strictly enforces a JSON output structure with specific arrays for each category. This allows the backend and frontend to parse and render the recommendations in separate, beautifully styled visual cards without formatting errors. Enforcing both English and Hindi translations directly within the prompt ensures the advisory remains highly usable for local farmers in Uttarakhand, and the JSON format support in both Gemini (`responseMimeType: "application/json"`) and Groq (`response_format: { type: "json_object" }`) guarantees consistent, error-free API responses.
