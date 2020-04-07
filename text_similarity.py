from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
 
stopWords = set(stopwords.words('english'))

def get_filtered(text):
  wordsFiltered = []
  words = word_tokenize(text)
  for w in words:
      if w not in stopWords:
          wordsFiltered.append(w)
  return wordsFiltered

def get_text_similarity(text1, text2):
  words1, words2 = get_filtered(text1), get_filtered(text2)
  sim, diff = 0, 0
  if len(words2) > len(words1):
    words2, words1 = words1, words2

  for word in words1:
    if word in words2:
      sim += 1
    else:
      diff += 1
  return sim / (sim + diff)

# For testing
# get_text_similarity('Javascript is pretty good dynamic language', 'Javascript is an awesome language which is dynamic')