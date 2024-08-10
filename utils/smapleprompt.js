export const samplePrompt = `  i will give question and answer of patient you have to pridict the chanse of colorectal cancer based on symtomps dicribed by the patient and you have to give your answer  between  1% to 100% range  and 
and give the reason why and how to come to that range 
 Expected output example: {chances  : 30% to 40% , reason :"because you have rectal bleeding , and other 1 , other2 }

    Do not add any conversational words in the response, keep verbosity as low as possible, just return the required dictionary

[
  // Symptoms
  {
    question: "Have you experienced any changes in your bowel habits, such as diarrhea, constipation, or narrowing of the stool, that lasts for more than a few days?",
    answer: "Yes"
  },
  {
    question: "Do you have any rectal bleeding or blood in your stool?",
    answer: "Occasionally"
  },
  {
    question: "Have you noticed any persistent abdominal discomfort, such as cramps, gas, or pain?",
    answer: "Yes, occasionally"
  },
  {
    question: "Do you feel as though your bowel does not empty completely after a bowel movement?",
    answer: "Yes"
  },
  {
    question: "Have you experienced any unexplained weight loss?",
    answer: "No"
  },
  {
    question: "Are you experiencing any fatigue or weakness?",
    answer: "Yes"
  },
  {
    question: "Have you noticed any changes in stool color or consistency?",
    answer: "Yes"
  },

  // Risk Factors
  {
    question: "Are you over the age of 50?",
    answer: "Yes"
  },
  {
    question: "Do you have a personal history of colorectal polyps or colorectal cancer?",
    answer: "No"
  },
  {
    question: "Do you have a family history of colorectal cancer or polyps?",
    answer: "Yes, one close relative"
  },
  {
    question: "Have you been diagnosed with inflammatory bowel disease, such as ulcerative colitis or Crohn's disease?",
    answer: "No"
  },
  {
    question: "Do you have a genetic syndrome such as familial adenomatous polyposis (FAP) or Lynch syndrome?",
    answer: "No"
  },
  {
    question: "Do you follow a diet high in red meat and processed meats?",
    answer: "Yes"
  },
  {
    question: "Do you consume a low-fiber diet?",
    answer: "Sometimes"
  },
  {
    question: "Do you consume alcohol regularly?",
    answer: "Yes, socially"
  },
  {
    question: "Do you smoke or have you ever smoked?",
    answer: "Yes, used to smoke"
  },
  {
    question: "Are you overweight or obese?",
    answer: "Yes"
  },
  {
    question: "Do you have a sedentary lifestyle with little physical activity?",
    answer: "No, moderate activity"
  },

  // Additional Considerations
  {
    question: "Have you ever had radiation therapy directed at the abdomen or pelvic area to treat a previous cancer?",
    answer: "No"
  },
  {
    question: "Have you experienced any persistent nausea or vomiting?",
    answer: "No"
  },
  {
    question: "Do you experience any swelling or bloating in the abdomen?",
    answer: "Yes, occasionally"
  },
  {
    question: "Have you undergone any recent colonoscopies or other colorectal screenings?",
    answer: "No"
  }
];`


export const sample_dite_prompt = `

i will give ans and question based on that pridcit the deficiancy of ther person and example output  [{deficiency : vitamin D , improvment_tip : " , or pill " , vegen_option: "take more sunbath" } ] Do not add any conversational words in the response, keep verbosity as low as possible, just return the required dictionary


{
    "questions": [
      {
        "question": "How many meals do you typically eat in a day?",
        "answer": 3
      },
      {
        "question": "How often do you consume fruits and vegetables?",
        "answer": "A few times a week"
      },
      {
        "question": "What is your primary source of protein?",
        "answer": "Meat"
      },
      {
        "question": "How often do you consume whole grains (e.g., brown rice, whole wheat, oats)?",
        "answer": "A few times a week"
      },
      {
        "question": "How often do you eat processed foods or fast food?",
        "answer": "A few times a week"
      },
      {
        "question": "Do you regularly consume dairy products? If yes, which types?",
        "answer": "Yes, mostly milk and yogurt"
      },
      {
        "question": "How much water do you drink per day (in liters)?",
        "answer": 2
      },
      {
        "question": "Do you consume any dietary supplements? If yes, which ones?",
        "answer": "Yes, vitamin D supplements"
      },
      {
        "question": "How often do you consume sugary snacks or beverages?",
        "answer": "A few times a week"
      },
      {
        "question": "How often do you consume foods rich in Omega-3 fatty acids (e.g., fatty fish, flaxseeds)?",
        "answer": "Rarely"
      },
      {
        "question": "Do you have any dietary restrictions (e.g., vegetarian, vegan, gluten-free)?",
        "answer": "No"
      },
      {
        "question": "Do you feel fatigued or low in energy throughout the day?",
        "answer": "Sometimes"
      },
      {
        "question": "How often do you consume foods rich in iron (e.g., red meat, spinach, lentils)?",
        "answer": "A few times a week"
      },
      {
        "question": "How often do you consume foods rich in calcium (e.g., dairy products, leafy greens)?",
        "answer": "Daily"
      },
      {
        "question": "Do you consume foods fortified with vitamins or minerals (e.g., fortified cereals, plant-based milk)?",
        "answer": "No"
      },
      {
        "question": "Do you consume alcohol? If yes, how often?",
        "answer": "Rarely"
      },
      {
        "question": "Do you smoke or have you ever smoked?",
        "answer": "No, never"
      },
      {
        "question": "How often do you engage in physical activity?",
        "answer": "A few times a week"
      },
      {
        "question": "Do you have any known food allergies or intolerances?",
        "answer": "No"
      },
      {
        "question": "Do you feel that your diet provides enough variety and balance?",
        "answer": "Mostly"
      }
    ]
  }
  




`



