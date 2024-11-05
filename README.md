# Once Upon: The Children’s Story Generation App

**Authors:** Hima Cheruvu, Nia Ganger, Christian Piantanida, Rishika Ravindran  
**Institution:** Applied Data Science Program, University of Chicago

**Academic Paper:** [Link to Paper](https://docs.google.com/document/d/1hXPNcPH6-LUzYTw7pF7fpnhOF5rucWVO7um2F3gctRs/edit?usp=sharing)

<p align="center">
  <img width="578" alt="Once Upon Logo with Slogan" src="https://github.com/user-attachments/assets/add556ee-99ab-4c2d-80b5-5b5cdb9ce375">
</p>

## Abstract
**Once Upon** is an interactive storytelling app that generates age-appropriate, personalized stories for children using AI-driven customization. Powered by **Gemini 1.5 Pro** and **LangChain**, the app crafts unique narratives that incorporate user-specific details like age, preferences, and familiar names. Key features include a **Browse Page** with themed stories, a **Custom Story Generation** option, and **Text-to-Speech (TTS)** for accessible, auditory storytelling.

---

## Table of Contents

1. [Project Motivation](#project-motivation)
2. [App Overview](#app-overview)
3. [System Architecture](#system-architecture)
4. [Methodology](#methodology)
5. [Results and Discussion](#results-and-discussion)
6. [Conclusion and Future Work](#conclusion-and-future-work)
7. [Contact Information](#contact-information)

---

### Project Motivation

Ever come home after a long day, ready to unwind, only to hear, "Can you tell me a bedtime story?" Enter Once Upon—the bedtime companion that brings magical, personalized storytelling to your child. With custom stories crafted around their interests and a library of pre-made tales, Once Upon helps you create cozy, memorable moments without the extra effort.

<p align="center">
<img width="400" alt="mom using once upon" src="https://github.com/user-attachments/assets/f864d58d-a292-49f3-b386-f34e20246264">
</p>

### App Overview
Once Upon uses AI to deliver custom stories based on children’s age and interests. Users can choose between custom story generation, where children input their own ideas, and a library of pre-generated stories. Both options reduce screen time and make bedtime routines more interactive, with options to modify story summaries for a unique touch.

---

### System Architecture

- **[Story Generation Pipeline with Gemini 1.5-pro](https://github.com/cpiantanida12/OnceUpon/blob/master/Frontend/Once-Upon/app/story.jsx):** 
The core of the Once Upon story generator is a multi-step pipeline that dynamically tailors stories based on user inputs. This pipeline involves three main stages: **summary generation, character extraction, and chapter-by-chapter story generation**. The process starts by using Vertex AI's Large Language Model (LLM), Gemini-1.5-pro, which is initialized with high output token limits to support extended storytelling. The LLM first creates a structured summary that includes an introductory hook and three chapter summaries, which is customized for the specified age group of the child.

- Once the summary is generated, we employ a character extraction phase that identifies and describes key characters, adding depth and consistency to the narrative. This phase is supported by a custom prompt and **LangChain-supported LLMChain**, which extracts personalities and behaviors from the story to ensure continuity and enhance the personalization of subsequent chapters. For chapter development, each chapter is expanded based on its outline, with story progression rooted in the characters’ personalities and prior events. This method maintains a cohesive story arc, enriching the storytelling experience for young readers.
- **Interactive Flow:**
The user initiates the story by providing an age range and a story idea, which triggers a series of automated prompts and responses. A **conversational loop** is embedded, allowing users to refine summaries or request a new story, making the experience interactive. **This modular flow is achieved through LLMChain instances for each prompt type (summary, chapter, character extraction) and a final summarization step for a streamlined summary of each generated chapter**. This flexible, prompt-based architecture allows for continuous improvements and fine-tuning based on new ideas or desired variations.
- **Personalized Recommendations:** Age- and theme-based story recommendations via a simple onboarding questionnaire, making each story relevant and engaging.
- **[UI Development in React Native](https://github.com/cpiantanida12/OnceUpon/tree/master/Frontend/Once-Upon):** Child-friendly, interactive UI for seamless navigation on iOS and Android.
- **[Browse Story Page](https://github.com/cpiantanida12/OnceUpon/blob/master/Frontend/Once-Upon/app/(tabs)/browse.jsx):** Theme-organized story library with summaries and custom story creation, allowing creative control.
- **Text-to-Speech (TTS) Integration:** Provides an immersive auditory experience, especially useful for non-readers.
- **[Backend and Data Storage](https://github.com/cpiantanida12/OnceUpon/tree/master/Backend):** Secure backend with minimal data collection, supporting real-time story customization.

---

### What Makes OnceUpon Stand Out?

- **Extended, Immersive Storytelling Beyond Standard LLM Limits:**
Once Upon is able to generate stories to its users that keep them engaged OnceUpon captivates children with stories that go beyond traditional AI-generated content length limits, engaging them in a storytime experience lasting 15 to 20 minutes. By utilizing custom function-calling capabilities, OnceUpon generates narratives that surpass standard token restrictions of large language models (LLMs), achieving story lengths of 8,000 to 10,000 words. This unique approach ensures immersive storytelling that keeps children engaged far longer than typical AI-generated tales.

- **Personalized Story Customization and Interactive Storybuilding:**
OnceUpon allows children and parents to participate in crafting their story’s journey, offering a summary preview before the story begins. Users can opt to proceed with the suggested story, modify elements of the summary, or create an entirely new storyline. This interactive experience fosters creativity, giving readers control over the direction of their adventure while adding a unique, personalized touch to each bedtime tale.

- **Consistent Story Structure with Advanced Prompt Engineering:**
While LLMs are known for creativity, maintaining format consistency across multiple responses can be challenging. To deliver a cohesive and reliable experience, OnceUpon employs sophisticated prompt engineering and structured workflows, resulting in a predictable yet engaging narrative flow for each story. This consistency helps ensure that each story feels intentional and aligned with the high-quality experience children and parents expect.

- **Seamless Narrative Cohesion in Long-Form Stories:**
Managing narrative cohesion in lengthy stories is a well-known challenge for LLMs, as they often struggle with "hallucinations" or diverging details over extended context. OnceUpon tackles this by implementing custom techniques that ensure consistency in story arcs, character development, themes, and plot progression. Extensive experimentation and fine-tuning have resulted in a solution that produces cohesive, sensible, and delightful stories that flow smoothly from beginning to end.

---

### Methodology

1. **[User Onboarding](https://github.com/cpiantanida12/OnceUpon/blob/master/Frontend/Once-Upon/app/signup.jsx):** Simple onboarding gathers age and preferences to tailor stories.
2. **[Story Customization with Summary Modification](https://github.com/cpiantanida12/OnceUpon/blob/master/Frontend/Once-Upon/app/(tabs)/build.jsx):** Stories generated from child’s data, with options for children to preview and adjust summaries.
3. **[Pregenerated Libraries](https://github.com/cpiantanida12/OnceUpon/blob/master/Frontend/Once-Upon/app/(tabs)/browse.jsx):** Pre-generated stories offer modifiable summaries, encouraging creativity and engagement.
4. **Text-to-Speech Implementation:** TTS allows children to listen along, enhancing accessibility and literacy.

---

### Results and Discussion

- **Engagement Metrics:** We used the following engagement metrics and readability scores to ensure our stories meet standards for a particular age group-
  
  *Flesch-Kincaid Grade Level*: Shows the school grade level required to understand the text. Lower scores mean it’s easier to read.
  
  *Gunning Fog Index*: Estimates the years of education needed to easily read the text. Lower scores are simpler.

  *Dale-Chall Score*: Measures readability based on familiar words. Higher scores mean it’s harder to read.

  *Flesch Reading Ease*: Rates readability from 0–100. Higher scores mean it’s easier to read and suitable for a wider audience.

- **Benefits of Personalization:** Customized stories improve interest and connection.
  
- **Challenges:** Balancing language complexity for different ages, narrative coherence, and data privacy considerations.

---

### Conclusion and Future Work

**Findings**: Once Upon effectively combines AI personalization to create age-appropriate, captivating stories. TTS broadens accessibility, making stories enjoyable for all ages.

**Future Enhancements**: Planned upgrades include additional themes, cultural diversity, multiple language options, and improved content moderation to enhance the storytelling experience.

---

### Contact Information

- **Hima Cheruvu:** hima@uchicago.edu  
- **Nia Ganger:** niagangar@uchicago.edu  
- **Christian Piantanida:** cpiantanida@uchicago.edu  
- **Rishika Ravindran:** rrishika@uchicago.edu  
