// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#nav-Dashboard').addClass('active');
}

fetch('/Reports/Expense')
    .then(res => res.json())
    .then(data => {
        const expenses = data.data.map(e => e.SubTotal);
        const monthsExpenses= expenses[10];
        const yearExpenses = expenses.reduce((a, b) => a + b, 0);
        const currency = function (number) {
            return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', minimumFractionDigits: 2 }).format(number);
        };
        $("#monthsExpenses").html(currency(monthsExpenses));
        $("#yearExpenses").html(currency(yearExpenses));
    });