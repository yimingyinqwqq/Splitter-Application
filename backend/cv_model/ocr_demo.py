import pytesseract
import cv2

# Get the original photo
original = cv2.imread('test_clip.png')
# use tesseract interface to get the text information
options = "--psm 4"
pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'

# naive way get the text result by ocr

results = ((pytesseract.image_to_string(original,
	config=options, lang='eng'))).split('\n')

for i in results:
    temp = i.split(' ')
    if len(temp) >= 3:
        print(temp[0], '*', temp[1], '*'+temp[2])
items = []

for line in results:
    line_test = line
    line_test.split(' ')

    if len(line_test) > 0 and (line_test[-1]).isnumeric():
        items.append(line)
