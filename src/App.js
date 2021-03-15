import React, { useState, useEffect } from 'react';
import './App.css';
import CurrencyRow from './currencyRow.js';

const BASE_URL = 'https://api.exchangeratesapi.io/latest';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();

  const [amount, setAmount] = useState(1); // this can represent either the to or from currency
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState();

  let toAmount, fromAmount;
  if(amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  } 

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        let firstCurrency = Object.keys(data.rates)[0];
        
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);

      })
  }, []) // changes DOM when the array changes empty array only get called once

  useEffect(() => {
    if(fromCurrency && toCurrency) {
        fetch(`${BASE_URL}?base=${fromCurrency}&symbols=&${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }
  
  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
