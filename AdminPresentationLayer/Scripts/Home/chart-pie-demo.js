// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

fetch('/Reports/ProductsTotalSales')
    .then(res => res.json())
    .then(data => {
        const colors = {
            "indigo": "#6610f2",
            "blue": "#4e73df",
            "purple": "#6f42c1",
            "pink": "#e83e8c",
            "red": "#e74a3b",
            "orange": "#fd7e14",
            "yellow": "#f6c23e",
            "green": "#1cc88a",
            "teal": "#20c9a6",
            "cyan": "#36b9cc",
            "white": "#ffff",
            "gray": "#858796",
            "gray-dark": "#5a5c69",
            "primary": "#4e73df",
            "secondary": "#858796",
            "success": "#1cc88a",
            "info": "#36b9cc",
            "warning": "#f6c23e",
            "danger": "#e74a3b",
            "light": "#f8f9fc",
            "dark": "#5a5c69",
        }
        const products = data.data.map(e => e.FullName);
        const totalSales = data.data.map(e => e.TotalSales);
        $("#p1").html('<i class="fas fa-circle text-primary"></i>' + products[0])
        $("#p2").html('<i class="fas fa-circle text-success"></i>' + products[1])
        $("#p3").html('<i class="fas fa-circle text-info"></i>' + products[2])
        // Pie Chart Example
        var ctx = document.getElementById("myPieChart");
        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: products,
                datasets: [{
                    data: totalSales,
                    backgroundColor: [colors["primary"], colors["success"], colors["info"], colors["green"], colors["red"], colors["orange"], colors["yellow"], colors["purple"], colors["blue"], colors["cyan"]]
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: false
                },
                cutoutPercentage: 80,
            },
        });
    })