def is_float(string):
    if string.replace(".", "").isnumeric():
        return True
    else:
        return False


'''
Assume the input list follows [index, char, char, ..., count, unit price]

'''

def parsing_lang(splited_list):
    result = []

    # filter rows that are not items
    if not splited_list[0].isnumeric():
        return None
    
    itemName = ""
    for token in splited_list:
        if not is_float(token):
            itemName = itemName + " " + token
        else:
            result.append(token)
    result.pop(0)
    result.insert(0, itemName)
        
    return result

        