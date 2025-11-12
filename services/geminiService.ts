
// This is a mock service. In a real application, you would import and use the @google/genai library here.
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDraftAssistant = async (prompt: string): Promise<string> => {
    console.log("Calling mock Gemini for draft assistant with prompt:", prompt);
    // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `...` });
    // return response.text;
    await new Promise(res => setTimeout(res, 2000));
    return `
### INCIDENT OVERVIEW
On [Date], at approximately [Time], an incident involving [brief, factual description of event] occurred at [Location]. This report provides a detailed account of the event, actions taken, and initial findings.

### SEQUENCE OF EVENTS
1.  **[Time]:** [First significant event or observation].
2.  **[Time]:** [Second significant event].
3.  **[Time]:** [Subsequent action taken by personnel].
4.  **[Time]:** [Resolution or current status].

### PERSONNEL INVOLVED
*   **Name:** [Full Name], **Role:** [Role/Title]
*   **Name:** [Full Name], **Role:** [Role/Title]

### INITIAL ASSESSMENT
The preliminary assessment indicates that [initial conclusion or impact]. Contributing factors may include [e.g., weather conditions, equipment status, human factors].

### ACTIONS TAKEN
Immediate actions included:
*   Securing the area.
*   Notifying relevant authorities, including [Specific department/person].
*   [Any other critical actions].

### RECOMMENDATIONS (PRELIMINARY)
*   Further investigation is required to determine the root cause.
*   [A second preliminary recommendation].
`;
};

export const generateExecutiveSummary = async (reportContent: string): Promise<string> => {
    console.log("Calling mock Gemini for executive summary.");
    // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `...` });
    // return response.text;
    await new Promise(res => setTimeout(res, 1500));
    if (reportContent.length < 50) {
        return "The report content is too brief to generate a meaningful summary. Please add more details to the report body.";
    }
    return "This report details a [event type] at [location] on [date]. Key outcomes include [key outcome 1] and [key outcome 2]. The situation was resolved following [actions taken], and initial recommendations focus on [recommendation area]. All personnel are safe, and operations have returned to [current status].";
};

export const provideWritingFeedback = async (text: string): Promise<string> => {
    console.log("Calling mock Gemini for writing feedback.");
    await new Promise(res => setTimeout(res, 1000));
    return "Overall, the report is clear and concise. Consider rephrasing the sentence starting with 'At approximately...' for better flow. Also, ensure all acronyms are defined on first use.";
};
