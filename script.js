"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-16T17:01:17.194Z",
    "2022-05-21T23:36:17.929Z",
    "2022-05-22T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2022-05-18T14:18:46.235Z",
    "2022-05-19T16:33:06.386Z",
    "2022-05-20T14:43:26.374Z",
    "2022-05-22T10:49:59.371Z",
    "2022-05-22T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-16T17:01:17.194Z",
    "2022-05-21T23:36:17.929Z",
    "2022-05-22T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-16T17:01:17.194Z",
    "2022-05-21T23:36:17.929Z",
    "2022-05-22T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currAccount;
let isSort = false;
let timer;
/* HELPER function */
function createUserName() {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((each) => each[0])
      .join("");
  });
}

function createMovDates() {
  accounts.forEach((acc) => {
    //apply movements__date into the containerMovements
    acc.movDates = acc.movementsDates.map((date) =>
      new Intl.DateTimeFormat(acc.locale).format(new Date(date))
    );
  });
}

//movements, dates pair object
class movObj {
  mov;
  date;
  constructor(mov, date) {
    this.mov = mov;
    this.date = date;
  }
}

function createMovTimeObj() {
  accounts.forEach(
    (acc) =>
      (acc.pair = acc.movements.map(
        (mov, i) => new movObj(mov, acc.movDates[i])
      ))
  );
}

/* INITIAL */
function initial() {
  createUserName();
  createMovDates();
  createMovTimeObj();
}

initial();

/* LOGIN */
function login() {
  //reset timer
  if (timer) clearInterval(timer);
  timer = timeOut();

  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  accounts.forEach((acc) => {
    if (acc.username === username && +pin === acc.pin) {
      containerApp.style.opacity = 1;
      labelWelcome.textContent = `Welcome ${acc.owner}`;
      currAccount = acc;
    }
  });

  //clear the input
  inputLoginUsername.value = "";
  inputLoginPin.value = "";

  displayMovements(currAccount);
  displayBalance(currAccount);
  displaySummary(currAccount);
}

