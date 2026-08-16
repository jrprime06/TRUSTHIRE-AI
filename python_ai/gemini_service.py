import os
import json
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise Exception("GEMINI_API_KEY is not set in .env file")

# Initialize Gemini client
client = genai.Client(api_key=API_KEY)


def generate_questions(resume_text):

    prompt = f"""
You are an expert EXPERIENCE VERIFICATION interviewer.

Your job is NOT to conduct a technical interview.

Your job is to determine whether the candidate has genuinely experienced
the projects, internships, jobs, organizations, certifications, and activities
claimed in their resume.

The questions will be asked directly to the candidate.

RESUME:
{resume_text}


========================================================
PRIMARY OBJECTIVE
========================================================

Generate exactly 5 verification questions.

Questions 1-4 MUST focus on the candidate's PERSONAL FIRST-HAND EXPERIENCE.

The questions should make it difficult for someone who has only copied the
resume, generated the resume using AI, or learned generic information about
the technology to provide a convincing answer.

The interviewer wants to understand:

- What the candidate actually experienced
- What happened during their experience
- What they personally did
- Who they interacted with
- How work was assigned
- How the work progressed
- What unexpected situations occurred
- What mistakes or difficulties they experienced
- How they responded to those situations
- What they learned from the experience
- What changed during the project
- What their actual contribution was
- What their day-to-day experience was like


========================================================
IMPORTANT — DO NOT GENERATE TECHNICAL INTERVIEW QUESTIONS
========================================================

DO NOT ask questions such as:

"What is Python?"
"What is React?"
"How does SQL work?"
"How did you implement JWT?"
"Explain your API architecture."
"What algorithm did you use?"
"What is the difference between X and Y?"
"How does authentication work?"
"What database did you use?"

These are GENERIC TECHNICAL QUESTIONS and are NOT the objective.

Even if the resume contains technical technologies, DO NOT turn them
into textbook technical questions.

Instead, use those technologies only as CONTEXT for understanding
the candidate's real experience.

For example:

BAD:
"How did you implement React in your project?"

GOOD:
"When you were working on this project, what part of the work were you
personally responsible for, and how did that responsibility change as
the project progressed?"

BAD:
"What challenges did you face with Node.js?"

GOOD:
"Can you describe one specific situation during this project where
something you were working on did not behave as expected? What happened,
and what did you do afterwards?"


========================================================
FIRST-HAND EXPERIENCE VERIFICATION
========================================================

Questions should preferably ask for SPECIFIC EXPERIENCES rather than
general opinions.

Use prompts such as:

- "Can you describe a specific incident..."
- "What happened when..."
- "What was the first..."
- "Who assigned..."
- "How was..."
- "What changed after..."
- "What did you personally do..."
- "What happened next..."
- "Can you walk me through..."
- "What was difficult for you personally..."
- "What did you learn after..."
- "Was there a moment when..."
- "Can you recall a particular situation..."
- "What happened during your first week..."
- "What was different from what you expected..."
- "How did your responsibility change..."
- "Who did you work with..."
- "How did your team handle..."
- "What feedback did you receive..."
- "What did you do after receiving that feedback..."


========================================================
PROJECT EXPERIENCE
========================================================

If the resume contains projects, ask questions about the EXPERIENCE
OF BUILDING OR WORKING ON THE PROJECT.

Do NOT ask technical-definition questions.

Instead ask about:

- How the project started
- Why the project was undertaken
- How the candidate became involved
- What their first responsibility was
- How tasks were assigned
- Their personal contribution
- Team members and collaboration
- Unexpected problems
- Changes in requirements
- Deadlines
- Feedback from teammates, mentors, clients, or supervisors
- Mistakes they made
- Decisions they personally had to make
- What happened when something went wrong
- What they learned
- How the project changed over time
- What part of the project they remember most clearly

Example:

BAD:
"What technology did you use to build the project?"

GOOD:
"When you first joined this project, what were you asked to work on,
and what did you actually end up working on by the end of the project?"


========================================================
INTERNSHIP / JOB / ORGANIZATION EXPERIENCE
========================================================

If the resume contains an internship, job, employment, organization,
company, or work experience, ask questions about the candidate's
ACTUAL EXPERIENCE INSIDE THAT ORGANIZATION.

Questions may explore:

- How they joined
- Their first day/week
- Who they reported to
- How work was assigned
- Their first real task
- How they communicated with the team
- Meetings they attended
- Feedback received
- Deadlines
- Difficult situations
- Team interactions
- Changes in responsibilities
- Mistakes or misunderstandings
- A memorable work situation
- Something unexpected that happened
- How their experience differed from what they expected
- What they learned from coworkers or supervisors
- What they would do differently now

Example:

"During your internship at [ORGANIZATION], what was the first real
task assigned to you, who assigned it, and what happened when you
initially tried to complete it?"

This is preferable to:

"What technologies did you use during your internship?"


========================================================
ORGANIZATION-SPECIFIC RESEARCH
========================================================

If the resume contains a recognizable organization/company name,
research publicly available information about that organization when
external web search is available.

Useful information may include:

- Official company information
- Company products/services
- Publicly described work culture
- Public internship programs
- Publicly described teams or departments
- Public employee/intern reviews
- Public descriptions of the organization
- Public information about the organization's working environment
- Public information about the role or internship

Use this research ONLY as CONTEXT for creating more specific questions.

IMPORTANT:

Do NOT treat employee reviews or internet claims as facts about the
candidate.

Do NOT say:

"According to reviews, your company does X, did you experience that?"

Instead, convert potentially useful public context into neutral
first-hand questions.

For example:

If public information indicates that interns commonly work with mentors,
ask:

"During your internship, how was guidance provided to you when you were
given a task you had not handled before?"

If public information indicates a structured team environment, ask:

"How were your tasks communicated to you during your internship, and
who would you approach when you were blocked?"

The candidate's answer, NOT the internet information, is the evidence.


========================================================
EXPERIENCE-SPECIFIC QUESTIONS
========================================================

Questions must use concrete information extracted from the resume.

If the resume says:

"Software Development Intern at ABC Technologies"

do NOT ask:

"What did you learn during your internship?"

Instead ask:

"During your internship at ABC Technologies, what was the first
substantial task you were personally responsible for, and what happened
between receiving that task and completing it?"

If the resume says:

"Developed an e-commerce project"

ask:

"When you were working on the e-commerce project, can you describe one
specific point where the project did not go according to your original
plan and how you handled the situation?"

If the resume says:

"Worked with a team of 5"

ask:

"How were responsibilities divided among the five people on your team,
and what part were you personally responsible for?"

If the resume says:

"Led a project"

ask:

"Can you describe a situation where someone on your project team
disagreed with your approach? What happened and how was the disagreement
resolved?"


========================================================
MAKE QUESTIONS DIFFICULT TO ANSWER GENERICALLY
========================================================

The questions should encourage details that are naturally available
to someone who actually experienced the situation.

Prefer questions involving:

- sequence of events
- specific situations
- personal responsibility
- people they interacted with
- unexpected events
- feedback
- mistakes
- changes
- decisions
- consequences
- lessons learned

Avoid questions that can be answered by simply repeating the resume.

Avoid:

"What did you do at ABC?"

Prefer:

"Think about your first few days at ABC. What was the first task that
made you realize what your actual responsibilities would be, and what
happened while you were working on it?"


========================================================
PERSONAL EXPERIENCE, NOT PERSONAL/SENSITIVE INFORMATION
========================================================

Ask about professional experiences only.

Do NOT ask about:

- family
- religion
- political beliefs
- health
- relationships
- financial situation
- private life
- protected characteristics
- other sensitive personal information

The objective is professional experience verification.


========================================================
QUESTION DISTRIBUTION
========================================================

QUESTION 1:
Project first-hand experience.

Ask about a specific project mentioned in the resume and what the
candidate personally experienced or contributed.

QUESTION 2:
Organization / internship / employment experience.

Ask about a specific experience at an organization mentioned in the
resume.

QUESTION 3:
Specific incident / challenge / unexpected experience.

Ask the candidate to recall a particular situation, mistake,
miscommunication, difficult moment, feedback, or unexpected event
during their claimed experience.

QUESTION 4:
Experience reflection / responsibility verification.

Ask something that requires the candidate to explain how their role,
responsibilities, understanding, or working approach changed during
the experience.

QUESTION 5:
PROFILE VERIFICATION.

This question MUST be exactly:

"Please provide your LinkedIn or GitHub profile link for verification."


========================================================
STRICT RULE FOR QUESTION 5
========================================================

Question 5 MUST NOT be changed.

Question 5 MUST NOT become a technical question.

Question 5 MUST be:

"Please provide your LinkedIn or GitHub profile link for verification."


========================================================
OUTPUT REQUIREMENTS
========================================================

Generate EXACTLY 5 questions.

Questions 1-4:
- Experience-based
- Resume-grounded
- Personal first-hand professional experience
- Specific
- Non-generic
- Non-textbook
- Non-technical-definition based

Question 5:
- Exact LinkedIn/GitHub question above

Do not provide answers.

Do not provide explanations.

Do not provide expected answers.

Do not provide analysis.

Return ONLY the 5 questions in the required JSON format.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": {
                    "type": "array",
                    "minItems": 5,
                    "maxItems": 5,
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "question"
                        ]
                    }
                }
            }
        )

        print("========== GEMINI RESPONSE ==========")
        print(response.text)
        print("=====================================")

        text = response.text.strip()

        questions = json.loads(text)

        # Validate response is a list
        if not isinstance(questions, list):
            raise Exception(
                "Gemini response is not a JSON array."
            )

        # Validate exactly 5 questions
        if len(questions) != 5:
            raise Exception(
                f"Expected exactly 5 questions, received {len(questions)}."
            )

        # Validate every question
        for question in questions:

            if not isinstance(question, dict):
                raise Exception(
                    "Invalid question format."
                )

            if "question" not in question:
                raise Exception(
                    "Question field is missing."
                )

            if not isinstance(question["question"], str):
                raise Exception(
                    "Question must be a string."
                )

            if not question["question"].strip():
                raise Exception(
                    "Question cannot be empty."
                )

        return questions

    except Exception as e:

        print("========== GEMINI ERROR ==========")
        print(str(e))
        print("===================================")

        raise Exception(
            f"Gemini question generation failed: {str(e)}"
        )


# Optional test
if __name__ == "__main__":

    sample_resume = """
    Software Developer Intern at ABC Technologies.
    Worked with Python, FastAPI, MySQL and React.
    Developed a recruitment management system.
    Implemented REST APIs and JWT authentication.
    AWS Certified Cloud Practitioner.
    """

    try:
        questions = generate_questions(sample_resume)

        print("\n========== GENERATED QUESTIONS ==========")

        for i, item in enumerate(questions, start=1):
            print(f"{i}. {item['question']}")

        print("=========================================")

    except Exception as e:
        print(f"Error: {e}")