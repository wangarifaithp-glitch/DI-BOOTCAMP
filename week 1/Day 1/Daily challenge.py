import random


text = input("Enter a string: ")

if len(text) < 10:
    print("String not long enough.")
elif len(text) > 10:
    print("String too long.")
else:
    print("Perfect string")
    print("First character:", text[0])
    print("Last character:", text[-1])

    built_string = ""
    for character in text:
        built_string += character
        print(built_string)

    characters = list(text)
    random.shuffle(characters)
    print("Jumbled string:", "".join(characters))