/* DISPLAY MOVEMENTS */
function displayMovements(acc, isSort) {
  //clear the input on the previous account
  containerMovements.textContent = "";

  /* SORT */
  // const mov = isSort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;
  const movObj = isSort
    ? acc.pair.slice().sort((a, b) => a.mov - b.mov)
    : acc.pair;

  //acc.movements loop, [divString, divstring.....] -> string -> insert html
  movObj.map((movObj, i) => {
    const inout = movObj.mov > 0 ? "deposit" : "withdrawal";
    const html = ` 
        <div class="movements__row">
          <div class="movements__type movements__type--${inout}">${i} ${inout}</div>
          <div class="movements__date">${movObj.date}</div>
          <div class="movements__value">${Math.abs(movObj.mov)} €</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

/* DISPLAY BALANCE */
function displayBalance(acc) {
  labelBalance.textContent = `${acc.movements.reduce(
    (prev, mov) => prev + mov
  )} €`;
}
/* DISPLAY SUMMARY */
function displaySummary(acc) {
  //in
  labelSumIn.textContent = `${acc.movements
    .filter((mov) => mov > 0)
    .reduce((prev, mov) => prev + mov, 0)} €`;
  //out
  labelSumOut.textContent = `${-acc.movements
    .filter((mov) => mov < 0)
    .reduce((prev, mov) => prev + mov, 0)} €`;
  //interest
  labelSumInterest.textContent = `${acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0)}€`;
}
/* TRANSFER MONEY */
function transferMoney() {
  //reset timer
  if (timer) clearInterval(timer);
  timer = timeOut();

  const transferTo = inputTransferTo.value;
  const transferAmount = inputTransferAmount.value;
  console.log(accounts.find((acc) => acc.username === transferTo));

  if (accounts.find((acc) => acc.username === transferTo)) {
    const transferAcc = accounts.find((acc) => acc.username === transferTo);
    transferAcc.movements.push(+transferAmount);
    transferAcc.pair.push(
      new movObj(
        +transferAmount,
        new Intl.DateTimeFormat(currAccount.locale).format(new Date())
      )
    );
  }
  if (+transferAmount < parseInt(labelBalance.textContent)) {
    currAccount.movements.push(-+transferAmount);
    currAccount.pair.push(
      new movObj(
        -+transferAmount,
        new Intl.DateTimeFormat(currAccount.locale).format(new Date())
      )
    );
  }

  inputTransferTo.value = "";
  inputTransferAmount.value = "";
}
/* REQUEST LOAN */
function requestLoan() {
  //reset timer
  if (timer) clearInterval(timer);
  timer = timeOut();

  const loanAmount = +inputLoanAmount.value;
  const totalBalance = parseInt(labelBalance.textContent);
  console.log(loanAmount, totalBalance);
  if (totalBalance > loanAmount) {
    // labelBalance.textContent = `${totalBalance + loanAmount}`
    currAccount.movements.push(loanAmount);
    currAccount.pair.push(
      new movObj(
        loanAmount,
        new Intl.DateTimeFormat(currAccount.locale).format(new Date())
      )
    );
    console.log(currAccount.movements, currAccount.pair);
    displayBalance(currAccount);
    displayMovements(currAccount);
    displaySummary(currAccount);

    inputLoanAmount.value = "";
  }
  // console.log(currAccount);
}
/* CLOASE ACCOUNT */
function closeAccount() {
  //reset timer
  if (timer) clearInterval(timer);
  timer = timeOut();

  const username = inputCloseUsername.value;
  const pin = +inputClosePin.value;
  console.log(username, pin);
  if (currAccount.username === username && currAccount.pin === pin) {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";

    inputClosePin.value = "";
    inputCloseUsername.value = "";
    //remove curraccount from accounts
    accounts.splice(accounts.indexOf(currAccount), 1);
  }
}
/* LOG OUT TIMEOUT */
function timeOut() {
  let time = 5 * 60;
  //setInterval call back function tick - start countdown once log in, so needs tick() to run immediately;

  function tick() {
    let seconds = parseInt(time % 60, 10);
    let minutes = parseInt(time / 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // let minutes = String(parseInt(time / 60, 10)).padStart(2, '0');
    // let seconds = String(parseInt(time % 60, 10)).padStart(2, '0');

    labelTimer.textContent = minutes + ":" + seconds;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }
    time -= 1;
  }
  //start countdown once log in, so needs tick() to run immediately;
  tick();
  timer = setInterval(tick, 1000);
  //for reset timer
  return timer;
}

/* REFERENCE LEARN */
// const startLogOutTimer = function () {
//   // 3.
//   // There is always this 1s delay after the app loads and the start of the timer. And also between logins. So let's export the timer callback into its own function, and run it right away
//   const tick = function () {
//     let minutes = String(parseInt(time / 60, 10)).padStart(2, '0');
//     let seconds = String(parseInt(time % 60, 10)).padStart(2, '0');
//     // console.log(minutes, seconds);

//     // Displaying time in element and clock
//     labelTimer.textContent = `${minutes}:${seconds}`;

//     // Finish timer
//     if (time === 0) {
//       // We need to finish the timer, otherwise it will run forever
//       clearInterval(timer);

//       // We log out the user, which means to fade out the app
//       containerApp.style.opacity = 0;
//       labelWelcome.textContent = 'Log in to get started';
//     }

//     // Subtract 1 second from time for the next iteration
//     time--;
//   };

//   // Setting time to 5 minutes in seconds
//   let time = 10 * 60;
//   // let time = 10;

//   tick();
//   const timer = setInterval(tick, 1000);

//   // LATER
//   return timer;
// };

///EVENT HANDLER
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  login();
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log('isSort', isSort);
  isSort = !isSort;
  displayMovements(currAccount, isSort);
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  transferMoney();
  displayMovements(currAccount, false);
  displayBalance(currAccount);
  displaySummary(currAccount);
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  requestLoan();
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  closeAccount();
});
