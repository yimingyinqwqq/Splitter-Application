import pytesseract
import cv2

# Get the original photo
original = cv2.imread('./backend/cv_model/test2_clip.png')

# use tesseract interface to get the text information
options = "--psm 4"
pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'

# naive way get the text result by ocr

results = ((pytesseract.image_to_string(original,
	config=options, lang='eng'))).split('\n')

# a very simple manipulation of the texts
# assume all items' last column is prices, which is a digit
# May think about more stratergies in the future
items = []

for line in results:
    line_test = line
    line_test.split(' ')

    if len(line_test) > 0 and (line_test[-1]).isnumeric():
        items.append(line)

print(items)