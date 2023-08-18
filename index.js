const app = document.querySelector('#app');

let state = {
  title: 'Your Balance',
  description: 'Monitor Your spendings ...',
  currency: 'EUR',
  transactions: [
    { id: '1', text: 'Salary', amount: 1578 },
    { id: '2', text: 'Book Sale', amount: 42 },
    { id: '3', text: 'Grocceries', amount: -37.83 },
    { id: '4', text: 'Accident', amount: -823 },
  ],
};

const currencyFormat = new Intl.NumberFormat(navigator.language || 'nl-NL', {
  style: 'currency',
  currency: state.currency,
});

const handleClick = (event) => {
  const id = event.target.id;
  if (!id) return;
  event.preventDefault();
  state = {
    ...state,
    transactions: [...state.transactions.filter((i) => i.id !== id)],
  };

  render(state);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  state = {
    ...state,
    transactions: [
      ...state.transactions,
      {
        id: self.crypto.randomUUID(),
        text: formData.get('text'),
        amount: +formData.get('amount'),
      },
    ],
  };

  render(state);
};

const calcTotal = (transactions) =>
  transactions.reduce((acc, curr) => acc + curr.amount, 0);

const transactionList = (transactions) => `
  <ul>
    ${transactions
      .map((transaction) => {
        const { id, text, amount } = transaction;
        return `
          <li style="display: flex; gap: 1rem">
            <span>${text}</span>
            <span style="
                margin-left: auto;
                color: ${amount >= 0 ? 'green' : 'red'};
              "
            >${currencyFormat.format(amount)}</span>
            <span><button id="${id}">delete</button></span>
          </li>
        `;
      })
      .join('')}
  </ul>
`;

const form = () => `
  <form>
    <input type="text" name="text" placeholder="text" required/>
    <input type="number" name="amount" placeholder="amount" required/>
    <button>Send</button>
  </form>
`;

const render = (state) => {
  const { title, description, transactions } = state;
  const total = calcTotal(transactions);

  app.innerHTML = `
    <h1>${title}</h1>
    <p>${description}</p>
    <p style="color: ${total >= 0 ? 'green' : 'red'}; font-size: 3rem">
      ${currencyFormat.format(total)}
    </p>
    ${transactionList(transactions)}
    ${form()}
  `;
};

// inital render
render(state);

app.addEventListener('click', handleClick);
app.addEventListener('submit', handleSubmit);
