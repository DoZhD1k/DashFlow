import React, { useEffect, useState } from "react";
import { DollarSign, Euro, RussianRubleIcon, Coins } from "lucide-react";
import axios from "axios";

interface CurrencyRate {
  currency: string;
  rate: number;
}

const availableCurrencies = ["USD", "EUR", "RUB", "KZT"]; // Список валют

export const CurrencyRatesWidget: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<string>(() => {
    return localStorage.getItem("targetCurrency") || "USD";
  });

  const CURRENCY_API_KEY = import.meta.env.VITE_EXCHANGERATE_API_KEY;
  const BASE_URL = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`;

  // Проверка наличия API ключа
  useEffect(() => {
    if (!CURRENCY_API_KEY) {
      setError("API ключ не настроен. Добавьте его в переменные окружения.");
      setLoading(false);
    }
  }, [CURRENCY_API_KEY]);

  // Функция загрузки курсов валют
  const fetchRates = async (forceUpdate = false) => {
    if (!CURRENCY_API_KEY) return;

    setLoading(true);
    setError(null);

    try {
      // Получаем сохраненные курсы для выбранной валюты
      const cachedData = localStorage.getItem(
        `currencyRates_${targetCurrency}`
      );
      const oneHour = 60 * 60 * 1000;

      if (cachedData && !forceUpdate) {
        const { rates: cachedRates, timestamp } = JSON.parse(cachedData);

        // Используем кэшированные данные, если они свежие
        if (Date.now() - timestamp < oneHour) {
          console.log(`Используем кешированные данные для ${targetCurrency}`);
          setRates(cachedRates);
          setLoading(false);
          return;
        }
      }

      // Запрашиваем данные по выбранной валюте
      console.log(`Запрашиваем новые данные с API для ${targetCurrency}...`);
      const response = await axios.get(BASE_URL);

      if (response.data && response.data.conversion_rates) {
        const conversionRates = response.data.conversion_rates;

        // Формируем данные для отображения
        const selectedRates: CurrencyRate[] = availableCurrencies
          .filter((currency) => currency !== targetCurrency)
          .map((currency) => ({
            currency,
            rate: conversionRates[currency] || 0,
          }));

        setRates(selectedRates);

        // Сохраняем данные в localStorage для этой валюты
        localStorage.setItem(
          `currencyRates_${targetCurrency}`,
          JSON.stringify({
            rates: selectedRates,
            timestamp: Date.now(),
          })
        );
      } else {
        throw new Error("Некорректный ответ от API");
      }
    } catch (err: any) {
      console.error("Ошибка при получении курсов валют:", err);
      setError("Не удалось загрузить курсы валют.");
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (CURRENCY_API_KEY) {
      fetchRates();
      const interval = setInterval(() => fetchRates(true), 10 * 60 * 1000); // Обновление каждые 10 минут
      return () => clearInterval(interval);
    }
  }, [targetCurrency, CURRENCY_API_KEY]);

  // Обработчик изменения целевой валюты
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value;
    setTargetCurrency(selectedCurrency);
    localStorage.setItem("targetCurrency", selectedCurrency);
    fetchRates(true); // Обновляем данные при смене валюты
  };

  return (
    <div className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow-lg transition-all duration-300">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Coins className="w-5 h-5 mr-2" />
          {targetCurrency}
        </h3>

        {/* Выбор валюты */}
        <div className="flex justify-end mb-4">
          <select
            id="target-currency"
            value={targetCurrency}
            onChange={handleCurrencyChange}
            title="currency"
            className="bg-transparent rounded p-1"
          >
            {availableCurrencies.map((currency) => (
              <option
                key={currency}
                value={currency}
                className="rounded p-1 dark:bg-stone-700"
              >
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Отображение курсов */}
      {loading ? (
        <p>Загрузка курсов валют...</p>
      ) : error ? (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
          <button
            onClick={() => fetchRates(true)}
            className="underline text-blue-500 ml-2"
          >
            Повторить
          </button>
        </div>
      ) : rates.length > 0 ? (
        <ul>
          {rates.map((rate) => (
            <li key={rate.currency} className="flex items-center mb-2 p-2">
              {rate.currency === "USD" && (
                <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
              )}
              {rate.currency === "EUR" && (
                <Euro className="w-5 h-5 mr-2 text-gray-300" />
              )}
              {rate.currency === "RUB" && (
                <RussianRubleIcon className="w-5 h-5 mr-2 text-red-500" />
              )}
              {rate.currency === "KZT" && (
                <Coins className="w-5 h-5 mr-2 text-yellow-500" />
              )}
              <span className="font-medium">
                1 {targetCurrency} = {rate.rate.toFixed(4)} {rate.currency}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет доступных данных для отображения.</p>
      )}
    </div>
  );
};
