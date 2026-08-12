const liveDataFetcher = async (cryptoName) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=usd&include_24hr_change=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }
  const data = await response.json();
  if (!data[cryptoName]) {
    throw new Error("CryptoCurrency not found");
  }
  return data[cryptoName];
};

const searchForm = document.querySelector("#search-form");
const cryptoInput = document.querySelector("#crypto-input");
const resultsContainer = document.querySelector("#results-container");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = cryptoInput.value.trim().toLowerCase();
  if (!query) return;

  resultsContainer.innerHTML = `<p class="placeholder-text>Searching Live market data...</p>`;
  try {
    const coinData = await liveDataFetcher(query);
    const price = coinData.usd.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const change = coinData.usd_24h_change.toFixed(2);
    const isPositive = coinData.usd_24h_change >= 0;

    resultsContainer.innerHTML = `
        <div class="crypto-card">
          <div class="crypto-header">
            <span class="crypto-title">${query}</span>
            <span class="crypto-price">${price}</span>
        </div>
        <div class="crypto-stats">
          <span>24h Change: <strong style="color: ${isPositive ? "#4ade80" : "#f87171"}">${isPositive ? "+" : ""}${change}%</strong></span>
          <span>Currency: USD</span>
        </div>
      </div>  
    `;
    cryptoInput.value = "";
  } catch (error) {
    resultsContainer.innerHTML = `<p class="error-text">${error.message}</p>`;
  }
});
