import {useState, useMemo} from 'react';


const useFilters= (data) => {
    const [filters, setFilters] = useState({
        category: "all",
        dateFrom: "",
        dateTo: "",
        minAmount: "",
        maxAmount: "",
        searchTerm: "",
    });

    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc",
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: "all",
            dateFrom: "",
            dateTo: "",
            minAmount: "",
            maxAmount: "",
            searchTerm: "",
        });
    };

    const setSortField = (field) => {
        setSortConfig((prev) => ({
            field,
            direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const filteredData = useMemo(() => {
        let result = data.filter((item) => {
            if(filters.category !== "all" && item.category !== filters.category) return false;

            if(filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) return false;

            if(filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) return false;

            if(filters.minAmount && item.amount < parseFloat(filters.minAmount)) return false;
            if(filters.maxAmount && item.amount > parseFloat(filters.maxAmount)) return false;

            if(filters.searchTerm && !item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;

            return true;
        });

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;

            switch (sortConfig.field) {
                case "amount":
                    aVal = a.amount;
                    bVal = b.amount;
                    break;
                case "date":
                    aVal = new Date(a.date).getTime();
                    bVal = new Date(b.date).getTime();
                    break;
                case "category":
                    aVal = a.category;
                    bVal = b.category;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [data, filters, sortConfig]);

    const getFilterSummary = () => {
        const activeFilters= Object.entries(filters).filter(([key, value]) => {
            if(key === "category") return value !== "all";
            return value !== "" && value !== null;
        });

        return {
            activeCount: activeFilters.length,
            totalResults: filteredData.length,
            hasActiveFilters: activeFilters.length > 0,
        };
    };

    return {
        filters,
        updateFilter,
        clearFilters,
        filteredData,
        getFilterSummary,
        sortConfig,
        setSortField,
    };
};

export default useFilters;