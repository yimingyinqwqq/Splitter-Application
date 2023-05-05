def even_splitter(total_amount, balance_dict, payer, me):
    '''
    parameters:
    total_amount: total amount of the bill [double type], 
    balance_dict: a dictionary of balance info, where keys are all people, values are each person's balance [dictionary type with string key and double value],
    payer: the person who pays the bill [string type],
    me: the person who uses the app [string type],

    return:
    output_dict: a dictionary of the updated balance info with the same format as balance_dict [dictionary type with string key and double value]

    example:
    >>>even_splitter(600, {tom:0, jeff:0, cat:0}, jeff, jeff)
    {'tom': 200.0, 'cat': 200.0}
    
    >>>even_splitter(600, {tom:0, jeff:0, cat:0}, tom, jeff)
    {'tom': -200, 'cat': 0.0}
    '''
    split_money = total_amount / len(balance_dict)

    output_dict = {}

    if payer == me:
        for person in balance_dict.keys():
            if person != me:
                output_dict[person] = balance_dict[person] + split_money
    else:
        for person in balance_dict.keys():
            if person == payer:
                output_dict[person] = balance_dict[person] - split_money
            elif person != me:
                output_dict[person] = balance_dict[person]

    return output_dict


    
    
