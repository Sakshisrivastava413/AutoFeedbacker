from flask import request, Flask
import json
from image_analyser import analyse_image
from text_analyser import analyse_text, text_checker
from face_comparison import compare_faces
from utils.image_conversion import create_image_from_base64
from text_similarity import get_text_similarity
from eye_tracking import track_eye
from flask_restful import Resource, Api

#application = app = Flask(__name__)
application = Flask(__name__)

api = Api(application)

class Analysed(Resource):
  def get(self):
    return{'AI API' : 'analysed.in'}

api.add_resource(Analysed, '/')

@application.route('/analyse_image', methods=['GET', 'POST'])
def analyse_image_route():
  data = request.get_json(force=True)
  if data is None:
    return "No data"
  create_image_from_base64(data['image'], './images/uploaded_img.png')
  res = analyse_image('./images/uploaded_img.png')
  return json.dumps(res)


@application.route('/analyse_text', methods=['GET', 'POST'])
def analyse_text_route():
  data = request.get_json(force=True)
  if data is None:
    return "No data"
  return analyse_text(data['text'])


@application.route('/compare_faces', methods=['GET', 'POST'])
def compare_faces_route():
  data = request.get_json(force=True)
  if data is None:
    return "No data"
  
  path1 = './images/uploaded_face1_img.png'
  path2 = './images/uploaded_face2_img.png'
  create_image_from_base64(data['face1'], path1)
  create_image_from_base64(data['face2'], path2)
  result = 1 if compare_faces(path1, path2) == True else 0
  
  print(result)
  return json.dumps({
    'match': result
  })


@application.route('/text_similarity', methods=['GET', 'POST'])
# @cross_origin()
def text_similarity_route():
  data = request.get_json(force=True)
  if data is None:
    return "No data"
  
  text1, text2 = data['text1'], data['text2']

  return json.dumps({
    'similarity_percent': get_text_similarity(text1, text2)
  })

@application.route('/text_checker', methods=['GET', 'POST'])
def text_checker_route():
  data = request.get_json(force=True)
  if data is None:
    return "No data"
  
  text = data['text']

  return json.dumps({
    'data': text_checker(text)
  })

@application.route('/eye_detect', methods=['GET', 'POST'])
def eye_detect_route():
  data = request.get_json(force=True)
  if data is None:
    return "No data"

  create_image_from_base64(data['image'], './images/eye_image.png')
  return json.dumps(track_eye('./images/eye_image.png'))


# print('Server ready to receive requests')