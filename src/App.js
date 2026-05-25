import React, { useState } from "react";
import useExpenses from "./hooks/useExpenses";
import useFilters from "./hooks/useFilters";
import "./index.css";

function App() {
  const {
    expenses,
    addExpense,
    removeExpense,
    getTotalAmount,
    getExpensesByCategory,
    getMonthlyStats,
  } = useExpenses();
  const {
    filters,
    updateFilter,
    clearFilters,
    filteredData: filteredExpenses,
    getFilterSummary,
    sortConfig,
    setSortField,
  } = useFilters(expenses);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");

  const categories = [
    "all",
    "food",
    "transportation",
    "entertainment",
    "shopping",
    "bills",
    "other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    addExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      category,
    });
    setDescription("");
    setAmount("");
    setCategory("food");
  };

  return (
    <div className="App">
      <h1>Personal Expense Tracker</h1>
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="what did you spend on?"
            required
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Expense</button>
      </form>

      <div className="filters">
        <div className="form-group">
          <label>Filter by Category:</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all"
                  ? "All Categories"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Search Description:</label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div className="form-group">
          <label>Date From:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date To:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Min Amount:</label>
          <input
            type="number"
            step="0.01"
            value={filters.minAmount}
            onChange={(e) => updateFilter("minAmount", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label>Max Amount:</label>
          <input
            type="number"
            step="0.01"
            value={filters.maxAmount}
            onChange={(e) => updateFilter("maxAmount", e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="filters" style={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
        <h3>Sort By:</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSortField("date")}
            style={{
              padding: "8px 12px",
              backgroundColor: sortConfig.field === "date" ? "#007bff" : "#e0e0e0",
              color: sortConfig.field === "date" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: sortConfig.field === "date" ? "bold" : "normal",
            }}
          >
            Date {sortConfig.field === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => setSortField("amount")}
            style={{
              padding: "8px 12px",
              backgroundColor: sortConfig.field === "amount" ? "#007bff" : "#e0e0e0",
              color: sortConfig.field === "amount" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: sortConfig.field === "amount" ? "bold" : "normal",
            }}
          >
            Amount {sortConfig.field === "amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => setSortField("category")}
            style={{
              padding: "8px 12px",
              backgroundColor: sortConfig.field === "category" ? "#007bff" : "#e0e0e0",
              color: sortConfig.field === "category" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: sortConfig.field === "category" ? "bold" : "normal",
            }}
          >
            Category {sortConfig.field === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="form-group">
        {getFilterSummary().hasActiveFilters && (
          <button onClick={clearFilters}>
            Clear Filters({getFilterSummary().activeCount})
          </button>
        )}
        <div
          style={{
            margin: "20px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <p>
            Showing {getFilterSummary().totalResults} of {expenses.length}{" "}
            expenses.
            {getFilterSummary().hasActiveFilters &&
              ` (${getFilterSummary().activeCount} filter${getFilterSummary().activeCount > 1 ? "s" : ""} active)`}
          </p>
        </div>
      </div>
      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <p
            style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}
          >
            {expenses.length === 0
              ? "No expenses added yet. Start by adding your first expense!"
              : "No expenses match the current filters. Try adjusting or clearing your filters."}
          </p>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-category">
                  {expense.category.charAt(0).toUpperCase() +
                    expense.category.slice(1)}
                </div>
                <div Style={{ fontSize: "14px", color: "#666" }}>
                  {expense.date}
                </div>
              </div>
              <div className="expense-amount">${expense.amount.toFixed(2)}</div>
              <button
                className="remove-button"
                onClick={() => removeExpense(expense.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="total-section">
        <h3>Total Expenses</h3>
        <div className="total-amount">${getTotalAmount.toFixed(2)}</div>
        {getFilterSummary().hasActiveFilters && (
          <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Total for filtered expenses: $
            {filteredExpenses
              .reduce((total, exp) => total + exp.amount, 0)
              .toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
