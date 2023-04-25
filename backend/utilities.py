'''
Assume the input list follows [index, char, char, ..., count, unit price]

'''

def parsing_lang(splited_list):
    result = []

    for token in splited_list:
        skip_count = 0
        if token.isnumeric():
            skip_count += 1
            if skip_count == 1:
                continue
            else:
                result.append(token)
                if skip_count == 3:
                    break
        else:
            result.append(token)
    return result

        