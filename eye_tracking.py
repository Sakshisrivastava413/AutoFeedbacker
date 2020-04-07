import cv2

eye_Cascade_File = cv2.CascadeClassifier('./models/haarcascade_eye.xml')
face_Cascade_File = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')

def track_eye(image_path):
    # image_path = '../my-photo.jpg'
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # convering to gray to recognize colour change effectively
    faces = face_Cascade_File.detectMultiScale(gray, 1.3, 5)  # geometry
    for (x, y, w, h) in faces:  # draw rectangle around using x,y,w,h coordinates
        roi_gray = gray[y:y + h, x:x + w]  # eye inside region of image ROI i,e gray--face
        roi_colour = img[y:y + h, x:x + h]

        eyes = eye_Cascade_File.detectMultiScale(roi_gray)
        eyes_ar = []
        for (ex, ey, ew, eh) in eyes:  # eye width , height length parameters
            cv2.rectangle(roi_colour, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
            # print(len(eyes))
            eyes_ar.append({ 'x': str(ex), 'y': str(ey), 'width': str(ew), 'height': str(eh) })
        if len(eyes_ar) == 0:
          return { 'error': "No eyes found!" }
        else:
          return { 'eyes': eyes_ar }


