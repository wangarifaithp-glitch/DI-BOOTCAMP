students = []

for _ in range(5):
	name = input("Name: ")
	age = input("Age: ")
	score = input("Score: ")
	students.append((name, age, score))

students.sort(key=lambda student: (student[0], int(student[1]), int(student[2])))

print(students)
