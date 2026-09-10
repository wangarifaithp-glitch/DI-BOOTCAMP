function compareToTen(num) {
	return new Promise((resolve, reject) => {
		if (num <= 10) {
			resolve(`${num} is less than or equal to 10`);
		} else {
			reject(`${num} is greater than 10`);
		}
	});
}

compareToTen(15)
	.then(result => console.log(result))
	.catch(error => console.log(error));

compareToTen(8)
	.then(result => console.log(result))
	.catch(error => console.log(error));

const delayedSuccess = new Promise(resolve => {
	setTimeout(() => resolve("success"), 4000);
});

delayedSuccess.then(result => console.log(result));

Promise.resolve(3).then(value => console.log(value));

Promise.reject("Boo!").catch(error => console.log(error));
