x = int(input("Enter the Number: "))
#   A number is perfect if the sum of its prop

divisor_sum = sum(divisor for divisor in range(1, x) if x % divisor == 0)
print(x > 0 and divisor_sum == x)
