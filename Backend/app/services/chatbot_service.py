from langchain.prompts import PromptTemplate
from langchain.llms import VertexAI
from langchain.chains import LLMChain
import vertexai
from vertexai.preview.generative_models import GenerativeModel
import re
from transformers import pipeline

vertexai.init(project='adsp-capstone-once-upon', location = 'us-central1')
llm = VertexAI(model_name="gemini-1.0-pro", max_output_tokens=8192, max_tokens = 32000)
summarizer = pipeline("summarization")

# Define prompt template for the summary
summary_prompt_template = PromptTemplate(
    input_variables=["input_prompt", "user_age"],
    template="""
    Generate a complete summary for a 3-chapter story that is engaging and appropriately written for a {user_age}-year-old child. The story should be about: {input_prompt}
    Your response must include:
    1. A brief introduction to the story
    2. Chapter 1 summary (at least 100 words)
    3. Chapter 2 summary (at least 100 words)
    4. Chapter 3 summary (at least 100 words)
    Format your response as follows:
    Story Introduction: [Your introduction here]
    Chapter 1: [Title]
    [Chapter 1 summary]
    Chapter 2: [Title]
    [Chapter 2 summary]
    Chapter 3: [Title]
    [Chapter 3 summary]
    Ensure each chapter summary is complete and shows a clear progression of the story.
    """
)

# Create LLMChain for summary generation
summary_chain = LLMChain(llm=llm, prompt=summary_prompt_template)

def generate_summary(input_prompt, user_age):
    while True:
        summary = summary_chain.run(input_prompt=input_prompt, user_age=user_age)
        return summary

modifications_prompt_template = PromptTemplate(
    input_variables=["user_modifications", "user_age", "prev_summary", "chat_history"],
    template="""
    Generate a complete summary for a 3-chapter story that is engaging and appropriately written for a {user_age}-year-old child. The story should be strictly based off of this other story summary: {prev_summary}
    Please take that old summary and generate a new summary that implements these changes: {user_modifications}
    Also, here is the chat history of your exchange with them so you can keep their desired story modifications consistent: {chat_history}
    Your response must include:
    1. A brief introduction to the story
    2. Chapter 1 summary (at least 100 words)
    3. Chapter 2 summary (at least 100 words)
    4. Chapter 3 summary (at least 100 words)
    Format your response as follows:
    Story Introduction: [Your introduction here]
    Chapter 1: [Title]
    [Chapter 1 summary]
    Chapter 2: [Title]
    [Chapter 2 summary]
    Chapter 3: [Title]
    [Chapter 3 summary]
    Ensure each chapter summary is complete and shows a clear progression of the story.
    """

# Create LLMChain for summary generation
modifications_chain = LLMChain(llm=llm, prompt=modifications_prompt_template)
    
def generate_modified_summary:(user_modifications, user_age, prev_summary, chat_history):
    summary = modifications_chain.run(user_modifications=user_modifications, user_age=user_age, prev_summary, chat_history)
    return summary

# Define updated prompt template for chapter generation
chapter_prompt_template = PromptTemplate(
    input_variables=["chapter_title", "previous_summary", "chapter_summary", "characters", "chapter_number", "user_age"],
    template=(
        "This is the outline for the chapter: Title: {chapter_title}.\n"
        "Summary of previous chapters: {previous_summary}.\n"
        "Summary for this chapter: {chapter_summary}.\n"
        "Characters and their associated personalities and behaviors so far: {characters}.\n"
        "Based on this outline, generate a LENGTHY chapter {chapter_number} of AT LEAST 1000 WORD TOKENS. "
        "The story should be written in PARAGRAPHS (not bullet points) and fit for a {user_age}-year-old kid in English. "
        "Please ensure the chapter has AT LEAST 1000 words and does not include any additional notes. "
        "Overall, the total number of tokens should be less than 8000 tokens (all characters included)."
    )
)

# Create LLMChain for chapter generation
chapter_chain = LLMChain(llm=llm, prompt=chapter_prompt_template)

def generate_chapter(chapter_title, previous_summary, chapter_summary, characters, chapter_number, user_age):
    chapter = chapter_chain.run(
        chapter_title=chapter_title,
        previous_summary=previous_summary,
        chapter_summary=chapter_summary,
        characters=characters,
        chapter_number=chapter_number,
        user_age=user_age
    )
    return chapter

# Add this new prompt template for character extraction
character_extraction_prompt = PromptTemplate(
    input_variables=["story_text"],
    template="""
    Extract the main characters from the following story text, along with a brief description of their personalities and behaviors:

    {story_text}

    Format your response as a list of characters, each with a short description:
    - Character Name: Brief description of personality and behavior
    """
)

# Create LLMChain for character extraction
character_extraction_chain = LLMChain(llm=llm, prompt=character_extraction_prompt)

# Add character extraction function
# Update the extract_characters function
def extract_characters(input_story):
    characters = character_extraction_chain.run(story_text=input_story)
    return characters

def generate_story_in_chapters(summary_object, user_age):
    chapters = re.split(r'Chapter \d+:', summary_object)[1:]
    if len(chapters) != 3:
        raise ValueError("The summary does not contain exactly 3 chapters.")
    
    chapter_structures = [f"Chapter {i+1}:{chapter}" for i, chapter in enumerate(chapters)]
    
    # Generate Chapter 1
    chapter1 = generate_chapter(chapter_structures[0].split(':')[1].strip(), "", chapters[0], "", 1, user_age)
    characters = extract_characters(chapter1)
    chapter1_summary = summarizer(chapter1, max_length=150, min_length=30, do_sample=False)[0]['summary_text']
    
    # Generate Chapter 2
    chapter2 = generate_chapter(chapter_structures[1].split(':')[1].strip(), chapter1_summary, chapters[1], characters, 2, user_age)
    chapter2_summary = summarizer(chapter2, max_length=150, min_length=30, do_sample=False)[0]['summary_text']
    
    # Generate Chapter 3
    previous_summary = f"Chapter 1: {chapter1_summary}\nChapter 2: {chapter2_summary}"
    chapter3 = generate_chapter(chapter_structures[2].split(':')[1].strip(), previous_summary, chapters[2], characters, 3, user_age)
    
    return chapter1, chapter2, chapter3