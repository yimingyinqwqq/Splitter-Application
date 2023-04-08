'''
When you need to split a bill among a group of people, you will typically need 
to calculate the following:

1. Total amount of the bill: This is the sum of all the items on the bill, including 
tax and tip (if applicable).
2. Number of people: This is the total number of individuals who will be splitting the bill.
Subtotal per person: Divide the total amount of the bill by the number of people to 
determine the subtotal that each person will need to pay.
3. Tip per person (optional): If the group decides to leave a tip, divide the total tip 
amount by the number of people to determine the tip amount per person.
4. Final total per person: Add the subtotal per person and the tip per person (if applicable) 
to determine the final total amount that each person will need to pay.
It's worth noting that if the group decides to split the bill unevenly, you will need to 
calculate the amount owed by each person based on the items they ordered, rather than simply 
dividing the bill equally.
'''

def even_splitter(total_amount, people_list, tip_amount = 0):
    '''
    this function takes three inputs: total_amount, num_people, even_tip, and outputs the amount
    of money for each person

    parameters:
    total_amount: total amount of the bill [double type], 
    people_list: a list of people to split the bill [list type with integer objects], 
    tip_amount: if we have tip, we evenly split the tip

    example:
    >>>even_splitter(678, [tom, jeff, cat], 33)
    237
    >>>even_splitter(678, [tom, jeff, cat])
    226
    '''
    output = (total_amount + tip_amount)/ len(people_list)
    return output

def non_even_splitter(order_dict, people_list, tip_amount = 0):
    '''
    this function takes three inputs: total_amount, num_people, even_tip, and outputs the dictionary
    recording the money to pay for each person

    parameters:
    order_dict: the dictionary recording the orderer and dish price [dictionary], 
    people_list: a list of people to split the bill [list type with integer objects], 
    tip_amount: if we have tip, we split the tip proportionally based on the order of each person [double]

    example:
    >>>even_splitter([tom: [23, 30], jeff: [18], cat: [80]], [tom, jeff, cat], 33)
    
    >>>even_splitter([tom: [23, 30], jeff: [18], cat: [80]], [tom, jeff, cat])
    
    '''