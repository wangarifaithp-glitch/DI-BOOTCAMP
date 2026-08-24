#split the sentence into words
sentence = input()
reversed_sentence = " ".join(sentence.split()[::-1])

print(reversed_sentence)
