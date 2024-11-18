from langchain.prompts import PromptTemplate
from langchain.llms import VertexAI
from langchain.chains import LLMChain
import vertexai
from vertexai.preview.generative_models import GenerativeModel, ChatSession
import re

# Initialize Vertex AI
vertexai.init(project='adsp-capstone-once-upon', location='us-central1')
# Initialize the LLM
llm = VertexAI(model_name="gemini-1.5-flash", max_output_tokens=8192, max_tokens=300000)

# Simulated database to hold session data
session_data = {}

# Define prompt templates
summary_prompt_template = PromptTemplate(
    input_variables=["input_prompt", "user_age"],
    template="""
    Generate a complete summary for a 3-chapter story that is engaging for a {user_age}-year-old child. The story should be about: {input_prompt}
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

character_extraction_prompt = PromptTemplate(
    input_variables=["story_text"],
    template="""
    Extract the main characters from the following story text, along with a brief description of their personalities and behaviors:

    {story_text}

    Format your response as a list of characters, each with a short description:
    - Character Name: Brief description of personality and behavior
    """
)

# Define the Gemini-based summarization prompt
chapter_summary_prompt_template = PromptTemplate(
    input_variables=["chapter_text"],
    template="""
    Summarize the following chapter text in 100-150 words:

    {chapter_text}
    """
)

# LLM Chains
summary_chain = LLMChain(llm=llm, prompt=summary_prompt_template)
chapter_chain = LLMChain(llm=llm, prompt=chapter_prompt_template)
character_extraction_chain = LLMChain(llm=llm, prompt=character_extraction_prompt)
chapter_summary_chain = LLMChain(llm=llm, prompt=chapter_summary_prompt_template)

# Functions
def generate_summary(input_prompt, user_age):
    summary = summary_chain.run(input_prompt=input_prompt, user_age=user_age)
    return summary

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

def extract_characters(input_story):
    characters = character_extraction_chain.run(story_text=input_story)
    return characters

def summarize_chapter(chapter_text):
    summary = chapter_summary_chain.run(chapter_text=chapter_text)
    return summary

# Stateless API functions
def start_story(input_prompt, user_id, user_age):
    session_id = user_id
    summary = generate_summary(input_prompt, user_age)
    
    # Save the summary in "database" (session data)
    session_data[session_id] = {
        "user_age": user_age,
        "summary": summary,
        "chapters": [],
        "modifications": 0
    }
    
    return summary

def generate_chapter_api(session_id, chapter_number):
    session = session_data.get(session_id)
    if not session:
        return {"error": "Invalid session ID"}
    
    # Retrieve summary and other session data
    user_age = session["user_age"]
    summary_text = session["summary"]
    previous_chapters = session["chapters"]
    
    # Split the summary to get each chapter outline
    chapters = re.split(r'Chapter \d+:', summary_text)[1:]
    if len(chapters) != 3:
        return {"error": "The summary does not contain exactly 3 chapters."}
    
    chapter_summary = chapters[chapter_number - 1].strip()
    chapter_title = f"Chapter {chapter_number}: {chapter_summary.splitlines()[0]}"
    
    if chapter_number == 1:
        previous_summary = ""
        characters = ""
    else:
        previous_summary = "\n".join([summarize_chapter(chap) for chap in previous_chapters])
        characters = extract_characters(previous_summary)
    
    chapter_text = generate_chapter(
        chapter_title=chapter_title,
        previous_summary=previous_summary,
        chapter_summary=chapter_summary,
        characters=characters,
        chapter_number=chapter_number,
        user_age=user_age
    )
    
    # Summarize and save chapter text
    chapter_summary = summarize_chapter(chapter_text)
    session["chapters"].append(f"{chapter_title}\n\n{chapter_text}")
    
    return {"chapter_text": chapter_text, "chapter_summary": chapter_summary, "characters": characters}

def continue_story(session_id):
    session = session_data.get(session_id)
    if not session:
        return {"error": "Invalid session ID"}
    
    # Combine chapters with titles and numbers in the full story
    chapters_text = "\n\n".join(session["chapters"])
    session_data[session_id] = {}
    return chapters_text

def modify_summary(session_id, modification_request):
    existing_summary = session_data[session_id]["summary"]
    user_age = session_data[session_id]["user_age"]
    # Uses an LLM to adjust the summary according to the modification request
    modification_prompt_template = PromptTemplate(
        input_variables=["existing_summary", "modification_request", "user_age"],
        template="""
        Based on the story summary provided below, make the following modifications:
        Existing Summary: {existing_summary}
        Modification Request: {modification_request}
        The modified story should still be appropriate for a {user_age}-year-old child.
        Return only the modified story summary.
        """
    )
    modification_chain = LLMChain(llm=llm, prompt=modification_prompt_template)
    modified_summary = modification_chain.run(existing_summary=existing_summary, modification_request=modification_request, user_age=user_age)
    session_data[session_id]["summary"] = modified_summary
    session_data[session_id]["modifications"] = session_data[session_id]["modifications"] + 1
    return modified_summary

def clear_session(session_id):
    session_data[session_id] = {}

# Interactive Loop to input the prompt and confirm the summary
def interactive_main(user_age, current_prompt=None, current_summary=None, session_id=None):
    # If no current summary exists, initialize the story prompt and generate the initial summary
    if current_summary is None:
        # Get the initial prompt from the user
        current_prompt = input("Enter the story prompt: ")
        summary_response = start_story(current_prompt, user_age)
        session_id = summary_response["session_id"]
        current_summary = summary_response["summary"]
    
        # Print the current summary and ask for user confirmation
        print("\nCurrent Story Summary:")
        print(current_summary)
    
    modify_or_continue = input("\nAre you happy with this summary? (yes/no): ").strip().lower()

    if modify_or_continue == "no":
        # Ask if they want a completely new story or just modify the existing one
        question = input("Do you want a new story or make changes to this storyline? (NEW STORY/MODIFY): ").strip().upper()
        
        if question == "MODIFY":
            # Get modification request and adjust the summary based on it
            modification_request = input("\nDescribe the changes you want to make to the storyline: ")
            modified_summary_response = modify_summary(current_summary, modification_request, user_age)
            modified_summary = modified_summary_response["summary"]
            
            # Print modified summary and ask if user is satisfied
            print("\nModified Story Summary:")
            print(modified_summary)
            
            # Recursive call with modified summary for further confirmation
            return interactive_main(user_age, current_prompt, modified_summary, session_id)
        
        elif question == "NEW STORY":
            # Start over with a new prompt by recursively calling the main function
            print("Restarting with new story prompt...")
            return interactive_main(user_age)

    # Generate chapters if user is happy with the summary
    for chapter_number in range(1, 4):
        chapter_response = generate_chapter_api(session_id, chapter_number)
        # print(f"\nChapter {chapter_number} Text:")
        # print(chapter_response["chapter_text"])
        # print(f"\nChapter {chapter_number} Summary:")
        # print(chapter_response["chapter_summary"])

    # Compile and display the full story
    full_story_response = continue_story(session_id)
    print("\nFull Story:")
    print(full_story_response["full_story"])