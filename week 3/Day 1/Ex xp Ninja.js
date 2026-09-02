  // Exercise 1: BMI Comparison
  const person1 = {
    fullName: "John",
    mass: 78,
    height: 1.69,
    calculateBMI() {
      return this.mass / (this.height ** 2);
    }
  };

  const person2 = {
    fullName: "Sarah",
    mass: 62,
    height: 1.58,
    calculateBMI() {
      return this.mass / (this.height ** 2);
    }
  };

  function compareBMI(personA, personB) {
    const bmiA = personA.calculateBMI();
    const bmiB = personB.calculateBMI();

    console.log(`${personA.fullName}'s BMI: ${bmiA.toFixed(2)}`);
    console.log(`${personB.fullName}'s BMI: ${bmiB.toFixed(2)}`);

    if (bmiA > bmiB) {
      console.log(`${personA.fullName} has the largest BMI.`);
      return personA.fullName;
    } else if (bmiB > bmiA) {
      console.log(`${personB.fullName} has the largest BMI.`);
      return personB.fullName;
    } else {
      console.log("Both people have the same BMI.");
      return "Tie";
    }
  }

  console.log("Exercise 1: BMI Comparison");
  compareBMI(person1, person2);

  // Exercise 2: Grade Average
  function calculateAverage(gradesList) {
    const total = gradesList.reduce((sum, grade) => sum + grade, 0);
    return total / gradesList.length;
  }

  function checkResult(average) {
    if (average > 65) {
      console.log(`Average: ${average.toFixed(2)}. You passed.`);
    } else {
      console.log(`Average: ${average.toFixed(2)}. You failed and must repeat the course.`);
    }
  }

  function findAvg(gradesList) {
    const average = calculateAverage(gradesList);
    checkResult(average);
    return average;
  }

  console.log("\nExercise 2: Grade Average");
  findAvg([80, 70, 65, 90, 75]);
  findAvg([50, 60, 55, 58, 62]);
