// src/components/CurrencyRatesWidget.tsx
import React, { useEffect, useState } from "react";
import { DollarSign, Euro, RussianRubleIcon, Coins } from "lucide-react";
import axios from "axios";

interface CurrencyRate {
  currency: string;
  rate: number;
}

const availableCurrencies = ["USD", "EUR", "RUB", "KZT"]; // Добавьте другие валюты по необходимости

export const CurrencyRatesWidget: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<string>(() => {
    // Получение сохранённой валюты из localStorage или установка по умолчанию
    return localStorage.getItem("targetCurrency") || "RUB";
  });

  const CURRENCY_API_KEY = import.meta.env.VITE_EXCHANGERATE_API_KEY;
  const BASE_URL = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`; // Базовая валюта USD

  // Проверка наличия API ключа
  useEffect(() => {
    if (!CURRENCY_API_KEY) {
      setError(
        "API ключ не настроен. Пожалуйста, добавьте его в переменные окружения."
      );
      setLoading(false);
    }
  }, [CURRENCY_API_KEY]);

  const fetchRates = async () => {
    if (!CURRENCY_API_KEY) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL);
      if (response.data && response.data.conversion_rates) {
        const targetRate = response.data.conversion_rates[targetCurrency];
        if (targetRate) {
          const selectedRates: CurrencyRate[] = availableCurrencies
            .filter((currency) => currency !== targetCurrency) // Исключаем целевую валюту из списка
            .map((currency) => ({
              currency,
              rate: response.data.conversion_rates[currency]
                ? response.data.conversion_rates[currency] / targetRate
                : 0, // Если курс не найден, устанавливаем 0
            }));
          setRates(selectedRates);
        } else {
          throw new Error(`Курс для валюты ${targetCurrency} не найден.`);
        }
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
      const interval = setInterval(fetchRates, 10 * 60 * 1000); // Обновление каждые 10 минут
      return () => clearInterval(interval);
    }
  }, [BASE_URL, targetCurrency, CURRENCY_API_KEY]);

  // Обработчик изменения целевой валюты
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value;
    setTargetCurrency(selectedCurrency);
    localStorage.setItem("targetCurrency", selectedCurrency);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg text-white transition-all duration-300">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Coins className="w-5 h-5 mr-2" />
          Курсы Валют (к {targetCurrency})
        </h3>

        {/* Выбор Целевой Валюты */}
        <div className="flex justify-end mb-4">
          <label htmlFor="target-currency" className="mr-2">
            {/* Выберите валюту: */}
          </label>
          <select
            id="target-currency"
            value={targetCurrency}
            onChange={handleCurrencyChange}
            className="bg-transparent text-white rounded p-1"
          >
            {availableCurrencies.map((currency) => (
              <option
                key={currency}
                value={currency}
                className="text-black rounded p-1"
              >
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Отображение Курсов */}
      {loading ? (
        <p>Загрузка курсов валют...</p>
      ) : error ? (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}{" "}
          <button onClick={fetchRates} className="underline text-blue-500 ml-2">
            Повторить
          </button>
        </div>
      ) : rates.length > 0 ? (
        <ul>
          {rates.map((rate) => (
            <li key={rate.currency} className="flex items-center mb-2 p-2 ">
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
              {/* Добавьте другие иконки при необходимости */}
              <span className="font-medium">
                1 {rate.currency} = {rate.rate.toFixed(4)} {targetCurrency}
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
