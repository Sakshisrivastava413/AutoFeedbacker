from nltk.sentiment.vader import SentimentIntensityAnalyzer
from gingerit.gingerit import GingerIt
import json

sid = SentimentIntensityAnalyzer()
parser = GingerIt()

def analyse_text(message_text):
  # Calling the polarity_scores method on sid and passing in the message_text outputs a dictionary with negative, neutral, positive, and compound scores for the input text
  scores = sid.polarity_scores(message_text)
  return json.dumps(scores)

def text_checker(text):
  return parser.parse(text)

# print(analyse_text('we have a good response for facial recognition'));