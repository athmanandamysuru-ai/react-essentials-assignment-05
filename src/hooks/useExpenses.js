import { useState, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";
const useExpenses = () => {
  const [expenses, setExpenses] = useLocalStorage("expenses", []);

  const addExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      date: new Date().toLocaleDateString(),
    };
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
  };

  const removeExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id),
    );
  };

  const getTotalAmount = useMemo(() => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }, [expenses]);

  const getExpensesByCategory = (category) => {
    if (!category || category === "All") return expenses;
    return expenses.filter((expense) => expense.category === category);
  };

  const getMonthlyStats = useMemo(() => {
    const monthlyData = {};
    expenses.forEach((expense) => {
      const [month, day, year] = expense.date.split("/");
      const key = `${year}-${month}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          total: 0,
          count: 0,
          byCategory: {},
        };
      }
      monthlyData[key].total += expense.amount;
      monthlyData[key].count += 1;
      
      if (!monthlyData[key].byCategory[expense.category]) {
        monthlyData[key].byCategory[expense.category] = 0;
      }
      monthlyData[key].byCategory[expense.category] += expense.amount;
    });
    
    return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
  }, [expenses]);

  return {
    expenses,
    addExpense,
    removeExpense,
    getTotalAmount,
    getExpensesByCategory,
    getMonthlyStats,
  };
};

export default useExpenses;
